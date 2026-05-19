import React from "react";
import {
  Modal,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";

interface PaymentActionModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm?: () => void;
  loading?: boolean;
  danger?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function PaymentActionModal({
  visible,
  onClose,
  title,
  message,
  confirmLabel = "Confirmar",
  onConfirm,
  loading = false,
  danger = false,
  icon = "information-circle-outline",
}: PaymentActionModalProps) {
  const { colors } = useTheme();

  const confirmColor = danger ? colors.error : colors.secondary;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 24,
            padding: 28,
            width: "100%",
            maxWidth: 360,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 24,
            elevation: 12,
          }}
        >
          {/* Icon */}
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: confirmColor + "1A",
              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons name={icon} size={28} color={confirmColor} />
          </View>

          {/* Title */}
          <AppText
            style={{
              fontSize: 18,
              fontWeight: "800",
              color: colors.content,
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            {title}
          </AppText>

          {/* Message */}
          <AppText
            style={{
              fontSize: 14,
              color: colors.subtle,
              textAlign: "center",
              lineHeight: 22,
              marginBottom: 24,
            }}
          >
            {message}
          </AppText>

          {/* Loading indicator */}
          {loading && (
            <ActivityIndicator
              size="small"
              color={confirmColor}
              style={{ marginBottom: 16 }}
            />
          )}

          {/* Buttons */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              disabled={loading}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 14,
                paddingVertical: 14,
                alignItems: "center",
                opacity: loading ? 0.5 : 1,
              }}
            >
              <AppText
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: colors.subtle,
                }}
              >
                Cancelar
              </AppText>
            </TouchableOpacity>

            {onConfirm && (
              <TouchableOpacity
                onPress={onConfirm}
                activeOpacity={0.7}
                disabled={loading}
                style={{
                  flex: 1,
                  backgroundColor: confirmColor,
                  borderRadius: 14,
                  paddingVertical: 14,
                  alignItems: "center",
                  opacity: loading ? 0.5 : 1,
                }}
              >
                <AppText
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color: "#fff",
                  }}
                >
                  {confirmLabel}
                </AppText>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}
