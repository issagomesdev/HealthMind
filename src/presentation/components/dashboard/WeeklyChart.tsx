import React from "react";
import { View } from "react-native";
import { AppText } from "../ui/AppText";
import { AppCard } from "../ui/AppCard";
import { useTheme } from "../../../core/theme";
import { WeeklyMetric } from "../../../core/types";

interface WeeklyChartProps {
  data: WeeklyMetric[];
  title?: string;
  description?: string;
  maxBarHeight?: number;
}

export function WeeklyChart({
  data,
  title,
  description,
  maxBarHeight = 100,
}: WeeklyChartProps) {
  const { colors } = useTheme();

  const maxValue = Math.max(...data.map((d) => d.value), 0.01);
  const highlightIndex = data.reduce(
    (best, d, i) => (d.value > data[best].value ? i : best),
    0
  );

  return (
    <AppCard className="gap-4">
      {title && (
        <AppText variant="bodyMedium" className="font-semibold">
          {title}
        </AppText>
      )}
      {description && (
        <AppText variant="small" color="muted">
          {description}
        </AppText>
      )}

      <View className="flex-row items-end justify-between gap-1">
        {data.map((metric, i) => {
          const isHighlight = i === highlightIndex;
          const barH = Math.max((metric.value / maxValue) * maxBarHeight, 8);
          return (
            <View key={`${metric.day}-${i}`} className="flex-1 items-center gap-1.5">
              <View
                className="w-full rounded-lg"
                style={{
                  height: barH,
                  backgroundColor: isHighlight
                    ? colors.secondary
                    : colors.secondary + "55",
                }}
              />
              <AppText variant="caption" color="muted">
                {metric.day}
              </AppText>
            </View>
          );
        })}
      </View>
    </AppCard>
  );
}
