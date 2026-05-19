import React from "react";
import { View, Modal, TouchableOpacity, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { OnlineStatusBadge } from "./OnlineStatusBadge";
import { useTheme } from "../../../core/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { ChatConversation } from "../../../types/chat";

interface ConversationInfoModalProps {
  visible: boolean;
  onClose: () => void;
  conversation: ChatConversation;
  userRole: "patient" | "professional";
  onNavigate: (action: string) => void;
}

interface InfoRow {
  icon: string;
  label: string;
  value: string;
  action?: string;
}

interface ActionRow {
  icon: string;
  label: string;
  action: string;
  color?: string;
}

export function ConversationInfoModal({
  visible,
  onClose,
  conversation,
  userRole,
  onNavigate,
}: ConversationInfoModalProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { participant } = conversation;

  const patientActionRows: ActionRow[] = [
    { icon: "person-outline", label: "Ver perfil", action: "view-profile" },
    { icon: "calendar-outline", label: "Agendar consulta", action: "schedule-appointment" },
    { icon: "headset-outline", label: "Suporte", action: "support" },
    { icon: participant.isTyping || conversation.isMuted ? "volume-high-outline" : "volume-mute-outline", label: conversation.isMuted ? "Reativar notificações" : "Silenciar", action: "mute" },
  ];

  const professionalActionRows: ActionRow[] = [
    { icon: "document-text-outline", label: "Abrir prontuário", action: "patient-chart" },
    { icon: "stats-chart-outline", label: "Painel de Evolução", action: "evolution" },
    { icon: "calendar-outline", label: "Agendar consulta", action: "schedule-appointment" },
    { icon: "checkmark-circle-outline", label: "Solicitar check-in", action: "request-checkin" },
    { icon: conversation.isMuted ? "volume-high-outline" : "volume-mute-outline", label: conversation.isMuted ? "Reativar notificações" : "Silenciar", action: "mute" },
  ];

  const actionRows = userRole === "patient" ? patientActionRows : professionalActionRows;

  const patientInfoRows: InfoRow[] = [
    { icon: "briefcase-outline", label: "Especialidade", value: participant.subtitle },
    { icon: "radio-button-on-outline", label: "Status", value: participant.isOnline ? "Online" : "Offline" },
    { icon: "calendar-outline", label: "Próxima consulta", value: "Ver agenda" },
  ];

  const professionalInfoRows: InfoRow[] = [
    { icon: "radio-button-on-outline", label: "Status", value: participant.isOnline ? "Online" : "Offline" },
    { icon: "time-outline", label: "Última interação", value: participant.lastSeen ? new Date(participant.lastSeen).toLocaleDateString("pt-BR") : "Hoje" },
    { icon: "calendar-outline", label: "Próxima consulta", value: "Ver agenda" },
  ];

  const infoRows = userRole === "patient" ? patientInfoRows : professionalInfoRows;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" }}
        onPress={onClose}
      >
        <Pressable
          style={{
            backgroundColor: colors.surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: "85%",
            paddingBottom: insets.bottom + 16,
          }}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Handle bar */}
          <View
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              backgroundColor: colors.border,
              alignSelf: "center",
              marginTop: 12,
              marginBottom: 20,
            }}
          />

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Avatar Header */}
            <View style={{ alignItems: "center", paddingHorizontal: 20, paddingBottom: 20, gap: 10 }}>
              <View style={{ position: "relative" }}>
                <View
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 36,
                    backgroundColor: colors.secondary + "22",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AppText style={{ fontSize: 26, fontWeight: "700", color: colors.secondary }}>
                    {participant.avatarInitials}
                  </AppText>
                </View>
                <View style={{ position: "absolute", bottom: 2, right: 2 }}>
                  <OnlineStatusBadge isOnline={participant.isOnline} />
                </View>
              </View>
              <AppText style={{ fontSize: 18, fontWeight: "700", color: colors.content }}>
                {participant.name}
              </AppText>
              <AppText style={{ fontSize: 14, color: colors.subtle }}>{participant.subtitle}</AppText>
            </View>

            {/* Info rows */}
            <View style={{ paddingHorizontal: 20, marginBottom: 16 }}>
              <View
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                  overflow: "hidden",
                }}
              >
                {infoRows.map((row, idx) => (
                  <View
                    key={row.label}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 16,
                      paddingVertical: 13,
                      borderBottomWidth: idx < infoRows.length - 1 ? 1 : 0,
                      borderBottomColor: colors.border,
                      gap: 12,
                    }}
                  >
                    <Ionicons name={row.icon as any} size={18} color={colors.subtle} />
                    <AppText style={{ flex: 1, fontSize: 14, color: colors.subtle }}>{row.label}</AppText>
                    <AppText style={{ fontSize: 14, fontWeight: "600", color: colors.content }}>
                      {row.value}
                    </AppText>
                  </View>
                ))}
              </View>
            </View>

            {/* Action rows */}
            <View style={{ paddingHorizontal: 20, gap: 4 }}>
              {actionRows.map((row) => (
                <TouchableOpacity
                  key={row.action}
                  onPress={() => {
                    onNavigate(row.action);
                    onClose();
                  }}
                  activeOpacity={0.75}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 13,
                    paddingHorizontal: 16,
                    backgroundColor: colors.background,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: colors.border,
                    gap: 14,
                  }}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      backgroundColor: colors.secondary + "18",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name={row.icon as any} size={18} color={row.color ?? colors.secondary} />
                  </View>
                  <AppText style={{ flex: 1, fontSize: 14, fontWeight: "600", color: colors.content }}>
                    {row.label}
                  </AppText>
                  <Ionicons name="chevron-forward" size={16} color={colors.subtle} />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
