import React, { useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../../components/ui/AppText";
import { TopBar } from "../../../components/navigation/TopBar";
import { LoadingState } from "../../../components/ui/LoadingState";
import { useTheme } from "../../../../core/theme";
import { useEvolutionDashboard } from "../../../../hooks/useEvolutionDashboard";
import { EvolutionSummaryCard } from "../../../components/professional/evolution/EvolutionSummaryCard";
import { EvolutionFilterBar } from "../../../components/professional/evolution/EvolutionFilterBar";
import { EmotionalTrendChart } from "../../../components/professional/evolution/EmotionalTrendChart";
import { DashboardSection } from "../../../components/professional/evolution/DashboardSection";
import { InsightCard } from "../../../components/professional/evolution/InsightCard";
import { EmotionalAlertCard } from "../../../components/professional/evolution/EmotionalAlertCard";
import { PatientEvolutionCard } from "../../../components/professional/evolution/PatientEvolutionCard";
import { EmptyEvolutionState } from "../../../components/professional/evolution/EmptyEvolutionState";
import type { SortFilter, RiskFilter } from "../../../../types/evolution";

const SORT_OPTIONS: { value: SortFilter; label: string }[] = [
  { value: "in_alert", label: "Em alerta primeiro" },
  { value: "most_active", label: "Mais ativos" },
  { value: "best_evolution", label: "Melhor evolução" },
  { value: "least_engagement", label: "Menor engajamento" },
];

const RISK_OPTIONS: { value: RiskFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "critical", label: "Crítico" },
  { value: "high_risk", label: "Risco Alto" },
  { value: "attention", label: "Atenção" },
  { value: "stable", label: "Estável" },
];

