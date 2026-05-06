import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";

interface MoodSummaryCardProps {
  summary: string;
}

export function MoodSummaryCard({ summary }: MoodSummaryCardProps) {
  const { colors, isDark } = useTheme();

  return (
    <View
      className="rounded-3xl p-5 gap-3"
      style={{
        backgroundColor: isDark ? colors.secondary + "18" : colors.secondary + "0e",
        borderWidth: 1,
        borderColor: colors.secondary + "28",
        shadowColor: colors.secondary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      }}
    >
      <View className="flex-row items-center gap-2">
        <View
          className="w-8 h-8 rounded-xl items-center justify-center"
          style={{ backgroundColor: colors.secondary + "22" }}
        >
          <Ionicons name="analytics-outline" size={16} color={colors.secondary} />
        </View>
        <AppText variant="smallMedium" color="secondary" className="font-bold uppercase tracking-widest">
          Análise dos últimos 30 dias
        </AppText>
      </View>
      <AppText variant="body" className="leading-7">
        {summary}
      </AppText>
    </View>
  );
}
