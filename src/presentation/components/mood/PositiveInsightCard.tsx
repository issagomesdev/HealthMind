import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { MoodInsightItem } from "../../../core/types";
import { useTheme } from "../../../core/theme";

interface PositiveInsightCardProps {
  insight: MoodInsightItem;
}

export function PositiveInsightCard({ insight }: PositiveInsightCardProps) {
  const { colors, isDark } = useTheme();

  return (
    <View
      className="flex-row items-start gap-3 p-4 rounded-2xl"
      style={{
        backgroundColor: isDark ? "#022c22" : "#ECFDF5",
      }}
    >
      <View
        className="w-8 h-8 rounded-xl items-center justify-center mt-0.5 shrink-0"
        style={{ backgroundColor: "#10B981" + "22" }}
      >
        <Ionicons name="checkmark-circle-outline" size={17} color="#10B981" />
      </View>
      <View className="flex-1 gap-0.5">
        <AppText variant="smallMedium" className="font-bold" style={{ color: "#10B981" }}>
          {insight.title}
        </AppText>
        <AppText variant="small" color="muted" className="leading-5">
          {insight.description}
        </AppText>
      </View>
    </View>
  );
}
