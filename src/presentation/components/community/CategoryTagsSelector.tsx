import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { CommunityCategory } from "../../../core/types";
import { useTheme } from "../../../core/theme";

interface TagConfig {
  value: CommunityCategory;
  label: string;
}

const TAGS: TagConfig[] = [
  { value: "motivacao",   label: "Motivação"         },
  { value: "apoio",       label: "Apoio"             },
  { value: "dica",        label: "Dica"              },
  { value: "reflexao",    label: "Reflexão"          },
  { value: "experiencia", label: "Experiência pessoal"},
  { value: "rotina",      label: "Rotina"            },
  { value: "saude_mental",label: "Saúde mental"      },
];

interface CategoryTagsSelectorProps {
  selected: CommunityCategory[];
  onToggle: (cat: CommunityCategory) => void;
}

export function CategoryTagsSelector({ selected, onToggle }: CategoryTagsSelectorProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-row flex-wrap gap-2">
      {TAGS.map(({ value, label }) => {
        const isSelected = selected.includes(value);
        return (
          <TouchableOpacity
            key={value}
            onPress={() => onToggle(value)}
            activeOpacity={0.75}
          >
            <View
              className={`flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border-2 ${
                isSelected
                  ? "border-secondary dark:border-secondary-dark bg-secondary/10 dark:bg-secondary-dark/15"
                  : "border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
              }`}
            >
              <AppText
                variant="caption"
                color={isSelected ? "secondary" : "muted"}
                className={isSelected ? "font-semibold" : ""}
              >
                {label}
              </AppText>
              {isSelected && (
                <Ionicons name="checkmark" size={12} color={colors.secondary} />
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
