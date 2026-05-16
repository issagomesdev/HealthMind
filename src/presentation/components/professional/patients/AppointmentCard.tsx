import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../ui/AppText";
import { PatientAppointment } from "../../../../types/patient";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";
import { useTheme } from "../../../../core/theme";

interface AppointmentCardProps {
  appointment: PatientAppointment;
  onPress: () => void;
  isToday?: boolean;
}

function formatScheduledAt(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short", year: "numeric" }),
    time: d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
  };
}

const FORMAT_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  online:    "videocam-outline",
  in_person: "location-outline",
  hybrid:    "git-merge-outline",
};

const TYPE_COLORS: Record<string, string> = {
  consultation:      "#6B7EF5",
  return:            "#F59E0B",
  initial_assessment:"#6DBF7B",
  follow_up:         "#60A5FA",
};

export function AppointmentCard({ appointment: apt, onPress, isToday = false }: AppointmentCardProps) {
  const { colors } = useTheme();
  const { date, time } = formatScheduledAt(apt.scheduledAt);
  const typeColor = TYPE_COLORS[apt.type] ?? colors.secondary;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: isToday ? 2 : 0,
        borderColor: isToday ? "#6DBF7B" : "transparent",
        gap: 10,
      }}
    >
      {isToday && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor: "#6DBF7B20",
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 5,
            alignSelf: "flex-start",
          }}
        >
          <Ionicons name="today-outline" size={13} color="#6DBF7B" />
          <AppText style={{ fontSize: 11, color: "#6DBF7B", fontWeight: "700" }}>HOJE</AppText>
        </View>
      )}

      {/* Top row: date/time + status */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ gap: 2 }}>
          <AppText style={{ fontSize: 13, fontWeight: "700", color: colors.content }}>{time}</AppText>
          <AppText style={{ fontSize: 12, color: colors.subtle }}>{date}</AppText>
        </View>
        <AppointmentStatusBadge status={apt.status} size="sm" />
      </View>

      {/* Type + format */}
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            backgroundColor: typeColor + "18",
            borderRadius: 99,
            paddingHorizontal: 9,
            paddingVertical: 3,
          }}
        >
          <Ionicons name="bookmark-outline" size={11} color={typeColor} />
          <AppText style={{ fontSize: 11, color: typeColor, fontWeight: "600" }}>{apt.typeLabel}</AppText>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 5,
            backgroundColor: colors.muted + "40",
            borderRadius: 99,
            paddingHorizontal: 9,
            paddingVertical: 3,
          }}
        >
          <Ionicons name={FORMAT_ICON[apt.format]} size={11} color={colors.subtle} />
          <AppText style={{ fontSize: 11, color: colors.subtle, fontWeight: "600" }}>{apt.formatLabel}</AppText>
        </View>
        <AppText style={{ fontSize: 11, color: colors.subtle }}>{apt.durationMinutes} min</AppText>
      </View>

      {/* Note */}
      {apt.shortNote !== "" && (
        <AppText style={{ fontSize: 12, color: colors.subtle, lineHeight: 17 }} numberOfLines={2}>
          {apt.shortNote}
        </AppText>
      )}

      {/* Value + chevron */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        {apt.value != null ? (
          <AppText style={{ fontSize: 13, fontWeight: "700", color: colors.content }}>
            R$ {apt.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </AppText>
        ) : (
          <AppText style={{ fontSize: 12, color: colors.subtle }}>Sem cobrança</AppText>
        )}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <AppText style={{ fontSize: 12, color: colors.secondary, fontWeight: "600" }}>Ver detalhes</AppText>
          <Ionicons name="chevron-forward-outline" size={14} color={colors.secondary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
