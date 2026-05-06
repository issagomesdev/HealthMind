import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { Activity } from "../../../core/types";
import { useTheme } from "../../../core/theme";

interface ActivityListCardProps {
  activity: Activity;
  onPress?: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  Calma:      "#2A9D8F",
  Pausa:      "#4C78D9",
  Reflexão:   "#6366F1",
  Movimento:  "#F59E0B",
  Hábitos:    "#EC4899",
  "Bem-estar":"#6DBF7B",
};

export function ActivityListCard({ activity, onPress }: ActivityListCardProps) {
  const { colors, isDark } = useTheme();
  const categoryColor = CATEGORY_COLORS[activity.category] ?? colors.secondary;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="bg-surface dark:bg-surface-dark rounded-2xl p-4 gap-3"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      <View className="flex-row items-start gap-3">
        {/* Icon circle */}
        <View
          className="w-11 h-11 rounded-2xl items-center justify-center"
          style={{ backgroundColor: categoryColor + "22" }}
        >
          <Ionicons
            name={activity.icon as keyof typeof Ionicons.glyphMap}
            size={22}
            color={categoryColor}
          />
        </View>

        {/* Content */}
        <View className="flex-1 gap-0.5">
          <View className="flex-row items-center justify-between">
            <AppText
              variant="caption"
              className="font-semibold"
              style={{ color: categoryColor }}
            >
              {activity.category}
            </AppText>
            <AppText variant="caption" color="muted">
              {activity.durationMinutes} min
            </AppText>
          </View>
          <AppText variant="bodyMedium" className="font-semibold leading-snug">
            {activity.title}
          </AppText>
        </View>
      </View>

      <AppText variant="small" color="muted" className="leading-5">
        {activity.description}
      </AppText>
    </TouchableOpacity>
  );
}
