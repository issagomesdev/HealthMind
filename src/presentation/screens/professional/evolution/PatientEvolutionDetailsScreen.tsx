import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TopBar } from "../../../components/navigation/TopBar";
import { AppText } from "../../../components/ui/AppText";
import { LoadingState } from "../../../components/ui/LoadingState";
import { useTheme } from "../../../../core/theme";
import { usePatientEvolution } from "../../../../hooks/usePatientEvolution";
import { DashboardSection } from "../../../components/professional/evolution/DashboardSection";
import { RiskBadge } from "../../../components/professional/evolution/RiskBadge";
import { EvolutionProgressBar } from "../../../components/professional/evolution/EvolutionProgressBar";
import { EmotionalMetricCard } from "../../../components/professional/evolution/EmotionalMetricCard";
import { EmotionalTrendChart } from "../../../components/professional/evolution/EmotionalTrendChart";
import { EngagementCard } from "../../../components/professional/evolution/EngagementCard";
import { EmotionalAlertCard } from "../../../components/professional/evolution/EmotionalAlertCard";
import { TextInsightCard } from "../../../components/professional/evolution/InsightCard";
import { EvolutionFilterBar } from "../../../components/professional/evolution/EvolutionFilterBar";
import { usePatientQuickActions } from "../../../../hooks/usePatientQuickActions";
import type { PeriodFilter } from "../../../../types/evolution";

const TREND_CONFIG = {
  improving: { icon: "trending-up-outline" as const, color: "#059669", label: "Melhorando" },
  stable: { icon: "remove-outline" as const, color: "#D97706", label: "Estável" },
  worsening: { icon: "trending-down-outline" as const, color: "#DC2626", label: "Piorando" },
};

function pctTrend(pct: number): "up" | "down" | "stable" {
  if (pct > 0) return "up";
  if (pct < 0) return "down";
  return "stable";
}

