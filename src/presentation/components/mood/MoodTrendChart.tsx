import React from "react";
import { View } from "react-native";
import { AppText } from "../ui/AppText";
import { AppCard } from "../ui/AppCard";
import { MoodTrendWeek } from "../../../core/types";
import { useTheme } from "../../../core/theme";

interface MoodTrendChartProps {
  data: MoodTrendWeek[];
}

const TREND_LABELS = ["Baixo", "Médio", "Alto"];

export function MoodTrendChart({ data }: MoodTrendChartProps) {
  const { colors } = useTheme();
  const MAX_BAR_HEIGHT = 80;

  const maxValue = Math.max(...data.map((d) => d.value), 0.01);

  // Determine trend direction
  const first = data[0]?.value ?? 0;
  const last = data[data.length - 1]?.value ?? 0;
  const trendUp = last > first;
  const trendLabel = trendUp ? "Tendência positiva ↑" : last === first ? "Estável →" : "Em observação ↓";
  const trendColor = trendUp ? "#10B981" : last === first ? colors.subtle : "#F97316";

  return (
    <AppCard className="gap-4">
      {/* Header */}
      <View className="flex-row items-center justify-between">
        <AppText variant="bodyMedium" className="font-semibold">
          Evolução emocional
        </AppText>
        <View
          className="px-2.5 py-1 rounded-full"
          style={{ backgroundColor: trendColor + "18" }}
        >
          <AppText variant="caption" className="font-bold" style={{ color: trendColor }}>
            {trendLabel}
          </AppText>
        </View>
      </View>

      {/* Bars */}
      <View className="flex-row items-end justify-between gap-3">
        {data.map((week, i) => {
          const isLast = i === data.length - 1;
          const barH = Math.max((week.value / maxValue) * MAX_BAR_HEIGHT, 8);
          return (
            <View key={week.weekLabel} className="flex-1 items-center gap-2">
              {/* Value label on top of bar */}
              <AppText variant="caption" color={isLast ? "secondary" : "muted"} className="font-medium">
                {Math.round(week.value * 100)}%
              </AppText>
              <View
                className="w-full rounded-xl"
                style={{
                  height: barH,
                  backgroundColor: isLast
                    ? colors.secondary
                    : colors.secondary + (i === data.length - 2 ? "88" : "44"),
                }}
              />
              <AppText variant="caption" color="muted">
                {week.weekLabel}
              </AppText>
            </View>
          );
        })}
      </View>

      {/* Subtitle */}
      <AppText variant="caption" color="muted" className="text-center">
        Baseado nos seus check-ins emocionais dos últimos 30 dias
      </AppText>
    </AppCard>
  );
}
