import React from "react";
import { View } from "react-native";
import { AppText } from "../ui/AppText";
import { AppCard } from "../ui/AppCard";
import { FrequentEmotion } from "../../../core/types";

interface FrequentEmotionChipsProps {
  emotions: FrequentEmotion[];
}

export function FrequentEmotionChips({ emotions }: FrequentEmotionChipsProps) {
  return (
    <AppCard className="gap-3">
      <AppText variant="bodyMedium" className="font-semibold">
        Emoções mais frequentes
      </AppText>

      <View className="flex-row flex-wrap gap-2">
        {emotions.map((emotion) => (
          <View
            key={emotion.label}
            className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted dark:bg-muted-dark"
          >
            <View
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: emotion.color }}
            />
            <AppText variant="caption" className="font-medium">
              {emotion.label}
            </AppText>
          </View>
        ))}
      </View>
    </AppCard>
  );
}
