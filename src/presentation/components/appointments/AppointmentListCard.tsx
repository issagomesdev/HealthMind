import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { AppCard } from "../ui/AppCard";
import { UserAppointment } from "../../../core/types";
import { useTheme } from "../../../core/theme";

interface AppointmentListCardProps {
  appointment: UserAppointment;
  onCancel: (id: string) => void;
  onReschedule: (id: string) => void;
}

export function AppointmentListCard({
  appointment,
  onCancel,
  onReschedule,
}: AppointmentListCardProps) {
  const { colors } = useTheme();

  return (
    <AppCard className="mx-5 gap-3">
      {/* Top row: time + type badge */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <View
            className="w-8 h-8 rounded-xl items-center justify-center"
            style={{ backgroundColor: colors.secondary + "18" }}
          >
            <Ionicons name="time-outline" size={16} color={colors.secondary} />
          </View>
          <AppText variant="bodyMedium" color="secondary" className="font-bold">
            {appointment.time}
          </AppText>
        </View>
        {appointment.type && (
          <View
            className="flex-row items-center gap-1 px-2.5 py-1 rounded-full"
            style={{ backgroundColor: colors.secondary + "14" }}
          >
            <Ionicons
              name={appointment.type === "Online" ? "videocam-outline" : "location-outline"}
              size={12}
              color={colors.secondary}
            />
            <AppText variant="caption" color="secondary" className="font-semibold">
              {appointment.type}
            </AppText>
          </View>
        )}
      </View>

      {/* Professional info */}
      <View className="gap-0.5">
        <AppText variant="bodyMedium" className="font-semibold">
          {appointment.professionalName}
        </AppText>
        <AppText variant="small" color="muted">
          {appointment.specialty}
        </AppText>
      </View>

      {/* Divider */}
      <View className="h-px bg-border dark:bg-border-dark" />

      {/* Actions */}
      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={() => onReschedule(appointment.id)}
          activeOpacity={0.7}
          className="flex-1 flex-row items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border dark:border-border-dark"
        >
          <Ionicons name="calendar-outline" size={14} color={colors.subtle} />
          <AppText variant="small" color="muted" className="font-medium">
            Adiar
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onCancel(appointment.id)}
          activeOpacity={0.7}
          className="flex-1 flex-row items-center justify-center gap-1.5 py-2.5 rounded-xl"
          style={{ backgroundColor: colors.error + "12" }}
        >
          <Ionicons name="close-circle-outline" size={14} color={colors.error} />
          <AppText variant="small" color="error" className="font-medium">
            Cancelar
          </AppText>
        </TouchableOpacity>
      </View>
    </AppCard>
  );
}
