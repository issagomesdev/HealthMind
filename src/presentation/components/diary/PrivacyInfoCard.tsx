import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";

export function PrivacyInfoCard() {
  const { colors } = useTheme();

  return (
    <View className="flex-row items-center gap-3 bg-secondary/10 dark:bg-secondary-dark/15 rounded-2xl px-4 py-3.5">
      <View className="w-8 h-8 rounded-full bg-secondary/20 dark:bg-secondary-dark/25 items-center justify-center">
        <Ionicons name="lock-closed" size={16} color={colors.secondary} />
      </View>
      <AppText variant="small" color="muted" className="flex-1 leading-5">
        Seu psicólogo só terá acesso com sua autorização.
      </AppText>
    </View>
  );
}
