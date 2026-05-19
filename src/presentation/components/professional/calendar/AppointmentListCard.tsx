import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AppText } from "../../ui/AppText";
import { useTheme } from "../../../../core/theme";
import { ProfessionalAppointment, AppointmentStatus } from "../../../../types/professionalCalendar";
import { CalendarAppointmentStatusBadge } from "./CalendarAppointmentStatusBadge";
import { getInitials, getRiskConfig } from "../../../../utils/patient";

const STATUS_BAR_COLORS: Record<AppointmentStatus, string> = {
  scheduled: "#3B82F6",
  in_progress: "#2A9D8F",
  completed: "#9CA3AF",
  cancelled: "#D1D5DB",
  missed: "#EF4444",
};

interface AppointmentListCardProps {
  appointment: ProfessionalAppointment;
}

export function AppointmentListCard({ appointment }: AppointmentListCardProps) {
  const { colors } = useTheme();
  const router = useRouter();

  const initials = getInitials(appointment.patientName);
  const barColor = STATUS_BAR_COLORS[appointment.status];
  const riskConfig = getRiskConfig(
    appointment.patientRiskLevel,
    appointment.patientRiskLevel === "stable" ? "stable" : "active"
  );

  const showRiskBadge =
    appointment.patientRiskLevel === "attention" ||
    appointment.patientRiskLevel === "high_risk" ||
    appointment.patientRiskLevel === "critical";

  const handlePress = () => {
    router.push(`/appointment-details?id=${appointment.id}`);
  };

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        marginBottom: 10,
        flexDirection: "row",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      {/* Left status bar */}
      <View
        style={{
          width: 4,
          backgroundColor: barColor,
        }}
      />

      {/* Content */}
      <View style={{ flex: 1, padding: 14 }}>
        {/* Top row: avatar + info + time */}
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
          {/* Avatar */}
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: colors.secondary + "25",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppText style={{ fontSize: 15, fontWeight: "700", color: colors.secondary }}>
              {initials}
            </AppText>
          </View>

          {/* Name + subject */}
          <View style={{ flex: 1 }}>
            <AppText
              style={{
                fontSize: 15,
                fontWeight: "700",
                color: colors.content,
                marginBottom: 2,
              }}
            >
              {appointment.patientName}
            </AppText>
            {appointment.subject ? (
              <AppText
                style={{ fontSize: 12, color: colors.subtle }}
                numberOfLines={1}
              >
                {appointment.subject}
              </AppText>
            ) : null}
          </View>

          {/* Time */}
          <View style={{ alignItems: "flex-end" }}>
            <AppText style={{ fontSize: 15, fontWeight: "800", color: colors.content }}>
              {appointment.time}
            </AppText>
            <AppText style={{ fontSize: 11, color: colors.subtle, marginTop: 1 }}>
              {appointment.durationMinutes} min
            </AppText>
          </View>
        </View>

        {/* Bottom row: badges + action */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            gap: 6,
            flexWrap: "wrap",
          }}
        >
          <CalendarAppointmentStatusBadge status={appointment.status} small />

          {/* Format badge */}
          <View
            style={{
              backgroundColor: colors.muted,
              borderRadius: 99,
              paddingHorizontal: 8,
              paddingVertical: 2,
              flexDirection: "row",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Ionicons
              name={
                appointment.format === "online"
                  ? "videocam-outline"
                  : appointment.format === "in_person"
                  ? "location-outline"
                  : "git-merge-outline"
              }
              size={10}
              color={colors.subtle}
            />
            <AppText style={{ fontSize: 11, color: colors.subtle, fontWeight: "500" }}>
              {appointment.formatLabel}
            </AppText>
          </View>

          {/* Risk badge */}
          {showRiskBadge && (
            <View
              style={{
                backgroundColor: riskConfig.bg,
                borderRadius: 99,
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}
            >
              <AppText
                style={{ fontSize: 11, fontWeight: "600", color: riskConfig.text }}
              >
                {riskConfig.label}
              </AppText>
            </View>
          )}

          <View style={{ flex: 1 }} />

          {/* Details button */}
          <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            style={{
              backgroundColor: colors.secondary + "15",
              borderRadius: 99,
              paddingHorizontal: 12,
              paddingVertical: 5,
            }}
          >
            <AppText style={{ fontSize: 12, fontWeight: "600", color: colors.secondary }}>
              Detalhes
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
