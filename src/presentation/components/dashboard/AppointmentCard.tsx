import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { AppCard } from "../ui/AppCard";
import { useTheme } from "../../../core/theme";
import { AppointmentInfo } from "../../../core/types";

interface AppointmentCardProps {
  appointment: AppointmentInfo;
  onDetails?: () => void;
}

export function AppointmentCard({ appointment, onDetails }: AppointmentCardProps) {
  const { colors } = useTheme();

  return (
    <AppCard className="gap-0 p-0 overflow-hidden">
      <View className="p-5 flex-row items-center gap-4">
        <View className="w-12 h-12 rounded-full bg-secondary dark:bg-secondary-dark items-center justify-center">
          <Ionicons name="person" size={22} color="#fff" />
        </View>
        <View className="flex-1">
          <AppText variant="bodyMedium" className="font-semibold">
            {appointment.professionalName}
          </AppText>
          <AppText variant="small" color="muted">
            {appointment.specialty}
          </AppText>
        </View>
      </View>

      <View className="h-px bg-border dark:bg-border-dark mx-5" />

      <View className="px-5 py-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Ionicons name="calendar-outline" size={16} color={colors.subtle} />
          <AppText variant="small" color="muted">
            {appointment.dateLabel}, {appointment.time}
          </AppText>
        </View>
        <TouchableOpacity onPress={onDetails} activeOpacity={0.7}>
          <AppText variant="smallMedium" color="secondary">
            Detalhes
          </AppText>
        </TouchableOpacity>
      </View>
    </AppCard>
  );
}
