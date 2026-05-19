import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../ui/AppText";
import { useTheme } from "../../../../core/theme";
import { ProfessionalTask, TaskCategory } from "../../../../types/professionalCalendar";

const CATEGORY_COLORS: Record<TaskCategory, string> = {
  wellness: "#2A9D8F",
  organization: "#4C78D9",
  study: "#F59E0B",
};

const CATEGORY_LABELS: Record<TaskCategory, string> = {
  wellness: "Bem-estar",
  organization: "Organização",
  study: "Estudo",
};

interface ProfessionalTaskCardProps {
  task: ProfessionalTask;
  onToggle: () => void;
}

export function ProfessionalTaskCard({ task, onToggle }: ProfessionalTaskCardProps) {
  const { colors } = useTheme();
  const catColor = CATEGORY_COLORS[task.category];

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 14,
        marginBottom: 8,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 14,
        gap: 12,
        opacity: task.completed ? 0.65 : 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      {/* Checkbox */}
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.7}
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          borderWidth: 2,
          borderColor: task.completed ? catColor : colors.border,
          backgroundColor: task.completed ? catColor : "transparent",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {task.completed && <Ionicons name="checkmark" size={14} color="#fff" />}
      </TouchableOpacity>

      {/* Icon circle */}
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 19,
          backgroundColor: catColor + "20",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons
          name={task.icon as keyof typeof Ionicons.glyphMap}
          size={18}
          color={catColor}
        />
      </View>

      {/* Text */}
      <View style={{ flex: 1 }}>
        <AppText
          style={{
            fontSize: 14,
            fontWeight: "600",
            color: colors.content,
            textDecorationLine: task.completed ? "line-through" : "none",
          }}
        >
          {task.title}
        </AppText>
        <AppText
          style={{ fontSize: 12, color: colors.subtle, marginTop: 1 }}
          numberOfLines={1}
        >
          {task.description}
        </AppText>
      </View>

      {/* Duration pill */}
      <View
        style={{
          backgroundColor: catColor + "18",
          borderRadius: 99,
          paddingHorizontal: 8,
          paddingVertical: 3,
        }}
      >
        <AppText style={{ fontSize: 11, fontWeight: "600", color: catColor }}>
          {task.durationMinutes} min
        </AppText>
      </View>
    </View>
  );
}