export function EvolutionDashboardScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { initialSearch } = useLocalSearchParams<{ initialSearch?: string; patientId?: string }>();
  const [showSortModal, setShowSortModal] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);

  const {
    summary,
    moodHistory,
    insights,
    alerts,
    patients,
    period,
    setPeriod,
    sort,
    setSort,
    risk,
    setRisk,
    search,
    setSearch,
    isLoading,
    refresh,
    dismissAlert,
  } = useEvolutionDashboard(initialSearch ?? "");

  const unreadAlerts = alerts.filter((a) => !a.isRead);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <LoadingState fullScreen message="Carregando painel de evolução..." />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar
        title="HealthMind"
        onBackPress={() => router.back()}
        showNotifications={false}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        {/* Header */}
        <View style={{ paddingTop: 4, paddingHorizontal: 20, marginBottom: 8 }}>
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <AppText style={{ fontSize: 26, fontWeight: "800", color: colors.content }}>
                Painel de Evolução
              </AppText>
              <AppText style={{ fontSize: 13, color: colors.subtle, marginTop: 4 }}>
                Acompanhe o progresso emocional e terapêutico dos seus pacientes.
              </AppText>
            </View>
            <TouchableOpacity
              onPress={refresh}
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.surface }}
            >
              <Ionicons name="refresh-outline" size={18} color={colors.content} />
            </TouchableOpacity>
          </View>

          {/* Alert badge */}
          {unreadAlerts.length > 0 ? (
            <View
              className="flex-row items-center rounded-xl px-3 py-2 mt-3"
              style={{ backgroundColor: "#FEF2F2", gap: 6 }}
            >
              <Ionicons name="alert-circle" size={16} color="#DC2626" />
              <AppText style={{ fontSize: 12, fontWeight: "700", color: "#991B1B" }}>
                {unreadAlerts.length} alerta{unreadAlerts.length > 1 ? "s" : ""} não lido
                {unreadAlerts.length > 1 ? "s" : ""} requerendo atenção
              </AppText>
            </View>
          ) : null}
        </View>

        {/* Summary cards */}
        <EvolutionSummaryCard summary={summary} />

        {/* Search */}
        <View className="px-5 mb-2">
          <View
            className="flex-row items-center rounded-xl px-3"
            style={{ backgroundColor: colors.surface, height: 44, gap: 8 }}
          >
            <Ionicons name="search-outline" size={18} color={colors.subtle} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar paciente..."
              placeholderTextColor={colors.subtle}
              style={{ flex: 1, fontSize: 14, color: colors.content }}
            />
            {search.length > 0 ? (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={18} color={colors.subtle} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        {/* Period filter + sort/risk buttons */}
        <View className="flex-row items-center">
          <View className="flex-1">
            <EvolutionFilterBar
              period={period}
              onPeriodChange={setPeriod}
              sort={sort}
              onSortChange={setSort}
              risk={risk}
              onRiskChange={setRisk}
              showSort
              showRisk
            />
          </View>
          <View className="flex-row pr-4" style={{ gap: 6 }}>
            <TouchableOpacity
              onPress={() => setShowSortModal(true)}
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.surface }}
            >
              <Ionicons name="swap-vertical-outline" size={17} color={colors.content} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowRiskModal(true)}
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{
                backgroundColor: risk !== "all" ? colors.secondary : colors.surface,
              }}
            >
              <Ionicons
                name="filter-outline"
                size={17}
                color={risk !== "all" ? "#fff" : colors.content}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Mood chart */}
        <DashboardSection
          title="Humor Médio Geral"
          subtitle="Evolução dos últimos dias"
        >
          <EmotionalTrendChart data={moodHistory} height={160} />
        </DashboardSection>

        {/* AI Insights */}
        {insights.length > 0 ? (
          <DashboardSection
            title="Insights Inteligentes"
            subtitle="Análise automática dos seus pacientes"
          >
            {insights.slice(0, 3).map((ins) => (
              <InsightCard key={ins.id} insight={ins} />
            ))}
          </DashboardSection>
        ) : null}

        {/* Emotional alerts */}
        {unreadAlerts.length > 0 ? (
          <DashboardSection
            title="Alertas Emocionais"
            subtitle={`${unreadAlerts.length} alerta${unreadAlerts.length > 1 ? "s" : ""} ativos`}
          >
            {unreadAlerts.map((a) => (
              <EmotionalAlertCard
                key={a.id}
                alert={a}
                onPress={() =>
                  router.push(
                    `/(protected)/patient-evolution-details?patientId=${a.patientId}`
                  )
                }
                onDismiss={() => dismissAlert(a.id)}
              />
            ))}
          </DashboardSection>
        ) : null}

        {/* Patient list */}
        <DashboardSection
          title="Pacientes"
          subtitle={`${patients.length} paciente${patients.length !== 1 ? "s" : ""}`}
          rightAction={
            <TouchableOpacity
              onPress={() => setShowSortModal(true)}
              className="flex-row items-center rounded-full px-3 py-1"
              style={{ backgroundColor: colors.surface, gap: 4 }}
            >
              <Ionicons name="funnel-outline" size={13} color={colors.subtle} />
              <AppText variant="caption" style={{ color: colors.subtle }}>
                Ordenar
              </AppText>
            </TouchableOpacity>
          }
        >
          {patients.length === 0 ? (
            <EmptyEvolutionState />
          ) : (
            patients.map((p) => (
              <PatientEvolutionCard
                key={p.id}
                patient={p}
                onPress={() =>
                  router.push(
                    `/(protected)/patient-evolution-details?patientId=${p.id}`
                  )
                }
              />
            ))
          )}
        </DashboardSection>
      </ScrollView>

      {/* Sort Modal */}
      <Modal
        visible={showSortModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          onPress={() => setShowSortModal(false)}
          activeOpacity={1}
        >
          <View
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl p-6"
            style={{ backgroundColor: colors.surface }}
          >
            <AppText
              style={{ fontSize: 18, fontWeight: "800", color: colors.content, marginBottom: 16 }}
            >
              Ordenar por
            </AppText>
            {SORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => {
                  setSort(opt.value);
                  setShowSortModal(false);
                }}
                className="flex-row items-center justify-between py-3"
                style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
              >
                <AppText
                  style={{
                    fontSize: 15,
                    fontWeight: sort === opt.value ? "700" : "400",
                    color: sort === opt.value ? colors.secondary : colors.content,
                  }}
                >
                  {opt.label}
                </AppText>
                {sort === opt.value ? (
                  <Ionicons name="checkmark-circle" size={20} color={colors.secondary} />
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Risk filter Modal */}
      <Modal
        visible={showRiskModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRiskModal(false)}
      >
        <TouchableOpacity
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
          onPress={() => setShowRiskModal(false)}
          activeOpacity={1}
        >
          <View
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl p-6"
            style={{ backgroundColor: colors.surface }}
          >
            <AppText
              style={{ fontSize: 18, fontWeight: "800", color: colors.content, marginBottom: 16 }}
            >
              Filtrar por risco
            </AppText>
            {RISK_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                onPress={() => {
                  setRisk(opt.value);
                  setShowRiskModal(false);
                }}
                className="flex-row items-center justify-between py-3"
                style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
              >
                <AppText
                  style={{
                    fontSize: 15,
                    fontWeight: risk === opt.value ? "700" : "400",
                    color: risk === opt.value ? colors.secondary : colors.content,
                  }}
                >
                  {opt.label}
                </AppText>
                {risk === opt.value ? (
                  <Ionicons name="checkmark-circle" size={20} color={colors.secondary} />
                ) : null}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
