import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { MoodRecommendation } from "../../../core/types";
import { useTheme } from "../../../core/theme";

interface MoodRecommendationCardProps {
  recommendation: MoodRecommendation;
}

export function MoodRecommendationCard({ recommendation }: MoodRecommendationCardProps) {
  const { colors } = useTheme();

  return (
    <View
      className="flex-row items-start gap-3 p-4 rounded-2xl"
      style={{ backgroundColor: colors.secondary + "0c" }}
    >
      <View
        className="w-8 h-8 rounded-xl items-center justify-center mt-0.5 shrink-0"
        style={{ backgroundColor: colors.secondary + "20" }}
      >
        <Ionicons name="bulb-outline" size={16} color={colors.secondary} />
      </View>
      <AppText variant="small" className="flex-1 leading-6">
        {recommendation.text}
      </AppText>
    </View>
  );
}
