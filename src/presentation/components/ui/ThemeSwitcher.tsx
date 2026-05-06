import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "./AppText";
import { useTheme } from "../../../core/theme";
import { ThemeMode } from "../../../core/types";

interface ThemeOption {
  mode: ThemeMode;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const options: ThemeOption[] = [
  { mode: "light",  label: "Claro",      icon: "sunny-outline" },
  { mode: "dark",   label: "Escuro",     icon: "moon-outline" },
  { mode: "system", label: "Automático", icon: "phone-portrait-outline" },
];

export function ThemeSwitcher() {
  const { themeMode, setThemeMode } = useTheme();

  return (
    <View className="flex-row gap-2.5">
      {options.map((opt) => {
        const isActive = themeMode === opt.mode;
        return (
          <TouchableOpacity
            key={opt.mode}
            onPress={() => setThemeMode(opt.mode)}
            activeOpacity={0.75}
            className={`flex-1 items-center justify-center gap-1.5 py-3.5 rounded-2xl border-2 ${
              isActive
                ? "bg-secondary dark:bg-secondary-dark border-secondary dark:border-secondary-dark"
                : "bg-muted dark:bg-muted-dark border-transparent"
            }`}
          >
            <Ionicons
              name={opt.icon}
              size={22}
              color={isActive ? "#fff" : "#64748B"}
            />
            <AppText
              variant="smallMedium"
              className={isActive ? "text-white" : "text-subtle dark:text-subtle-dark"}
            >
              {opt.label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
