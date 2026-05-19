import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../ui/AppText";
import { RiskBadge } from "./RiskBadge";
import { EvolutionProgressBar } from "./EvolutionProgressBar";
import { useTheme } from "../../../../core/theme";
import type { PatientEvolutionSummary } from "../../../../types/evolution";

interface Props {
  patient: PatientEvolutionSummary;
  onPress: () => void;
}

const TREND_CONFIG = {
  improving: { icon: "trending-up-outline" as const, color: "#059669", label: "Melhorando" },
  stable: { icon: "remove-outline" as const, color: "#D97706", label: "Estável" },
  worsening: { icon: "trending-down-outline" as const, color: "#DC2626", label: "Piorando" },
};

const ENGAGEMENT_COLOR = {
  high: "#059669",
  medium: "#D97706",
  low: "#EA580C",
  inactive: "#9CA3AF",
};

const ENGAGEMENT_PCT = { high: 85, medium: 55, low: 30, inactive: 10 };

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (hours < 1) return "Agora mesmo";
  if (hours < 24) return `${hours}h atrás`;
  if (days === 1) return "Ontem";
  return `${days} dias atrás`;
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export function PatientEvolutionCard({ patient, onPress }: Props) {
  const { colors } = useTheme();
  const trend = TREND_CONFIG[patient.trend];
  const engColor = ENGAGEMENT_COLOR[patient.engagementLevel];
  const engPct = ENGAGEMENT_PCT[patient.engagementLevel];

  const borderColor = patient.hasAlert
    ? patient.riskLevel === "critical"
      ? "#DC2626"
      : "#EA580C"
    : "transparent";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="rounded-2xl mb-3 overflow-hidden"
      style={{
        backgroundColor: colors.surface,
        borderLeftWidth: 4,
        borderLeftColor: borderColor,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View className="p-4">
        {/* Header row */}
        <View className="flex-row items-start mb-3" style={{ gap: 12 }}>
          {/* Avatar */}
          <View
            className="w-12 h-12 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.secondary + "22" }}
          >
            <AppText style={{ fontSize: 16, fontWeight: "800", color: colors.secondary }}>
              {patient.avatarInitials}
            </AppText>
          </View>

          {/* Name and mood */}
          <View className="flex-1">
            <AppText style={{ fontSize: 15, fontWeight: "700", color: colors.content }}>
              {patient.name}
            </AppText>
            <AppText variant="caption" style={{ color: colors.subtle }}>
              {patient.dominantMood}
            </AppText>
          </View>

          {/* Trend + evolution pct */}
          <View className="items-end" style={{ gap: 4 }}>
            <View className="flex-row items-center" style={{ gap: 3 }}>
              <Ionicons name={trend.icon} size={13} color={trend.color} />
              <AppText style={{ fontSize: 12, fontWeight: "700", color: trend.color }}>
                {patient.evolutionPct > 0 ? "+" : ""}
                {patient.evolutionPct}%
              </AppText>
            </View>
            <RiskBadge level={patient.riskLevel} size="sm" />
          </View>
        </View>

        {/* Emotion badges */}
        {patient.emotionBadges.length > 0 ? (
          <View className="flex-row flex-wrap mb-3" style={{ gap: 6 }}>
            {patient.emotionBadges.slice(0, 3).map((badge) => (
              <View
                key={badge}
                className="rounded-full px-2 py-0.5"
                style={{ backgroundColor: colors.border }}
              >
                <AppText style={{ fontSize: 11, color: colors.subtle }}>
                  {badge}
                </AppText>
              </View>
            ))}
          </View>
        ) : null}

        {/* Engagement bar */}
        <View className="mb-3">
          <View className="flex-row justify-between items-center mb-1">
            <AppText variant="caption" style={{ color: colors.subtle }}>
              Engajamento
            </AppText>
            <AppText variant="caption" style={{ color: engColor, fontWeight: "700" }}>
              {patient.engagementLevel === "high"
                ? "Alto"
                : patient.engagementLevel === "medium"
                ? "Médio"
                : patient.engagementLevel === "low"
                ? "Baixo"
                : "Inativo"}
            </AppText>
          </View>
          <EvolutionProgressBar
            value={engPct}
            color={engColor}
            showLabel={false}
            height={6}
          />
        </View>

        {/* Stats row */}
        <View className="flex-row justify-between mb-3">
          <View className="items-center">
            <AppText style={{ fontSize: 16, fontWeight: "800", color: colors.content }}>
              {patient.averageMood.toFixed(1)}
            </AppText>
            <AppText variant="caption" style={{ color: colors.subtle }}>
              Humor
            </AppText>
          </View>
          <View className="items-center">
            <AppText style={{ fontSize: 16, fontWeight: "800", color: colors.content }}>
              {patient.checkInsLast7Days}
            </AppText>
            <AppText variant="caption" style={{ color: colors.subtle }}>
              Check-ins/sem
            </AppText>
          </View>
          <View className="items-center">
            <AppText
              style={{ fontSize: 13, fontWeight: "600", color: colors.subtle }}
            >
              {formatRelativeTime(patient.lastActivity)}
            </AppText>
            <AppText variant="caption" style={{ color: colors.subtle }}>
              Última atividade
            </AppText>
          </View>
        </View>

        {/* Alert message */}
        {patient.hasAlert && patient.alertMessage ? (
          <View
            className="rounded-xl px-3 py-2 mb-3 flex-row items-center"
            style={{ backgroundColor: "#FEF2F2", gap: 6 }}
          >
            <Ionicons name="alert-circle" size={14} color="#DC2626" />
            <AppText style={{ fontSize: 12, color: "#991B1B", flex: 1 }}>
              {patient.alertMessage}
            </AppText>
          </View>
        ) : null}

        {/* Footer: next appointment + action */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center" style={{ gap: 4 }}>
            <Ionicons name="calendar-outline" size={13} color={colors.subtle} />
            <AppText variant="caption" style={{ color: colors.subtle }}>
              {patient.nextAppointment
                ? `Próxima: ${formatShortDate(patient.nextAppointment)}`
                : "Sem consulta agendada"}
            </AppText>
          </View>
          <View
            className="flex-row items-center rounded-full px-3 py-1"
            style={{ backgroundColor: colors.secondary + "18", gap: 4 }}
          >
            <AppText style={{ fontSize: 12, fontWeight: "700", color: colors.secondary }}>
              Ver análise
            </AppText>
            <Ionicons name="chevron-forward" size={12} color={colors.secondary} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
