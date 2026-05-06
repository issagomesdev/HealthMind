import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { DiaryPrivacy } from "../../../core/types";
import { useTheme } from "../../../core/theme";

interface Option {
  value: DiaryPrivacy;
  label: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const OPTIONS: Option[] = [
  {
    value: "PRIVATE",
    label: "Apenas você",
    description: "Somente você tem acesso aos seus registros.",
    icon: "lock-closed-outline",
  },
  {
    value: "PROFESSIONALS",
    label: "Profissionais que lhe atendem",
    description: "Profissionais autorizados também podem visualizar.",
    icon: "people-outline",
  },
  {
    value: "PUBLIC",
    label: "Todos",
    description: "Seus registros ficam visíveis para a comunidade.",
    icon: "globe-outline",
  },
];

interface PrivacyOptionSelectorProps {
  value: DiaryPrivacy;
  onChange: (v: DiaryPrivacy) => void;
}

export function PrivacyOptionSelector({ value, onChange }: PrivacyOptionSelectorProps) {
  const { colors } = useTheme();

  return (
    <View className="gap-3">
      {OPTIONS.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.8}
            className={`flex-row items-center gap-4 p-4 rounded-2xl border-2 ${
              isSelected
                ? "border-secondary dark:border-secondary-dark bg-secondary/8 dark:bg-secondary-dark/12"
                : "border-border dark:border-border-dark bg-surface dark:bg-surface-dark"
            }`}
          >
            <View
              className="w-10 h-10 rounded-xl items-center justify-center"
              style={{
                backgroundColor: isSelected
                  ? colors.secondary + "20"
                  : colors.muted,
              }}
            >
              <Ionicons name={opt.icon} size={20} color={isSelected ? colors.secondary : colors.subtle} />
            </View>

            <View className="flex-1 gap-0.5">
              <AppText
                variant="bodyMedium"
                className={isSelected ? "font-semibold" : ""}
                color={isSelected ? "secondary" : "default"}
              >
                {opt.label}
              </AppText>
              <AppText variant="small" color="muted">
                {opt.description}
              </AppText>
            </View>

            <View
              className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                isSelected
                  ? "border-secondary dark:border-secondary-dark bg-secondary dark:bg-secondary-dark"
                  : "border-border dark:border-border-dark"
              }`}
            >
              {isSelected && <Ionicons name="checkmark" size={12} color="#fff" />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
