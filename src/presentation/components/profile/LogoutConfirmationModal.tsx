import React from "react";
import { View, Modal, TouchableWithoutFeedback } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { AppButton } from "../ui/AppButton";
import { useTheme } from "../../../core/theme";

interface LogoutConfirmationModalProps {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmationModal({
  visible,
  onCancel,
  onConfirm,
}: LogoutConfirmationModalProps) {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <View
          className="flex-1 items-center justify-center px-8"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <TouchableWithoutFeedback>
            <View
              className="w-full bg-surface dark:bg-surface-dark rounded-3xl p-6 gap-5"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.25,
                shadowRadius: 24,
                elevation: 20,
              }}
            >
              {/* Icon */}
              <View className="items-center">
                <View
                  className="w-16 h-16 rounded-full items-center justify-center"
                  style={{ backgroundColor: colors.error + "18" }}
                >
                  <Ionicons name="log-out-outline" size={32} color={colors.error} />
                </View>
              </View>

              {/* Text */}
              <View className="items-center gap-2">
                <AppText variant="heading3" className="font-bold text-center">
                  Sair da conta?
                </AppText>
                <AppText variant="body" color="muted" className="text-center leading-6">
                  Deseja realmente sair da sua conta do HealthMind?
                </AppText>
              </View>

              {/* Buttons */}
              <View className="gap-2.5">
                <AppButton
                  label="Sair"
                  onPress={onConfirm}
                  variant="primary"
                  style={{ backgroundColor: colors.error }}
                />
                <AppButton label="Cancelar" onPress={onCancel} variant="outline" />
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
