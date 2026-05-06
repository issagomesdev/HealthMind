import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";

interface FindProfessionalShortcutCardProps {
  onPress: () => void;
}

export function FindProfessionalShortcutCard({ onPress }: FindProfessionalShortcutCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="mx-5 rounded-3xl overflow-hidden"
      style={{
        shadowColor: colors.secondary,
        shadowOffset: { width: 0, height: 4 },
      }}
    >
      <View
        className="flex-row items-center gap-4 p-5"
        style={{ backgroundColor: colors.secondary + "14" }}
      >
        <View
          className="w-12 h-12 rounded-2xl items-center justify-center"
          style={{ backgroundColor: colors.secondary + "22" }}
        >
          <Ionicons name="search-outline" size={22} color={colors.secondary} />
        </View>
        <View className="flex-1 gap-0.5">
          <AppText variant="bodyMedium" color="secondary" className="font-bold">
            Encontrar um profissional
          </AppText>
          <AppText variant="small" color="muted" className="leading-5">
            Busque profissionais disponíveis para novas consultas.
          </AppText>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.secondary} />
      </View>
    </TouchableOpacity>
  );
}
