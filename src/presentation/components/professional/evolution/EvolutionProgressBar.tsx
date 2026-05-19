import React from "react";
import { View } from "react-native";
import { AppText } from "../../ui/AppText";
import { useTheme } from "../../../../core/theme";

interface Props {
  value: number; // 0-100
  color?: string;
  label?: string;
  showLabel?: boolean;
  height?: number;
}

export function EvolutionProgressBar({
  value,
  color,
  label,
  showLabel = true,
  height = 8,
}: Props) {
  const { colors } = useTheme();
  const barColor = color ?? colors.secondary;
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <View className="w-full">
      {showLabel && label ? (
        <View className="flex-row justify-between items-center mb-1">
          <AppText variant="small" style={{ color: colors.content }}>
            {label}
          </AppText>
          <AppText variant="caption" style={{ color: colors.subtle, fontWeight: "700" }}>
            {clamped}%
          </AppText>
        </View>
      ) : null}
      <View
        className="w-full rounded-full"
        style={{ height, backgroundColor: colors.border }}
      >
        <View
          className="rounded-full"
          style={{
            width: `${clamped}%`,
            height,
            backgroundColor: barColor,
          }}
        />
      </View>
    </View>
  );
}
