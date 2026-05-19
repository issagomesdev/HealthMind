import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { PatientReportStatusBadge } from "./PatientReportStatusBadge";
import { useTheme } from "../../../core/theme";
import type { PatientReportRow as PatientReportRowType } from "../../../types/reports";

function getMoodColor(mood: number): string {
  if (mood >= 7) return "#10B981";
  if (mood >= 5) return "#F59E0B";
  return "#EF4444";
}

interface PatientReportRowProps {
  patient: PatientReportRowType;
  onPress: () => void;
}

export function PatientReportRow({ patient, onPress }: PatientReportRowProps) {
  const { colors } = useTheme();
  const isCritical = patient.status === "critical";
  const moodColor = getMoodColor(patient.averageMood);

  const formattedDate = (() => {
    try {
      const d = new Date(patient.lastInteraction);
      return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
    } catch {
      return patient.lastInteraction;
    }
  })();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderLeftWidth: isCritical ? 4 : 0,
        borderLeftColor: isCritical ? "#EF4444" : "transparent",
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        gap: 12,
      }}
    >
      {/* Avatar */}
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: colors.secondary + "20",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <AppText style={{ fontSize: 13, fontWeight: "700", color: colors.secondary }}>
          {patient.avatarInitials}
        </AppText>
      </View>

      {/* Name + date */}
      <View style={{ flex: 1, minWidth: 0 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <AppText
            style={{ fontSize: 14, fontWeight: "700", color: colors.content }}
            numberOfLines={1}
          >
            {patient.name}
          </AppText>
          {patient.alertMessages.length > 0 && (
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#EF4444",
              }}
            />
          )}
        </View>
        <AppText style={{ fontSize: 12, color: colors.subtle, marginTop: 1 }}>
          Última interação: {formattedDate}
        </AppText>

        {/* Activity adherence bar */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 5 }}>
          <View
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor: colors.muted,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: `${patient.activityAdherencePct}%`,
                height: "100%",
                borderRadius: 2,
                backgroundColor: colors.secondary,
              }}
            />
          </View>
          <AppText style={{ fontSize: 11, color: colors.subtle, minWidth: 30 }}>
            {patient.activityAdherencePct}%
          </AppText>
        </View>
      </View>

      {/* Mood badge */}
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: moodColor + "20",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <AppText style={{ fontSize: 12, fontWeight: "800", color: moodColor }}>
          {patient.averageMood.toFixed(1)}
        </AppText>
      </View>

      {/* Status badge + chevron */}
      <View style={{ alignItems: "flex-end", gap: 6, flexShrink: 0 }}>
        <PatientReportStatusBadge status={patient.status} />
        <Ionicons name="chevron-forward" size={16} color={colors.secondary} />
      </View>
    </TouchableOpacity>
  );
}
