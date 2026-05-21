import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AppText } from "../../ui/AppText";
import { useTheme } from "../../../../core/theme";
import { ProfessionalAppointment } from "../../../../types/professionalCalendar";
import { getInitials, getRiskConfig } from "../../../../utils/patient";
import { useCallActions } from "../../../../hooks/useCallActions";

interface NextAppointmentCardProps {
  appointment: ProfessionalAppointment | null;
}

function formatTime(time: string): string {
  return time; // already HH:mm
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

export function NextAppointmentCard({ appointment }: NextAppointmentCardProps) {
  const { colors } = useTheme();
  const router = useRouter();
  const { startSimulatedCall } = useCallActions();

  if (!appointment) {
    return (
      <View
        style={{
          backgroundColor: colors.muted,
          borderRadius: 20,
          padding: 20,
          alignItems: "center",
          flexDirection: "row",
          gap: 12,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: colors.surface,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="calendar-outline" size={22} color={colors.subtle} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText style={{ fontSize: 15, fontWeight: "700", color: colors.content }}>
            Nenhuma consulta próxima
          </AppText>
          <AppText style={{ fontSize: 13, color: colors.subtle, marginTop: 2 }}>
            Sua agenda está livre
          </AppText>
        </View>
      </View>
    );
  }

  const riskConfig = getRiskConfig(
    appointment.patientRiskLevel,
    appointment.patientRiskLevel === "stable" ? "stable" : "active"
  );
  const initials = getInitials(appointment.patientName);

  const handleOpenCall = () => {
    startSimulatedCall(
      { id: appointment.patientId, name: appointment.patientName },
      "video"
    );
  };

  const handleViewDetails = () => {
    router.push(`/appointment-details?id=${appointment.id}`);
  };

  return (
    <View
      style={{
        backgroundColor: colors.secondary,
        borderRadius: 20,
        padding: 20,
        shadowColor: colors.secondary,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 6,
      }}
    >
      {/* Header label */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 14 }}>
        <Ionicons name="time-outline" size={14} color="rgba(255,255,255,0.8)" />
        <AppText style={{ fontSize: 12, fontWeight: "600", color: "rgba(255,255,255,0.8)" }}>
          PRÓXIMA CONSULTA
        </AppText>
      </View>

      {/* Patient row */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 14 }}>
        {/* Avatar */}
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: "rgba(255,255,255,0.25)",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: "rgba(255,255,255,0.4)",
          }}
        >
          <AppText style={{ fontSize: 17, fontWeight: "700", color: "#fff" }}>
            {initials}
          </AppText>
        </View>

        <View style={{ flex: 1 }}>
          <AppText style={{ fontSize: 17, fontWeight: "800", color: "#fff" }}>
            {appointment.patientName}
          </AppText>
          {/* Risk badge */}
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 99,
              paddingHorizontal: 8,
              paddingVertical: 2,
              marginTop: 3,
            }}
          >
            <AppText style={{ fontSize: 11, fontWeight: "600", color: "#fff" }}>
              {riskConfig.label}
            </AppText>
          </View>
        </View>
      </View>

      {/* Time and date */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 }}>
        <Ionicons name="calendar" size={15} color="rgba(255,255,255,0.85)" />
        <AppText style={{ fontSize: 14, fontWeight: "600", color: "rgba(255,255,255,0.9)" }}>
          {formatDate(appointment.date)} · {formatTime(appointment.time)}
        </AppText>
      </View>

      {/* Subject */}
      {appointment.subject ? (
        <AppText
          style={{
            fontSize: 13,
            color: "rgba(255,255,255,0.8)",
            marginBottom: 14,
            fontStyle: "italic",
          }}
          numberOfLines={2}
        >
          {appointment.subject}
        </AppText>
      ) : null}

      {/* Badges row */}
      <View style={{ flexDirection: "row", gap: 8, marginBottom: 16 }}>
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: 99,
            paddingHorizontal: 10,
            paddingVertical: 4,
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
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
            size={12}
            color="rgba(255,255,255,0.9)"
          />
          <AppText style={{ fontSize: 12, fontWeight: "600", color: "rgba(255,255,255,0.9)" }}>
            {appointment.formatLabel}
          </AppText>
        </View>
        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: 99,
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
        >
          <AppText style={{ fontSize: 12, fontWeight: "600", color: "rgba(255,255,255,0.9)" }}>
            {appointment.durationMinutes} min
          </AppText>
        </View>
      </View>

      {/* Actions */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        <TouchableOpacity
          onPress={handleViewDetails}
          activeOpacity={0.8}
          style={{
            flex: 1,
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: 99,
            paddingVertical: 12,
            alignItems: "center",
            borderWidth: 1.5,
            borderColor: "rgba(255,255,255,0.35)",
          }}
        >
          <AppText style={{ fontSize: 14, fontWeight: "700", color: "#fff" }}>
            Ver detalhes
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
            onPress={handleOpenCall}
            activeOpacity={0.85}
            style={{
              flex: 1,
              backgroundColor: "#fff",
              borderRadius: 99,
              paddingVertical: 12,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Ionicons name="videocam" size={16} color={colors.secondary} />
            <AppText style={{ fontSize: 14, fontWeight: "700", color: colors.secondary }}>
              Entrar
            </AppText>
          </TouchableOpacity>
      </View>
    </View>
  );
}
