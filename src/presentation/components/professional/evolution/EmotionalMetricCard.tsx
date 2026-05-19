import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../ui/AppText";
import { useTheme } from "../../../../core/theme";

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  value: string | number;
  label: string;
  trend?: "up" | "down" | "stable";
  trendPct?: number;
  iconColor?: string;
}

export function EmotionalMetricCard({ icon, value, label, trend, trendPct, iconColor }: Props) {
  const { colors } = useTheme();

  const trendColor =
    trend === "up" ? "#059669" : trend === "down" ? "#DC2626" : colors.subtle;
  const trendIcon =
    trend === "up"
      ? "arrow-up-outline"
      : trend === "down"
      ? "arrow-down-outline"
      : "remove-outline";

  return (
    <View
      className="rounded-2xl p-4 flex-1"
      style={{ backgroundColor: colors.surface, minWidth: 90 }}
    >
      <View
        className="w-9 h-9 rounded-xl items-center justify-center mb-2"
        style={{ backgroundColor: (iconColor ?? colors.secondary) + "22" }}
      >
        <Ionicons name={icon} size={18} color={iconColor ?? colors.secondary} />
      </View>
      <AppText style={{ fontSize: 22, fontWeight: "800", color: colors.content }}>
        {value}
      </AppText>
      <AppText variant="caption" style={{ color: colors.subtle, marginTop: 2 }}>
        {label}
      </AppText>
      {trend && trendPct !== undefined ? (
        <View className="flex-row items-center mt-1" style={{ gap: 2 }}>
          <Ionicons name={trendIcon} size={11} color={trendColor} />
          <AppText style={{ fontSize: 11, fontWeight: "700", color: trendColor }}>
            {Math.abs(trendPct)}%
          </AppText>
        </View>
      ) : null}
    </View>
  );
}
