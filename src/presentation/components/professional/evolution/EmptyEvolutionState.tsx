import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../ui/AppText";
import { useTheme } from "../../../../core/theme";

interface Props {
  title?: string;
  subtitle?: string;
}

export function EmptyEvolutionState({
  title = "Nenhum paciente encontrado",
  subtitle = "Tente ajustar os filtros de busca.",
}: Props) {
  const { colors } = useTheme();

  return (
    <View className="items-center justify-center py-12 px-8">
      <View
        className="w-16 h-16 rounded-full items-center justify-center mb-4"
        style={{ backgroundColor: colors.border }}
      >
        <Ionicons name="people-outline" size={32} color={colors.subtle} />
      </View>
      <AppText style={{ fontSize: 16, fontWeight: "700", color: colors.content, textAlign: "center", marginBottom: 8 }}>
        {title}
      </AppText>
      <AppText variant="small" style={{ color: colors.subtle, textAlign: "center", lineHeight: 20 }}>
        {subtitle}
      </AppText>
    </View>
  );
}
