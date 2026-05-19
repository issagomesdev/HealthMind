import React from "react";
import { View } from "react-native";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";

interface EmotionItem {
  emotion: string;
  count: number;
  pct: number;
  color: string;
}

interface EmotionDistributionCardProps {
  data: EmotionItem[];
}

export function EmotionDistributionCard({ data }: EmotionDistributionCardProps) {
  const { colors } = useTheme();

  const sorted = [...data].sort((a, b) => b.pct - a.pct);

  return (
    <View style={{ gap: 12 }}>
      {sorted.map((item) => (
        <View key={item.emotion}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            {/* Color dot */}
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: item.color,
                marginRight: 8,
              }}
            />
            {/* Label */}
            <AppText
              style={{ fontSize: 13, color: colors.content, flex: 1, fontWeight: "500" }}
            >
              {item.emotion}
            </AppText>
            {/* Percentage */}
            <AppText style={{ fontSize: 12, color: colors.subtle, fontWeight: "600" }}>
              {item.pct}%
            </AppText>
          </View>
          {/* Bar */}
          <View
            style={{
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.muted,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${item.pct}%`,
                height: "100%",
                borderRadius: 4,
                backgroundColor: item.color,
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
}
