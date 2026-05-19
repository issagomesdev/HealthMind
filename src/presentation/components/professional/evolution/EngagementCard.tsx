import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../ui/AppText";
import { EvolutionProgressBar } from "./EvolutionProgressBar";
import { useTheme } from "../../../../core/theme";
import type { PatientEvolutionDetails } from "../../../../types/evolution";

interface Props {
  details: PatientEvolutionDetails;
}

export function EngagementCard({ details }: Props) {
  const { colors } = useTheme();
  const totalAppts = details.appointmentsAttended + details.appointmentsMissed;
  const attendancePct =
    totalAppts > 0
      ? Math.round((details.appointmentsAttended / totalAppts) * 100)
      : 0;

  const diaryPct = Math.min(100, Math.round((details.diaryFrequency / 7) * 100));
  const activityPct = Math.min(100, Math.round((details.activitiesCompleted / 40) * 100));

  return (
    <View
      className="rounded-2xl p-4 mb-4 mx-5"
      style={{ backgroundColor: colors.surface }}
    >
      <View className="flex-row items-center mb-4" style={{ gap: 8 }}>
        <Ionicons name="bar-chart-outline" size={18} color={colors.secondary} />
        <AppText style={{ fontSize: 16, fontWeight: "700", color: colors.content }}>
          Engajamento
        </AppText>
      </View>

      {/* Stats grid */}
      <View className="flex-row flex-wrap mb-4" style={{ gap: 12 }}>
        <View
          className="flex-1 rounded-xl p-3 items-center"
          style={{ backgroundColor: colors.background, minWidth: 70 }}
        >
          <AppText style={{ fontSize: 20, fontWeight: "800", color: "#059669" }}>
            {details.appointmentsAttended}
          </AppText>
          <AppText variant="caption" style={{ color: colors.subtle, textAlign: "center" }}>
            Consultas{"\n"}comparecidas
          </AppText>
        </View>
        <View
          className="flex-1 rounded-xl p-3 items-center"
          style={{ backgroundColor: colors.background, minWidth: 70 }}
        >
          <AppText style={{ fontSize: 20, fontWeight: "800", color: "#DC2626" }}>
            {details.appointmentsMissed}
          </AppText>
          <AppText variant="caption" style={{ color: colors.subtle, textAlign: "center" }}>
            Consultas{"\n"}perdidas
          </AppText>
        </View>
        <View
          className="flex-1 rounded-xl p-3 items-center"
          style={{ backgroundColor: colors.background, minWidth: 70 }}
        >
          <AppText style={{ fontSize: 20, fontWeight: "800", color: colors.secondary }}>
            {details.diaryFrequency.toFixed(1)}
          </AppText>
          <AppText variant="caption" style={{ color: colors.subtle, textAlign: "center" }}>
            Entradas{"\n"}diário/sem
          </AppText>
        </View>
        <View
          className="flex-1 rounded-xl p-3 items-center"
          style={{ backgroundColor: colors.background, minWidth: 70 }}
        >
          <AppText style={{ fontSize: 20, fontWeight: "800", color: "#D97706" }}>
            {details.avgTimeBetweenInteractionsDays.toFixed(1)}d
          </AppText>
          <AppText variant="caption" style={{ color: colors.subtle, textAlign: "center" }}>
            Média entre{"\n"}interações
          </AppText>
        </View>
      </View>

      {/* Progress bars */}
      <View style={{ gap: 12 }}>
        <EvolutionProgressBar
          value={attendancePct}
          color="#059669"
          label={`Presença em consultas (${details.appointmentsAttended}/${totalAppts})`}
          showLabel
        />
        <EvolutionProgressBar
          value={diaryPct}
          color={colors.secondary}
          label={`Frequência no diário (${details.diaryFrequency.toFixed(1)}x/sem)`}
          showLabel
        />
        <EvolutionProgressBar
          value={activityPct}
          color="#D97706"
          label={`Atividades completadas (${details.activitiesCompleted})`}
          showLabel
        />
      </View>
    </View>
  );
}
