import React from "react";
import { View, TouchableOpacity } from "react-native";
import { AppText } from "../ui/AppText";
import { AppCard } from "../ui/AppCard";
import { MoodValue } from "../../../core/types";

interface MoodOption {
  value: MoodValue;
  emoji: string;
  label: string;
}

const MOODS: MoodOption[] = [
  { value: 5, emoji: "😄", label: "Muito bem" },
  { value: 4, emoji: "🙂", label: "Bem" },
  { value: 3, emoji: "😐", label: "Neutro" },
  { value: 2, emoji: "😕", label: "Mal" },
  { value: 1, emoji: "😣", label: "Muito mal" },
];

interface MoodSelectorProps {
  selected: MoodValue | null;
  onChange: (mood: MoodValue) => void;
}

export function MoodSelector({ selected, onChange }: MoodSelectorProps) {
  return (
    <AppCard className="gap-4">
      <AppText variant="bodyMedium" className="font-semibold">
        Check-in Emocional
      </AppText>
      <View className="flex-row justify-between">
        {MOODS.map((mood) => {
          const isSelected = selected === mood.value;
          return (
            <TouchableOpacity
              key={mood.value}
              onPress={() => onChange(mood.value)}
              activeOpacity={0.75}
              className="items-center gap-1.5 flex-1"
            >
              <View
                className={`w-12 h-12 rounded-full items-center justify-center ${
                  isSelected
                    ? "bg-secondary/15 dark:bg-secondary-dark/25 border-2 border-secondary dark:border-secondary-dark"
                    : "bg-background dark:bg-background-dark"
                }`}
              >
                <AppText variant="heading3" className="text-[26px]">
                  {mood.emoji}
                </AppText>
              </View>
              <AppText
                variant="caption"
                className={`text-center ${isSelected ? "font-semibold" : ""}`}
                color={isSelected ? "secondary" : "muted"}
              >
                {mood.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </AppCard>
  );
}
