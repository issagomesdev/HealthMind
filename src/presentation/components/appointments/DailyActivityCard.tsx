import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { DailyActivity } from "../../../core/types";
import { useTheme } from "../../../core/theme";

interface DailyActivityCardProps {
  activity: DailyActivity;
  onToggle: (id: string) => void;
}

export function DailyActivityCard({ activity, onToggle }: DailyActivityCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={() => onToggle(activity.id)}
      activeOpacity={0.7}
      className="flex-row items-center gap-4 py-3.5"
    >
      {/* Icon */}
      <View
        className="w-11 h-11 rounded-2xl items-center justify-center"
        style={{
          backgroundColor: activity.completed
            ? colors.secondary + "22"
            : colors.secondary + "14",
        }}
      >
        <Ionicons
          name={activity.icon as keyof typeof Ionicons.glyphMap}
          size={20}
          color={colors.secondary}
          style={{ opacity: activity.completed ? 0.6 : 1 }}
        />
      </View>

      {/* Text */}
      <View className="flex-1 gap-0.5">
        <AppText
          variant="bodyMedium"
          className={`font-semibold ${activity.completed ? "line-through opacity-50" : ""}`}
        >
          {activity.title}
        </AppText>
        <AppText variant="small" color="muted">
          {activity.description}
        </AppText>
      </View>

      {/* Checkbox */}
      <View
        className="w-6 h-6 rounded-full border-2 items-center justify-center"
        style={{
          borderColor: activity.completed ? colors.secondary : colors.border,
          backgroundColor: activity.completed ? colors.secondary : "transparent",
        }}
      >
        {activity.completed && (
          <Ionicons name="checkmark" size={13} color="#fff" />
        )}
      </View>
    </TouchableOpacity>
  );
}
