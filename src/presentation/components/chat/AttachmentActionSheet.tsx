import React from "react";
import { View, Modal, TouchableOpacity, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ActionItem {
  id: string;
  icon: string;
  label: string;
  color: string;
}

interface AttachmentActionSheetProps {
  visible: boolean;
  onClose: () => void;
  onAction: (actionId: string) => void;
  userRole: "patient" | "professional";
}

export function AttachmentActionSheet({
  visible,
  onClose,
  onAction,
  userRole,
}: AttachmentActionSheetProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const patientActions: ActionItem[] = [
    { id: "image", icon: "image-outline", label: "Enviar imagem", color: "#6366F1" },
    { id: "document", icon: "document-outline", label: "Enviar documento", color: "#F59E0B" },
    { id: "diary", icon: "book-outline", label: "Diário emocional", color: "#10B981" },
    { id: "audio", icon: "mic-outline", label: "Enviar áudio", color: "#8B5CF6" },
    { id: "appointment", icon: "calendar-outline", label: "Solicitar consulta", color: colors.secondary },
    { id: "mood", icon: "happy-outline", label: "Compartilhar humor", color: "#F97316" },
  ];

  const professionalActions: ActionItem[] = [
    { id: "document", icon: "document-outline", label: "Enviar documento", color: "#F59E0B" },
    { id: "guidance", icon: "medical-outline", label: "Enviar orientação", color: "#10B981" },
    { id: "checkin", icon: "checkmark-circle-outline", label: "Solicitar check-in", color: "#6366F1" },
    { id: "activity", icon: "fitness-outline", label: "Compartilhar atividade", color: "#F97316" },
    { id: "appointment", icon: "calendar-outline", label: "Agendar consulta", color: colors.secondary },
    { id: "billing", icon: "cash-outline", label: "Enviar cobrança", color: "#EF4444" },
  ];

  const actions = userRole === "patient" ? patientActions : professionalActions;

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
            paddingTop: 12,
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
              marginBottom: 20,
            }}
          />

          <AppText
            style={{
              fontSize: 15,
              fontWeight: "700",
              color: colors.content,
              paddingHorizontal: 20,
              marginBottom: 16,
            }}
          >
            Compartilhar
          </AppText>

          {/* Grid of actions */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              paddingHorizontal: 12,
              gap: 8,
            }}
          >
            {actions.map((action) => (
              <TouchableOpacity
                key={action.id}
                onPress={() => {
                  onAction(action.id);
                  onClose();
                }}
                activeOpacity={0.75}
                style={{
                  width: "47%",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  backgroundColor: colors.background,
                  borderRadius: 14,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 12,
                    backgroundColor: action.color + "20",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name={action.icon as any} size={22} color={action.color} />
                </View>
                <AppText
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: colors.content,
                    flex: 1,
                  }}
                  numberOfLines={2}
                >
                  {action.label}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