export function PatientEvolutionDetailsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { patientId } = useLocalSearchParams<{ patientId: string }>();
  const [period, setPeriod] = useState<PeriodFilter>("30d");
  const quickActions = usePatientQuickActions();

  const { details, isLoading } = usePatientEvolution(patientId ?? "");

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <TopBar
          title="Análise do Paciente"
          onBackPress={() => router.back()}
          showNotifications={false}
        />
        <LoadingState fullScreen message="Carregando análise..." />
      </View>
    );
  }

  if (!details) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <TopBar
          title="Análise"
          onBackPress={() => router.back()}
          showNotifications={false}
        />
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="person-outline" size={48} color={colors.subtle} />
          <AppText
            style={{ fontSize: 16, fontWeight: "700", color: colors.content, marginTop: 12, textAlign: "center" }}
          >
            Análise detalhada não disponível
          </AppText>
          <AppText variant="small" style={{ color: colors.subtle, textAlign: "center", marginTop: 8 }}>
            Os dados detalhados deste paciente ainda não foram carregados.
          </AppText>
        </View>
      </View>
    );
  }

  const trend = TREND_CONFIG[details.trend];

  // Slice mood history based on period
  const moodSlice =
    period === "7d"
      ? details.moodHistory.slice(-7)
      : period === "30d"
      ? details.moodHistory
      : details.weeklyMoodHistory;


  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar
        title={details.name}
        onBackPress={() => router.back()}
        showNotifications={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        {/* Hero card */}
        <View className="mx-5 mb-6 rounded-3xl p-5" style={{ backgroundColor: colors.surface }}>
          {/* Avatar + name */}
          <View className="flex-row items-center mb-4" style={{ gap: 14 }}>
            <View
              className="w-16 h-16 rounded-2xl items-center justify-center"
              style={{ backgroundColor: colors.secondary + "22" }}
            >
              <AppText style={{ fontSize: 22, fontWeight: "800", color: colors.secondary }}>
                {details.avatarInitials}
              </AppText>
            </View>
            <View className="flex-1">
              <AppText style={{ fontSize: 18, fontWeight: "800", color: colors.content }}>
                {details.name}
              </AppText>
              <AppText variant="small" style={{ color: colors.subtle }}>
                {details.age} anos · {details.specialty}
              </AppText>
              <View className="flex-row items-center mt-1" style={{ gap: 8 }}>
                <RiskBadge level={details.riskLevel} />
                <View className="flex-row items-center" style={{ gap: 4 }}>
                  <Ionicons name={trend.icon} size={14} color={trend.color} />
                  <AppText style={{ fontSize: 12, fontWeight: "700", color: trend.color }}>
                    {trend.label}
                  </AppText>
                </View>
              </View>
            </View>
          </View>

          {/* Score bars */}
          <View style={{ gap: 10 }}>
            <EvolutionProgressBar
              value={details.emotionalScore}
              color={colors.secondary}
              label="Score emocional"
              showLabel
            />
            <EvolutionProgressBar
              value={details.stabilityScore}
              color="#059669"
              label="Estabilidade"
              showLabel
            />
            <EvolutionProgressBar
              value={details.engagementScore}
              color="#D97706"
              label="Engajamento"
              showLabel
            />
            <EvolutionProgressBar
              value={details.therapeuticProgress}
              color={colors.primary}
              label="Progresso terapêutico"
              showLabel
            />
          </View>
        </View>

        {/* Period selector */}
        <EvolutionFilterBar
          period={period}
          onPeriodChange={setPeriod}
        />

        {/* Mood history chart */}
        <DashboardSection title="Evolução do Humor" subtitle="Histórico de check-ins">
          <EmotionalTrendChart data={moodSlice} height={170} />
        </DashboardSection>

        {/* Monthly comparison */}
        <DashboardSection title="Comparativo Mensal" subtitle="vs. mês anterior">
          <View className="flex-row" style={{ gap: 10 }}>
            <EmotionalMetricCard
              icon="happy-outline"
              value={details.lastMonthComparison.mood.current.toFixed(1)}
              label="Humor"
              trend={pctTrend(details.lastMonthComparison.mood.pct)}
              trendPct={details.lastMonthComparison.mood.pct}
              iconColor={colors.secondary}
            />
            <EmotionalMetricCard
              icon="checkmark-done-outline"
              value={details.lastMonthComparison.checkins.current}
              label="Check-ins"
              trend={pctTrend(details.lastMonthComparison.checkins.pct)}
              trendPct={details.lastMonthComparison.checkins.pct}
              iconColor="#059669"
            />
            <EmotionalMetricCard
              icon="pulse-outline"
              value={details.lastMonthComparison.stress.current.toFixed(1)}
              label="Estresse"
              trend={pctTrend(-details.lastMonthComparison.stress.pct)}
              trendPct={Math.abs(details.lastMonthComparison.stress.pct)}
              iconColor="#DC2626"
            />
          </View>
        </DashboardSection>

        {/* Recurring emotions */}
        {details.recurringEmotions.length > 0 ? (
          <DashboardSection title="Emoções Recorrentes" subtitle="Frequência no período">
            <View
              className="rounded-2xl p-4"
              style={{ backgroundColor: colors.surface, gap: 10 }}
            >
              {details.recurringEmotions.map((em) => {
                const maxCount = details.recurringEmotions[0]?.count ?? 1;
                const pct = Math.round((em.count / maxCount) * 100);
                return (
                  <View key={em.label}>
                    <View className="flex-row justify-between items-center mb-1">
                      <AppText variant="small" style={{ color: colors.content }}>
                        {em.label}
                      </AppText>
                      <AppText variant="caption" style={{ color: colors.subtle }}>
                        {em.count}x
                      </AppText>
                    </View>
                    <EvolutionProgressBar
                      value={pct}
                      color={colors.secondary}
                      showLabel={false}
                      height={6}
                    />
                  </View>
                );
              })}
            </View>
          </DashboardSection>
        ) : null}

        {/* Therapeutic goals */}
        {details.therapeuticGoals.length > 0 ? (
          <DashboardSection title="Metas Terapêuticas" subtitle="Progresso atual">
            <View
              className="rounded-2xl p-4"
              style={{ backgroundColor: colors.surface, gap: 12 }}
            >
              {details.therapeuticGoals.map((goal) => (
                <EvolutionProgressBar
                  key={goal.label}
                  value={goal.progress}
                  color={colors.primary}
                  label={goal.label}
                  showLabel
                />
              ))}
            </View>
          </DashboardSection>
        ) : null}

        {/* Engagement */}
        <EngagementCard details={details} />

        {/* AI Insights */}
        {details.insights.length > 0 ? (
          <DashboardSection title="Insights" subtitle="Análise do período">
            {details.insights.map((text, i) => (
              <TextInsightCard key={i} text={text} />
            ))}
          </DashboardSection>
        ) : null}

        {/* Triggers & topics */}
        {(details.triggers.length > 0 || details.recurrentTopics.length > 0) ? (
          <DashboardSection title="Gatilhos e Temas Recorrentes">
            <View
              className="rounded-2xl p-4"
              style={{ backgroundColor: colors.surface, gap: 12 }}
            >
              {details.triggers.length > 0 ? (
                <View>
                  <AppText
                    variant="small"
                    style={{ color: colors.subtle, fontWeight: "700", marginBottom: 8 }}
                  >
                    Gatilhos identificados
                  </AppText>
                  <View className="flex-row flex-wrap" style={{ gap: 6 }}>
                    {details.triggers.map((t) => (
                      <View
                        key={t}
                        className="rounded-full px-3 py-1"
                        style={{ backgroundColor: "#FEF3C7" }}
                      >
                        <AppText style={{ fontSize: 12, color: "#92400E" }}>{t}</AppText>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}
              {details.recurrentTopics.length > 0 ? (
                <View>
                  <AppText
                    variant="small"
                    style={{ color: colors.subtle, fontWeight: "700", marginBottom: 8 }}
                  >
                    Temas frequentes nas sessões
                  </AppText>
                  <View className="flex-row flex-wrap" style={{ gap: 6 }}>
                    {details.recurrentTopics.map((t) => (
                      <View
                        key={t}
                        className="rounded-full px-3 py-1"
                        style={{ backgroundColor: "#EFF6FF" }}
                      >
                        <AppText style={{ fontSize: 12, color: "#1D4ED8" }}>{t}</AppText>
                      </View>
                    ))}
                  </View>
                </View>
              ) : null}
            </View>
          </DashboardSection>
        ) : null}

        {/* Activities & habits */}
        {(details.activities.length > 0 || details.habits.length > 0) ? (
          <DashboardSection title="Atividades e Hábitos">
            <View
              className="rounded-2xl p-4"
              style={{ backgroundColor: colors.surface, gap: 12 }}
            >
              {details.activities.length > 0 ? (
                <View style={{ gap: 10 }}>
                  <AppText variant="small" style={{ color: colors.subtle, fontWeight: "700" }}>
                    Atividades terapêuticas
                  </AppText>
                  {details.activities.map((act) => {
                    const pct =
                      act.totalCount > 0
                        ? Math.round((act.completedCount / act.totalCount) * 100)
                        : 0;
                    return (
                      <View key={act.label}>
                        <View className="flex-row justify-between items-center mb-1">
                          <AppText variant="small" style={{ color: colors.content }}>
                            {act.label}
                          </AppText>
                          <AppText variant="caption" style={{ color: colors.subtle }}>
                            {act.completedCount}/{act.totalCount}
                          </AppText>
                        </View>
                        <EvolutionProgressBar
                          value={pct}
                          color="#059669"
                          showLabel={false}
                          height={6}
                        />
                      </View>
                    );
                  })}
                </View>
              ) : null}

              {details.habits.length > 0 ? (
                <View style={{ gap: 8 }}>
                  <AppText variant="small" style={{ color: colors.subtle, fontWeight: "700" }}>
                    Consistência de hábitos
                  </AppText>
                  {details.habits.map((h) => (
                    <View key={h.label} className="flex-row items-center" style={{ gap: 10 }}>
                      <View
                        className="w-8 h-8 rounded-lg items-center justify-center"
                        style={{ backgroundColor: colors.secondary + "18" }}
                      >
                        <Ionicons
                          name={(h.icon as keyof typeof Ionicons.glyphMap) ?? "ellipse-outline"}
                          size={16}
                          color={colors.secondary}
                        />
                      </View>
                      <View className="flex-1">
                        <View className="flex-row justify-between items-center mb-1">
                          <AppText variant="small" style={{ color: colors.content }}>
                            {h.label}
                          </AppText>
                          <AppText variant="caption" style={{ color: colors.subtle }}>
                            {h.consistency}%
                          </AppText>
                        </View>
                        <EvolutionProgressBar
                          value={h.consistency}
                          color={colors.accent}
                          showLabel={false}
                          height={5}
                        />
                      </View>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          </DashboardSection>
        ) : null}

        {/* Alerts */}
        {details.alerts.length > 0 ? (
          <DashboardSection
            title="Alertas"
            subtitle={`${details.alerts.length} alerta${details.alerts.length > 1 ? "s" : ""}`}
          >
            {details.alerts.map((a) => (
              <EmotionalAlertCard key={a.id} alert={a} />
            ))}
          </DashboardSection>
        ) : null}

        {/* Important observations */}
        {details.importantObservations.length > 0 ? (
          <DashboardSection title="Observações Importantes">
            <View
              className="rounded-2xl p-4"
              style={{ backgroundColor: colors.surface, gap: 8 }}
            >
              {details.importantObservations.map((obs, i) => (
                <View key={i} className="flex-row items-start" style={{ gap: 8 }}>
                  <Ionicons
                    name="document-text-outline"
                    size={14}
                    color={colors.secondary}
                    style={{ marginTop: 2 }}
                  />
                  <AppText variant="small" style={{ color: colors.content, flex: 1, lineHeight: 20 }}>
                    {obs}
                  </AppText>
                </View>
              ))}
            </View>
          </DashboardSection>
        ) : null}

        {/* Quick actions */}
        <View className="mx-5 mb-4">
          <AppText
            style={{ fontSize: 16, fontWeight: "800", color: colors.content, marginBottom: 12 }}
          >
            Ações rápidas
          </AppText>
          <View className="flex-row flex-wrap" style={{ gap: 10 }}>
            {[
              {
                icon: "chatbubble-outline" as const,
                label: "Abrir chat",
                color: colors.secondary,
                onPress: () => quickActions.openPatientChat(patientId ?? "", details.name),
              },
              {
                icon: "folder-open-outline" as const,
                label: "Ver prontuário",
                color: "#059669",
                onPress: () => quickActions.openPatientRecord(patientId ?? ""),
              },
              {
                icon: "calendar-outline" as const,
                label: "Agendar consulta",
                color: "#7C3AED",
                onPress: () => quickActions.schedulePatientAppointment(patientId ?? "", details.name),
              },
              {
                icon: "create-outline" as const,
                label: "Observação",
                color: "#D97706",
                onPress: () => quickActions.createPatientObservation(patientId ?? "", details.name),
              },
            ].map((action) => (
              <TouchableOpacity
                key={action.label}
                onPress={action.onPress}
                className="flex-1 rounded-2xl p-4 items-center"
                style={{ backgroundColor: action.color + "15", minWidth: 130 }}
                activeOpacity={0.7}
              >
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center mb-2"
                  style={{ backgroundColor: action.color + "22" }}
                >
                  <Ionicons name={action.icon} size={20} color={action.color} />
                </View>
                <AppText
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: action.color,
                    textAlign: "center",
                  }}
                >
                  {action.label}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
