import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../ui/AppText";
import { AppointmentStatus } from "../../../../types/patient";

type StatusConfig = {
  color: string;
  bg: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

const STATUS_CONFIG: Record<AppointmentStatus, StatusConfig> = {
  scheduled:   { color: "#3B82F6", bg: "#3B82F620", icon: "calendar-outline",      label: "Agendada" },
  completed:   { color: "#6DBF7B", bg: "#6DBF7B20", icon: "checkmark-circle-outline", label: "Concluída" },
  cancelled:   { color: "#9CA3AF", bg: "#9CA3AF20", icon: "close-circle-outline",  label: "Cancelada" },
  rescheduled: { color: "#F59E0B", bg: "#F59E0B20", icon: "refresh-circle-outline", label: "Remarcada" },
  missed:      { color: "#EF4444", bg: "#EF444420", icon: "alert-circle-outline",  label: "Faltou" },
};

interface AppointmentStatusBadgeProps {
  status: AppointmentStatus;
  size?: "sm" | "md";
}

export function AppointmentStatusBadge({ status, size = "md" }: AppointmentStatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];
  const fontSize = size === "sm" ? 11 : 12;
  const iconSize = size === "sm" ? 12 : 13;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: cfg.bg,
        borderRadius: 99,
        paddingHorizontal: size === "sm" ? 8 : 10,
        paddingVertical: size === "sm" ? 3 : 4,
        alignSelf: "flex-start",
      }}
    >
      <Ionicons name={cfg.icon} size={iconSize} color={cfg.color} />
      <AppText style={{ color: cfg.color, fontWeight: "700", fontSize }}>{cfg.label}</AppText>
    </View>
  );
}

export function getStatusConfig(status: AppointmentStatus): StatusConfig {
  return STATUS_CONFIG[status];
}
