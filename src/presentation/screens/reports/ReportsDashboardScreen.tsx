import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TopBar } from "../../components/navigation/TopBar";
import { AppText } from "../../components/ui/AppText";
import { useTheme } from "../../../core/theme";
import { useReports } from "../../../hooks/useReports";
import { reportsService } from "../../../services/reportsService";
import { ReportPeriodFilter } from "../../components/reports/ReportPeriodFilter";
import { ReportSummaryCards } from "../../components/reports/ReportSummaryCards";
import { MoodEvolutionChart } from "../../components/reports/MoodEvolutionChart";
import { ActivityAdherenceChart } from "../../components/reports/ActivityAdherenceChart";
import { DiaryFrequencyChart } from "../../components/reports/DiaryFrequencyChart";
import { EmotionDistributionCard } from "../../components/reports/EmotionDistributionCard";
import { PatientReportRow } from "../../components/reports/PatientReportRow";
import { ReportSkeletonCard } from "../../components/reports/ReportSkeletonCard";
import { EmptyReportState } from "../../components/reports/EmptyReportState";
import type { PatientReportStatus } from "../../../types/reports";

const STATUS_CHIPS: Array<{ label: string; value: PatientReportStatus | "all" }> = [
  { label: "Todos", value: "all" },
  { label: "Estável", value: "stable" },
  { label: "Atenção", value: "attention" },
  { label: "Crítico", value: "critical" },
];

