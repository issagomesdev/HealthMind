import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { Reminder } from "../../../core/types";
import { useTheme } from "../../../core/theme";

interface ReminderAlertCardProps {
  reminder: Reminder;
}

const REMINDER_CONFIG = {
  hydration: {
    icon: "water-outline" as const,
    color: "#F97316",
    bg: "#FFF7ED",
    bgDark: "#431407",
  },
  mood: {
    icon: "happy-outline" as const,
    color: "#8B5CF6",
    bg: "#F5F3FF",
    bgDark: "#2E1065",
  },
  activity: {
    icon: "barbell-outline" as const,
    color: "#2A9D8F",
    bg: "#F0FDFA",
    bgDark: "#022C22",
  },
};

export function ReminderAlertCard({ reminder }: ReminderAlertCardProps) {
  const { isDark } = useTheme();
  const config = REMINDER_CONFIG[reminder.type];

  return (
    <View
      className="flex-row items-start gap-3 p-4 rounded-2xl"
      style={{ backgroundColor: isDark ? config.bgDark : config.bg }}
    >
      <View
        className="w-9 h-9 rounded-xl items-center justify-center mt-0.5"
        style={{ backgroundColor: config.color + "22" }}
      >
        <Ionicons name={config.icon} size={18} color={config.color} />
      </View>
      <View className="flex-1 gap-0.5">
        <AppText variant="smallMedium" className="font-semibold" style={{ color: config.color }}>
          {reminder.title}
        </AppText>
        <AppText variant="small" color="muted" className="leading-5">
          {reminder.description}
        </AppText>
      </View>
    </View>
  );
}
