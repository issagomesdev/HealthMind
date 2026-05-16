import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../components/ui/AppText";
import { useTheme } from "../../../core/theme";

export function RestrictedScreen() {
  const { colors } = useTheme();

  return (
    <View
      className="flex-1 bg-background dark:bg-background-dark items-center justify-center px-8"
    >
      <Ionicons name="lock-closed-outline" size={48} color={colors.subtle} />
      <AppText
        variant="heading3"
        color="default"
        className="text-center mt-4 mb-2"
      >
        Área restrita
      </AppText>
      <AppText
        variant="body"
        color="muted"
        className="text-center leading-6"
      >
        Esta seção é exclusiva para profissionais de saúde cadastrados na plataforma.
      </AppText>
    </View>
  );
}