export function ReportsDashboardScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const {
    summary,
    moodHistory,
    activityAdherence,
    diaryFrequency,
    emotionDist,
    filteredPatients,
    period,
    setPeriod,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    isLoading,
    refresh,
  } = useReports();

  const [showExportModal, setShowExportModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await reportsService.exportReportFake();
      setShowExportModal(false);
      Alert.alert("Sucesso", result.message);
    } catch {
      Alert.alert("Erro", "Não foi possível gerar o relatório.");
    } finally {
      setIsExporting(false);
    }
  };

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
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refresh}
            tintColor={colors.secondary}
          />
        }
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <View style={{ flex: 1 }}>
              <AppText style={{ fontSize: 26, fontWeight: "800", color: colors.content }}>
                Relatórios
              </AppText>
              <AppText style={{ fontSize: 13, color: colors.subtle, marginTop: 2, lineHeight: 18 }}>
                Acompanhe a evolução dos pacientes e gere análises organizadas.
              </AppText>
            </View>
            <TouchableOpacity
              onPress={() => setShowExportModal(true)}
              activeOpacity={0.8}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                backgroundColor: colors.secondary,
                borderRadius: 20,
                paddingHorizontal: 14,
                paddingVertical: 10,
                marginLeft: 12,
              }}
            >
              <Ionicons name="document-text-outline" size={15} color="#ffffff" />
              <AppText style={{ fontSize: 13, fontWeight: "700", color: "#ffffff" }}>
                Exportar
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Period filter */}
        <ReportPeriodFilter period={period} onChange={setPeriod} />

        {/* Summary cards */}
        <View style={{ paddingHorizontal: 16, marginTop: 4 }}>
          <ReportSummaryCards summary={summary} isLoading={isLoading} />
        </View>

        {/* Charts section */}
        <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
          <AppText style={{ fontSize: 17, fontWeight: "800", color: colors.content, marginBottom: 12 }}>
            Evolução Geral
          </AppText>

          {/* Mood chart */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 20,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <AppText style={{ fontSize: 14, fontWeight: "700", color: colors.content, marginBottom: 2 }}>
              Humor Médio dos Pacientes
            </AppText>
            <AppText style={{ fontSize: 12, color: colors.subtle, marginBottom: 12 }}>
              Por período selecionado
            </AppText>
            {isLoading ? (
              <ReportSkeletonCard height={160} />
            ) : (
              <MoodEvolutionChart data={moodHistory} />
            )}
          </View>

          {/* Activity adherence */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 20,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <AppText style={{ fontSize: 14, fontWeight: "700", color: colors.content, marginBottom: 2 }}>
              Adesão às Atividades
            </AppText>
            <AppText style={{ fontSize: 12, color: colors.subtle, marginBottom: 12 }}>
              % de atividades concluídas por semana
            </AppText>
            {isLoading ? (
              <ReportSkeletonCard height={140} />
            ) : (
              <ActivityAdherenceChart data={activityAdherence} />
            )}
          </View>

          {/* Diary frequency */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 20,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <AppText style={{ fontSize: 14, fontWeight: "700", color: colors.content, marginBottom: 4 }}>
              Frequência de Diários
            </AppText>
            {isLoading ? (
              <ReportSkeletonCard height={120} />
            ) : (
              <DiaryFrequencyChart data={diaryFrequency} />
            )}
          </View>

          {/* Emotion distribution */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 20,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <AppText style={{ fontSize: 14, fontWeight: "700", color: colors.content, marginBottom: 2 }}>
              Distribuição de Emoções
            </AppText>
            <AppText style={{ fontSize: 12, color: colors.subtle, marginBottom: 12 }}>
              Emoções mais registradas pelos pacientes
            </AppText>
            {isLoading ? (
              <ReportSkeletonCard height={160} />
            ) : (
              <EmotionDistributionCard data={emotionDist} />
            )}
          </View>
        </View>

        {/* Patient table */}
        <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <AppText style={{ fontSize: 17, fontWeight: "800", color: colors.content }}>
              Pacientes
            </AppText>
            <AppText style={{ fontSize: 12, color: colors.subtle }}>
              {filteredPatients.length} paciente(s)
            </AppText>
          </View>

          {/* Search */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.surface,
              borderRadius: 12,
              height: 44,
              paddingHorizontal: 14,
              marginBottom: 10,
              borderWidth: 1,
              borderColor: colors.border,
              gap: 8,
            }}
          >
            <Ionicons name="search-outline" size={18} color={colors.subtle} />
            <TextInput
              placeholder="Buscar paciente..."
              placeholderTextColor={colors.subtle}
              value={search}
              onChangeText={setSearch}
              style={{ flex: 1, fontSize: 14, color: colors.content }}
            />
          </View>

          {/* Status filter chips */}
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            {STATUS_CHIPS.map((chip) => {
              const isActive = statusFilter === chip.value;
              return (
                <TouchableOpacity
                  key={chip.value}
                  onPress={() => setStatusFilter(chip.value)}
                  activeOpacity={0.7}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                    borderRadius: 20,
                    backgroundColor: isActive ? colors.secondary : colors.surface,
                    borderWidth: isActive ? 0 : 1,
                    borderColor: colors.border,
                  }}
                >
                  <AppText
                    style={{
                      fontSize: 13,
                      fontWeight: isActive ? "700" : "500",
                      color: isActive ? "#ffffff" : colors.content,
                    }}
                  >
                    {chip.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Patient rows */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 20,
              overflow: "hidden",
            }}
          >
            {isLoading ? (
              [1, 2, 3].map((i) => (
                <ReportSkeletonCard key={i} height={72} borderRadius={0} />
              ))
            ) : filteredPatients.length === 0 ? (
              <EmptyReportState type="no_patients" />
            ) : (
              filteredPatients.map((p) => (
                <PatientReportRow
                  key={p.id}
                  patient={p}
                  onPress={() =>
                    router.push(`/(protected)/patient-report?patientId=${p.id}` as any)
                  }
                />
              ))
            )}
          </View>
        </View>

        {/* Disclaimer */}
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 16,
            marginTop: 16,
            gap: 6,
            alignItems: "center",
          }}
        >
          <Ionicons name="information-circle-outline" size={13} color={colors.subtle} />
          <AppText
            style={{
              fontSize: 11,
              color: colors.subtle,
              fontStyle: "italic",
              flex: 1,
              lineHeight: 16,
            }}
          >
            Os dados apresentados são um apoio à análise clínica e não substituem avaliação
            profissional direta.
          </AppText>
        </View>
      </ScrollView>

      {/* Export modal */}
      <Modal
        visible={showExportModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowExportModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
          }}
        >
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 20,
              padding: 24,
              width: "100%",
              maxWidth: 360,
            }}
          >
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: colors.secondary + "18",
                alignItems: "center",
                justifyContent: "center",
                alignSelf: "center",
                marginBottom: 16,
              }}
            >
              <Ionicons name="document-text-outline" size={24} color={colors.secondary} />
            </View>
            <AppText
              style={{
                fontSize: 17,
                fontWeight: "800",
                color: colors.content,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Gerar Relatório Completo
            </AppText>
            <AppText
              style={{
                fontSize: 13,
                color: colors.subtle,
                textAlign: "center",
                lineHeight: 18,
                marginBottom: 24,
              }}
            >
              Gerar relatório completo de todos os pacientes? Esta ação pode levar alguns
              instantes.
            </AppText>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => setShowExportModal(false)}
                activeOpacity={0.7}
                style={{
                  flex: 1,
                  paddingVertical: 13,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: "center",
                }}
              >
                <AppText style={{ fontSize: 14, fontWeight: "600", color: colors.content }}>
                  Cancelar
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleExport}
                activeOpacity={0.8}
                disabled={isExporting}
                style={{
                  flex: 1,
                  paddingVertical: 13,
                  borderRadius: 12,
                  backgroundColor: colors.secondary,
                  alignItems: "center",
                  opacity: isExporting ? 0.7 : 1,
                }}
              >
                <AppText style={{ fontSize: 14, fontWeight: "700", color: "#ffffff" }}>
                  {isExporting ? "Gerando..." : "Confirmar"}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
