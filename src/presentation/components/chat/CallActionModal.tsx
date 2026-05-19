import React from "react";
import { View, Modal, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";

interface CallActionModalProps {
  visible: boolean;
  onClose: () => void;
  participantName: string;
  callType: "voice" | "video";
  onConfirm: () => void;
  isBlocked?: boolean;
  blockReason?: string | null;
}

export function CallActionModal({
  visible,
  onClose,
  participantName,
  callType,
  onConfirm,
  isBlocked = false,
  blockReason,
}: CallActionModalProps) {
  const { colors } = useTheme();
  const isVoice = callType === "voice";
  const callLabel = isVoice ? "Chamada de Voz" : "Chamada de Vídeo";
  const iconName = isVoice ? "call-outline" : "videocam-outline";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.45)",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
        onPress={onClose}
      >
        <Pressable
          style={{
            backgroundColor: colors.surface,
            borderRadius: 24,
            padding: 28,
            width: "100%",
            maxWidth: 340,
            alignItems: "center",
            gap: 16,
          }}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Icon */}
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: colors.secondary + "20",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name={iconName} size={32} color={colors.secondary} />
          </View>

          {/* Title */}
          <AppText
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: colors.content,
              textAlign: "center",
            }}
          >
            {callLabel}
          </AppText>

          {isBlocked ? (
            <>
              <AppText
                style={{
                  fontSize: 14,
                  color: colors.subtle,
                  textAlign: "center",
                  lineHeight: 20,
                }}
              >
                {blockReason ?? "Esta funcionalidade não está disponível no momento."}
              </AppText>
              <TouchableOpacity
                onPress={onClose}
                activeOpacity={0.8}
                style={{
                  width: "100%",
                  height: 48,
                  borderRadius: 24,
                  backgroundColor: colors.secondary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AppText style={{ fontSize: 15, fontWeight: "700", color: "#fff" }}>
                  Entendido
                </AppText>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <AppText
                style={{
                  fontSize: 14,
                  color: colors.subtle,
                  textAlign: "center",
                  lineHeight: 20,
                }}
              >
                Deseja iniciar {isVoice ? "chamada de voz" : "chamada de vídeo"} com{" "}
                {participantName}?
              </AppText>
              <View style={{ flexDirection: "row", gap: 12, width: "100%" }}>
                <TouchableOpacity
                  onPress={onClose}
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    height: 48,
                    borderRadius: 24,
                    borderWidth: 1.5,
                    borderColor: colors.border,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AppText style={{ fontSize: 15, fontWeight: "600", color: colors.content }}>
                    Cancelar
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onConfirm}
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: colors.secondary,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AppText style={{ fontSize: 15, fontWeight: "700", color: "#fff" }}>
                    Iniciar
                  </AppText>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
