import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../ui/AppText";
import { useTheme } from "../../../../core/theme";
import { ProfessionalReminder, ReminderPriority, ReminderCategory } from "../../../../types/professionalCalendar";

const PRIORITY_COLORS: Record<ReminderPriority, string> = {
  high: "#EF4444",
  medium: "#F59E0B",
  low: "#9CA3AF",
};

const CATEGORY_CONFIG: Record<ReminderCategory, { label: string; icon: keyof typeof Ionicons.glyphMap }> = {
  patient: { label: "Paciente", icon: "person-outline" },
  study: { label: "Estudo", icon: "book-outline" },
  financial: { label: "Financeiro", icon: "cash-outline" },
  schedule: { label: "Agenda", icon: "calendar-outline" },
  administrative: { label: "Administrativo", icon: "document-text-outline" },
};

interface ProfessionalReminderCardProps {
  reminder: ProfessionalReminder;
  onToggle: () => void;
}

export function ProfessionalReminderCard({ reminder, onToggle }: ProfessionalReminderCardProps) {
  const { colors } = useTheme();
  const priorityColor = PRIORITY_COLORS[reminder.priority];
  const catConfig = CATEGORY_CONFIG[reminder.category];

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 14,
        marginBottom: 8,
        flexDirection: "row",
        alignItems: "flex-start",
        paddingVertical: 14,
        paddingHorizontal: 14,
        gap: 12,
        opacity: reminder.completed ? 0.6 : 1,
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
          width: 22,
          height: 22,
          borderRadius: 6,
          borderWidth: 2,
          borderColor: reminder.completed ? priorityColor : colors.border,
          backgroundColor: reminder.completed ? priorityColor : "transparent",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 1,
        }}
      >
        {reminder.completed && <Ionicons name="checkmark" size={13} color="#fff" />}
      </TouchableOpacity>

      {/* Priority dot */}
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: priorityColor,
          marginTop: 7,
        }}
      />

      {/* Content */}
      <View style={{ flex: 1 }}>
        <AppText
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: colors.content,
            textDecorationLine: reminder.completed ? "line-through" : "none",
            marginBottom: 3,
          }}
        >
          {reminder.title}
        </AppText>

        <AppText
          style={{ fontSize: 12, color: colors.subtle, lineHeight: 17 }}
          numberOfLines={2}
        >
          {reminder.description}
        </AppText>

        {/* Metadata row */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, gap: 8, flexWrap: "wrap" }}>
          {/* Category badge */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              backgroundColor: colors.muted,
              borderRadius: 99,
              paddingHorizontal: 8,
              paddingVertical: 2,
            }}
          >
            <Ionicons name={catConfig.icon} size={10} color={colors.subtle} />
            <AppText style={{ fontSize: 11, color: colors.subtle, fontWeight: "500" }}>
              {catConfig.label}
            </AppText>
          </View>

          {/* Patient name */}
          {reminder.patientName && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                backgroundColor: colors.secondary + "15",
                borderRadius: 99,
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}
            >
              <Ionicons name="person-outline" size={10} color={colors.secondary} />
              <AppText style={{ fontSize: 11, color: colors.secondary, fontWeight: "600" }}>
                {reminder.patientName}
              </AppText>
            </View>
          )}

          {/* Time */}
          {reminder.time && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
              <Ionicons name="time-outline" size={11} color={colors.subtle} />
              <AppText style={{ fontSize: 11, color: colors.subtle }}>
                {reminder.time}
              </AppText>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
