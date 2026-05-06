import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { FeelingTag } from "../../../core/types";
import { useTheme } from "../../../core/theme";

interface TagConfig {
  tag: FeelingTag;
  label: string;
  emoji: string;
}

const TAG_CONFIG: TagConfig[] = [
  { tag: "alegria",   label: "Alegria",   emoji: "😊" },
  { tag: "tristeza",  label: "Tristeza",  emoji: "😢" },
  { tag: "ansiedade", label: "Ansiedade", emoji: "😰" },
  { tag: "estresse",  label: "Estresse",  emoji: "😤" },
  { tag: "raiva",     label: "Raiva",     emoji: "😠" },
  { tag: "gratidão",  label: "Gratidão",  emoji: "🙏" },
];

interface FeelingTagsSelectorProps {
  selected: FeelingTag[];
  onToggle: (tag: FeelingTag) => void;
}

export function FeelingTagsSelector({ selected, onToggle }: FeelingTagsSelectorProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-row flex-wrap gap-2.5">
      {TAG_CONFIG.map(({ tag, label, emoji }) => {
        const isSelected = selected.includes(tag);
        return (
          <TouchableOpacity
            key={tag}
            onPress={() => onToggle(tag)}
            activeOpacity={0.75}
          >
            <View
              className={`flex-row items-center gap-1.5 px-3.5 py-2 rounded-full border-2 ${
                isSelected
                  ? "border-secondary dark:border-secondary-dark bg-secondary/10 dark:bg-secondary-dark/15"
                  : "border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
              }`}
            >
              <AppText className="text-base leading-5">{emoji}</AppText>
              <AppText
                variant="caption"
                className={isSelected ? "font-semibold" : ""}
                color={isSelected ? "secondary" : "muted"}
              >
                {label}
              </AppText>
              {isSelected && (
                <Ionicons name="checkmark" size={13} color={colors.secondary} />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
