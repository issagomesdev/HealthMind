import React from "react";
import { View, TouchableOpacity } from "react-native";
import { AppText } from "../ui/AppText";
import { MoodType } from "../../../core/types";

interface MoodOption {
  type: MoodType;
  emoji: string;
  label: string;
}

const MOOD_OPTIONS: MoodOption[] = [
  { type: "OTIMO",   emoji: "😊", label: "Muito bem"  },
  { type: "BEM",     emoji: "🙂", label: "Bem"    },
  { type: "NEUTRO",  emoji: "😐", label: "Neutro" },
  { type: "RUIM",    emoji: "😕", label: "Mal"   },
  { type: "PESSIMO", emoji: "😢", label: "Muito mal"},
];

interface MoodSelectorProps {
  selected: MoodType | null;
  onChange: (mood: MoodType) => void;
}

export function MoodSelector({ selected, onChange }: MoodSelectorProps) {
  return (
    <View className="flex-row justify-between gap-2">
      {MOOD_OPTIONS.map((option) => {
        const isSelected = selected === option.type;
        return (
          <TouchableOpacity
            key={option.type}
            onPress={() => onChange(option.type)}
            activeOpacity={0.75}
            className="flex-1 items-center"
          >
            <View
              className={`w-full rounded-2xl items-center py-3 gap-1.5 border-2 ${
                isSelected
                  ? "border-secondary dark:border-secondary-dark bg-secondary/10 dark:bg-secondary-dark/15"
                  : "border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
              }`}
              style={{
                shadowColor: "#000"
              }}
            >
              <AppText className="text-[28px] leading-9">{option.emoji}</AppText>
              <AppText
                variant="caption"
                className={`text-center ${isSelected ? "font-bold" : ""}`}
                color={isSelected ? "secondary" : "muted"}
              >
                {option.label}
              </AppText>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
