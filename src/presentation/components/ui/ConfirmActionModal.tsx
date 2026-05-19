import React from "react";
import { View, Modal, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "./AppText";
import { useTheme } from "../../../core/theme";

interface ConfirmActionModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
  description: React.ReactNode;
  confirmLabel?: string | boolean;
  cancelLabel?: string | boolean;
  confirmColor?: string;
}

export function ConfirmActionModal({
  visible,
  onConfirm,
  onCancel,
  isLoading = false,
  icon,
  iconColor,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  confirmColor,
}: ConfirmActionModalProps) {
  const { colors } = useTheme();
  const btnColor = confirmColor ?? colors.secondary;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => !isLoading && onCancel()}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 32,
        }}
      >
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 24,
            padding: 28,
            width: "100%",
            alignItems: "center",
          }}
        >
          {/* Icon */}
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: iconColor + "18",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Ionicons name={icon} size={28} color={iconColor} />
          </View>

          {/* Title */}
          <AppText
            style={{
              fontSize: 20,
              fontWeight: "800",
              color: colors.content,
              textAlign: "center",
              marginBottom: 10,
            }}
          >
            {title}
          </AppText>

          {/* Description */}
          <View style={{ marginBottom: 24 }}>
            {typeof description === "string" ? (
              <AppText
                style={{
                  fontSize: 14,
                  color: colors.subtle,
                  textAlign: "center",
                  lineHeight: 20,
                }}
              >
                {description}
              </AppText>
            ) : (
              description
            )}
          </View>

          {/* Confirm button */}
          <TouchableOpacity
            onPress={onConfirm}
            disabled={isLoading}
            activeOpacity={0.85}
            style={{
              width: "100%",
              backgroundColor: btnColor,
              borderRadius: 99,
              paddingVertical: 15,
              alignItems: "center",
              marginBottom: 10,
              shadowColor: btnColor,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.28,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <AppText style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                {confirmLabel}
              </AppText>
            )}
          </TouchableOpacity>

          {/* Cancel button */}
          {cancelLabel !== false && (
            <TouchableOpacity
            onPress={onCancel}
            disabled={isLoading}
            activeOpacity={0.7}
            style={{
              width: "100%",
              borderRadius: 99,
              paddingVertical: 15,
              alignItems: "center",
              borderWidth: 1.5,
              borderColor: colors.border,
            }}
          >
            <AppText style={{ color: colors.subtle, fontWeight: "600", fontSize: 16 }}>
              {cancelLabel}
            </AppText>
          </TouchableOpacity> )}
        </View>
      </View>
    </Modal>
  );
}
