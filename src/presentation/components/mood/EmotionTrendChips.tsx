import React from "react";
import { View, ScrollView } from "react-native";
import { AppText } from "../ui/AppText";
import { EmotionTrend } from "../../../core/types";
import { useTheme } from "../../../core/theme";

interface EmotionTrendChipsProps {
  emotions: EmotionTrend[];
}

export function EmotionTrendChips({ emotions }: EmotionTrendChipsProps) {
  const { isDark } = useTheme();

  const sorted = [...emotions].sort((a, b) => b.count - a.count);
  const maxCount = sorted[0]?.count ?? 1;

  return (
    <View className="gap-3">
      {sorted.map((e) => {
        const barWidth = `${Math.round((e.count / maxCount) * 100)}%`;
        return (
          <View key={e.emotion} className="gap-1.5">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <View
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: e.color }}
                />
                <AppText variant="smallMedium" className="font-medium">
                  {e.emotion}
                </AppText>
              </View>
              <AppText variant="caption" color="muted">
                {e.count} dias
              </AppText>
            </View>
            {/* Progress bar */}
            <View
              className="h-2 rounded-full"
              style={{
                backgroundColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
              }}
            >
              <View
                className="h-2 rounded-full"
                style={{
                  width: barWidth as any,
                  backgroundColor: e.color + (isDark ? "dd" : "cc"),
                }}
              />
            </View>
          </View>
        );
      })}
    </View>
  );
}
