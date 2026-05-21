import React from "react";
import { View, Modal, TouchableOpacity, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { OnlineStatusBadge } from "./OnlineStatusBadge";
import { useTheme } from "../../../core/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getConversationInfoConfig } from "../../../utils/conversationInfoConfig";
import type { ChatConversation } from "../../../types/chat";

interface ConversationInfoModalProps {
  visible: boolean;
  onClose: () => void;
  conversation: ChatConversation;
  userRole: "patient" | "professional";
  isMuted: boolean;
  onNavigate: (action: string) => void;
}

export function ConversationInfoModal({
  visible,
  onClose,
  conversation,
  userRole,
  isMuted,
  onNavigate,
}: ConversationInfoModalProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { participant } = conversation;

  const { infoRows, actionRows } = getConversationInfoConfig(userRole, conversation, isMuted);

  const isSupport =
    conversation.conversationType === "support" ||
    conversation.participant.role === "support";

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
            maxHeight: "88%",
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
            {/* Avatar header */}
            <View
              style={{ alignItems: "center", paddingHorizontal: 20, paddingBottom: 20, gap: 10 }}
            >
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
                {!isSupport && (
                  <View style={{ position: "absolute", bottom: 2, right: 2 }}>
                    <OnlineStatusBadge isOnline={participant.isOnline} />
                  </View>
                )}
              </View>

              <AppText style={{ fontSize: 18, fontWeight: "700", color: colors.content }}>
                {participant.name}
              </AppText>
              <AppText style={{ fontSize: 14, color: colors.subtle }}>{participant.subtitle}</AppText>
            </View>

            {/* Info rows */}
            {infoRows.length > 0 && (
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
                      <AppText style={{ flex: 1, fontSize: 14, color: colors.subtle }}>
                        {row.label}
                      </AppText>
                      <AppText style={{ fontSize: 14, fontWeight: "600", color: colors.content }}>
                        {row.value}
                      </AppText>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Action rows */}
            <View style={{ paddingHorizontal: 20, gap: 4 }}>
              {actionRows.map((row) => (
                <TouchableOpacity
                  key={row.action}
                  onPress={() => {
                    onClose();
                    onNavigate(row.action);
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
                      backgroundColor: (row.color ?? colors.secondary) + "18",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name={row.icon as any}
                      size={18}
                      color={row.color ?? colors.secondary}
                    />
                  </View>
                  <AppText
                    style={{ flex: 1, fontSize: 14, fontWeight: "600", color: colors.content }}
                  >
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
