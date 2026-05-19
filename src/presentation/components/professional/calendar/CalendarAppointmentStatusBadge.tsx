import React from "react";
import { View } from "react-native";
import { AppText } from "../../ui/AppText";
import { AppointmentStatus } from "../../../../types/professionalCalendar";

const STATUS_COLORS: Record<AppointmentStatus, { bg: string; text: string }> = {
  scheduled: { bg: "#3B82F620", text: "#3B82F6" },
  in_progress: { bg: "#2A9D8F20", text: "#2A9D8F" },
  completed: { bg: "#6B728020", text: "#6B7280" },
  cancelled: { bg: "#6B728015", text: "#9CA3AF" },
  missed: { bg: "#EF444420", text: "#EF4444" },
};

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  scheduled: "Agendada",
  in_progress: "Em andamento",
  completed: "Concluída",
  cancelled: "Cancelada",
  missed: "Não compareceu",
};

interface CalendarAppointmentStatusBadgeProps {
  status: AppointmentStatus;
  small?: boolean;
}

export function CalendarAppointmentStatusBadge({
  status,
  small = false,
}: CalendarAppointmentStatusBadgeProps) {
  const config = STATUS_COLORS[status];

  return (
    <View
      style={{
        backgroundColor: config.bg,
        borderRadius: 99,
        paddingHorizontal: small ? 8 : 10,
        paddingVertical: small ? 2 : 3,
        alignSelf: "flex-start",
      }}
    >
      <AppText
        style={{
          fontSize: small ? 10 : 12,
          fontWeight: "600",
          color: config.text,
        }}
      >
        {STATUS_LABELS[status]}
      </AppText>
    </View>
  );
}
