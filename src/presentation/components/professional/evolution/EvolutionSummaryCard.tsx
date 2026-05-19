import React from "react";
import { View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../ui/AppText";
import { useTheme } from "../../../../core/theme";
import type { DashboardSummary } from "../../../../types/evolution";

interface MiniCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  value: string | number;
  label: string;
  trendPct?: number;
}

function MiniCard({ icon, iconColor, value, label, trendPct }: MiniCardProps) {
  const { colors } = useTheme();
  const isPositive = trendPct !== undefined && trendPct >= 0;
  const trendColor =
    trendPct === undefined ? undefined : isPositive ? "#059669" : "#DC2626";

  return (
    <View
      className="rounded-2xl p-4 mr-3"
      style={{ backgroundColor: colors.surface, width: 130 }}
    >
      <View
        className="w-9 h-9 rounded-xl items-center justify-center mb-3"
        style={{ backgroundColor: iconColor + "22" }}
      >
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <AppText style={{ fontSize: 24, fontWeight: "800", color: colors.content }}>
        {value}
      </AppText>
      <AppText variant="caption" style={{ color: colors.subtle, marginTop: 2 }}>
        {label}
      </AppText>
      {trendPct !== undefined ? (
        <View className="flex-row items-center mt-1" style={{ gap: 2 }}>
          <Ionicons
            name={isPositive ? "arrow-up-outline" : "arrow-down-outline"}
            size={10}
            color={trendColor}
          />
          <AppText style={{ fontSize: 11, fontWeight: "700", color: trendColor }}>
            {Math.abs(trendPct)}% vs sem. ant.
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

interface Props {
  summary: DashboardSummary | null;
}

export function EvolutionSummaryCard({ summary }: Props) {
  const { colors } = useTheme();

  if (!summary) return null;

  return (
    <View className="mb-2">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 8, gap: 12 }}
      >
        <MiniCard
          icon="people-outline"
          iconColor={colors.secondary}
          value={summary.totalPatients}
          label="Pacientes"
        />
        <MiniCard
          icon="alert-circle-outline"
          iconColor="#DC2626"
          value={summary.patientsInAlert}
          label="Em alerta"
        />
        <MiniCard
          icon="trending-up-outline"
          iconColor="#059669"
          value={summary.positiveEvolutionThisMonth}
          label="Evol. positiva"
        />
        <MiniCard
          icon="checkmark-done-outline"
          iconColor={colors.accent}
          value={summary.checkInsThisMonth}
          label="Check-ins"
          trendPct={summary.weekComparison.checkIns.pct}
        />
        <MiniCard
          icon="happy-outline"
          iconColor="#D97706"
          value={summary.averageMoodScore.toFixed(1)}
          label="Humor médio"
          trendPct={summary.weekComparison.mood.pct}
        />
        <MiniCard
          icon="calendar-outline"
          iconColor={colors.primary}
          value={summary.completedAppointments}
          label="Consultas"
        />
        <MiniCard
          icon="time-outline"
          iconColor="#9CA3AF"
          value={summary.patientsWithoutRecentInteraction}
          label="Sem interação"
        />
      </ScrollView>
    </View>
  );
}
