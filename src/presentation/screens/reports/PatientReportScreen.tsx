import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TopBar } from "../../components/navigation/TopBar";
import { AppText } from "../../components/ui/AppText";
import { LoadingState } from "../../components/ui/LoadingState";
import { MoodEvolutionChart } from "../../components/reports/MoodEvolutionChart";
import { PatientReportStatusBadge } from "../../components/reports/PatientReportStatusBadge";
import { EmptyReportState } from "../../components/reports/EmptyReportState";
import { useTheme } from "../../../core/theme";
import { usePatientQuickActions } from "../../../hooks/usePatientQuickActions";
import { usePatientReport } from "../../../hooks/usePatientReport";
import { SuccessModal } from "../../components/ui/SuccessModal";
import { useModal } from "../../../hooks/useModal";
import type { PatientReportStatus } from "../../../types/reports";

// ─── Local SectionCard ────────────────────────────────────────────────────────
function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        marginHorizontal: 16,
        marginTop: 16,
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 16,
      }}
    >
      <AppText style={{ fontSize: 16, fontWeight: "800", color: colors.content, marginBottom: subtitle ? 2 : 10 }}>
        {title}
      </AppText>
      {subtitle ? (
        <AppText style={{ fontSize: 12, color: colors.subtle, marginBottom: 12 }}>
          {subtitle}
        </AppText>
      ) : null}
      {children}
    </View>
  );
}

// ─── Metric strip item ────────────────────────────────────────────────────────
function Metric({ label, value }: { label: string; value: string | number }) {
  const { colors } = useTheme();
  return (
    <View style={{ alignItems: "center", flex: 1 }}>
      <AppText style={{ fontSize: 20, fontWeight: "800", color: colors.content }}>
        {value}
      </AppText>
      <AppText style={{ fontSize: 11, color: colors.subtle, marginTop: 2 }}>
        {label}
      </AppText>
    </View>
  );
}

// ─── Chip ─────────────────────────────────────────────────────────────────────
function Chip({ label, color }: { label: string; color?: string }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        backgroundColor: (color ?? colors.secondary) + "18",
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
      }}
    >
      <AppText style={{ fontSize: 13, color: color ?? colors.secondary, fontWeight: "600" }}>
        {label}
      </AppText>
    </View>
  );
}

// ─── Mini progress bar ────────────────────────────────────────────────────────
function ProgressMini({ pct }: { pct: number }) {
  const { colors } = useTheme();
  const clamp = Math.min(100, Math.max(0, pct));
  return (
    <View
      style={{
        width: 50,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.muted,
        overflow: "hidden",
        alignSelf: "center",
      }}
    >
      <View
        style={{
          width: `${clamp}%`,
          height: "100%",
          borderRadius: 3,
          backgroundColor: colors.secondary,
        }}
      />
    </View>
  );
}

// ─── PatientReportScreen ──────────────────────────────────────────────────────
export function PatientReportScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { patientId } = useLocalSearchParams<{ patientId: string }>();

  const { report, isLoading, isSavingNote, addNote } = usePatientReport(patientId ?? "");
  const { openPatientChat } = usePatientQuickActions();

  const [noteText, setNoteText] = useState("");
  const [isPrivateNote, setIsPrivateNote] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const { show: showModal, modalProps } = useModal();

  const handleSaveNote = async () => {
    if (!noteText.trim()) {
      showModal({ type: "warning", title: "Atenção", message: "Escreva uma observação antes de salvar." });
      return;
    }
    await addNote(noteText, isPrivateNote);
    setNoteText("");
    setIsPrivateNote(false);
    showModal({ type: "success", title: "Salvo", message: "Observação salva com sucesso.", actionLabel: "Ok" });
  };

  const handleExport = () => {
    setShowExportModal(false);
    showModal({ type: "coming-soon", title: "Em breve", message: "Funcionalidade disponível em breve." });
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <TopBar
          title="Relatório do Paciente"
          onBackPress={() => router.back()}
          showNotifications={false}
        />
        <LoadingState fullScreen message="Carregando relatório..." />
      </View>
    );
  }

  if (!report) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <TopBar
          title="Relatório do Paciente"
          onBackPress={() => router.back()}
          showNotifications={false}
        />
        <EmptyReportState type="no_data" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar
        title="Relatório do Paciente"
        onBackPress={() => router.back()}
        showNotifications={false}
        rightAction={
          <TouchableOpacity
            onPress={() => setShowExportModal(true)}
            activeOpacity={0.7}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: colors.muted,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="share-outline" size={18} color={colors.content} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        {/* Hero card */}
        <View
          style={{
            marginHorizontal: 16,
            marginTop: 8,
            backgroundColor: colors.surface,
            borderRadius: 20,
            padding: 20,
          }}
        >
          <View style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
            {/* Avatar */}
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: colors.secondary + "20",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <AppText style={{ fontSize: 16, fontWeight: "800", color: colors.secondary }}>
                {report.avatarInitials}
              </AppText>
            </View>

            {/* Info */}
            <View style={{ flex: 1 }}>
              <AppText style={{ fontSize: 18, fontWeight: "700", color: colors.content }}>
                {report.name}
              </AppText>
              <AppText style={{ fontSize: 13, color: colors.subtle, marginTop: 1 }}>
                {report.mainComplaint}
              </AppText>
              <AppText style={{ fontSize: 12, color: colors.subtle, marginTop: 2 }}>
                Membro desde {report.memberSince}
              </AppText>
            </View>

            {/* Status */}
            <PatientReportStatusBadge
              status={
                (report.alerts.length > 0
                  ? report.alerts.length >= 3
                    ? "critical"
                    : "attention"
                  : "stable") as PatientReportStatus
              }
            />
          </View>
        </View>

        {/* Period summary strip */}
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 16,
            marginTop: 12,
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 14,
          }}
        >
          <Metric label="Consultas" value={report.consultationsInPeriod} />
          <View style={{ width: 1, backgroundColor: colors.border }} />
          <Metric label="Diários" value={report.diaryEntriesInPeriod} />
          <View style={{ width: 1, backgroundColor: colors.border }} />
          <Metric label="Atividades" value={report.activitiesCompletedInPeriod} />
          <View style={{ width: 1, backgroundColor: colors.border }} />
          <Metric label="Humor Médio" value={report.averageMoodInPeriod.toFixed(1)} />
        </View>

        {/* Mood evolution */}
        <SectionCard title="Evolução Emocional" subtitle="Últimos 30 dias">
          <MoodEvolutionChart data={report.moodHistory} />
        </SectionCard>

        {/* Dominant emotions */}
        <SectionCard title="Emoções Predominantes">
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {report.dominantEmotions.map((e) => (
              <Chip key={e} label={e} />
            ))}
          </View>
        </SectionCard>

        {/* Recurring themes + triggers */}
        <SectionCard title="Temas Recorrentes e Gatilhos">
          <AppText
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: colors.subtle,
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Temas
          </AppText>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
            {report.recurringThemes.map((t) => (
              <Chip key={t} label={t} color={colors.accent} />
            ))}
          </View>
          <AppText
            style={{
              fontSize: 12,
              fontWeight: "700",
              color: colors.subtle,
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Gatilhos
          </AppText>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {report.triggers.map((t) => (
              <Chip key={t} label={t} color="#EF4444" />
            ))}
          </View>
        </SectionCard>

        {/* Activities */}
        <SectionCard title="Atividades Recomendadas">
          {report.recommendedActivities.map((a, i) => {
            const pct = a.totalCount > 0 ? (a.completedCount / a.totalCount) * 100 : 0;
            return (
              <View
                key={a.label}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingVertical: 10,
                  borderBottomWidth: i < report.recommendedActivities.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border,
                }}
              >
                <AppText style={{ fontSize: 14, color: colors.content, flex: 1 }}>
                  {a.label}
                </AppText>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <AppText style={{ fontSize: 12, color: colors.subtle }}>
                    {a.completedCount}/{a.totalCount}
                  </AppText>
                  <ProgressMini pct={pct} />
                </View>
              </View>
            );
          })}
        </SectionCard>

        {/* Appointments */}
        <SectionCard title="Histórico de Consultas">
          {report.appointmentsHistory.slice(0, 5).map((a, i) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                gap: 12,
                paddingVertical: 10,
                borderBottomWidth: i < Math.min(report.appointmentsHistory.length, 5) - 1 ? 1 : 0,
                borderBottomColor: colors.border,
                alignItems: "flex-start",
              }}
            >
              <Ionicons name="calendar-outline" size={16} color={colors.subtle} style={{ marginTop: 1 }} />
              <View style={{ flex: 1 }}>
                <AppText style={{ fontSize: 14, fontWeight: "700", color: colors.content }}>
                  {a.type}
                </AppText>
                <AppText style={{ fontSize: 12, color: colors.subtle, marginTop: 2, lineHeight: 16 }}>
                  {a.notes}
                </AppText>
              </View>
              <View style={{ alignItems: "flex-end", gap: 3 }}>
                <AppText style={{ fontSize: 12, color: colors.subtle }}>{a.date}</AppText>
                <View
                  style={{
                    backgroundColor:
                      a.status === "Agendada"
                        ? colors.secondary + "18"
                        : "#10B98118",
                    borderRadius: 8,
                    paddingHorizontal: 6,
                    paddingVertical: 2,
                  }}
                >
                  <AppText
                    style={{
                      fontSize: 10,
                      fontWeight: "700",
                      color: a.status === "Agendada" ? colors.secondary : "#059669",
                    }}
                  >
                    {a.status}
                  </AppText>
                </View>
              </View>
            </View>
          ))}
        </SectionCard>

        {/* Progress summary */}
        <SectionCard title="Resumo do Progresso">
          <AppText style={{ fontSize: 14, color: colors.content, lineHeight: 20 }}>
            {report.progressSummary}
          </AppText>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 6,
              marginTop: 12,
              padding: 10,
              backgroundColor: colors.muted + "60",
              borderRadius: 10,
            }}
          >
            <Ionicons name="information-circle-outline" size={14} color={colors.subtle} style={{ marginTop: 1 }} />
            <AppText
              style={{ fontSize: 11, color: colors.subtle, fontStyle: "italic", flex: 1, lineHeight: 16 }}
            >
              Este relatório é um apoio à análise clínica e não substitui avaliação profissional.
            </AppText>
          </View>
        </SectionCard>

        {/* Professional notes */}
        <SectionCard title="Observações do Profissional">
          {report.professionalNotes.map((n, i) => (
            <View
              key={i}
              style={{
                backgroundColor: colors.background,
                borderRadius: 12,
                padding: 14,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                <AppText style={{ fontSize: 11, color: colors.subtle }}>{n.date}</AppText>
                {n.private && (
                  <View
                    style={{
                      backgroundColor: colors.muted,
                      borderRadius: 8,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                    }}
                  >
                    <AppText style={{ fontSize: 10, fontWeight: "700", color: colors.subtle }}>
                      Privado
                    </AppText>
                  </View>
                )}
              </View>
              <AppText style={{ fontSize: 13, color: colors.content, lineHeight: 18 }}>
                {n.text}
              </AppText>
            </View>
          ))}

          {/* Add note */}
          <View style={{ marginTop: 8 }}>
            <AppText
              style={{ fontSize: 13, fontWeight: "700", color: colors.content, marginBottom: 6 }}
            >
              Adicionar nota clínica
            </AppText>
            <TextInput
              multiline
              value={noteText}
              onChangeText={setNoteText}
              placeholder="Escreva sua observação..."
              placeholderTextColor={colors.subtle}
              style={{
                minHeight: 80,
                backgroundColor: colors.background,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: 12,
                padding: 12,
                fontSize: 14,
                color: colors.content,
                textAlignVertical: "top",
              }}
            />
            <View style={{ flexDirection: "row", marginTop: 8, gap: 8, alignItems: "center" }}>
              {/* Private toggle */}
              <TouchableOpacity
                onPress={() => setIsPrivateNote((v) => !v)}
                activeOpacity={0.7}
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    borderWidth: 1.5,
                    borderColor: isPrivateNote ? colors.secondary : colors.border,
                    backgroundColor: isPrivateNote ? colors.secondary : "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isPrivateNote && <Ionicons name="checkmark" size={13} color="#ffffff" />}
                </View>
                <AppText style={{ fontSize: 13, color: colors.content }}>Privada</AppText>
              </TouchableOpacity>

              {/* Save button */}
              <TouchableOpacity
                onPress={handleSaveNote}
                activeOpacity={0.8}
                disabled={isSavingNote}
                style={{
                  flex: 1,
                  paddingVertical: 11,
                  borderRadius: 12,
                  backgroundColor: colors.secondary,
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  gap: 6,
                  opacity: isSavingNote ? 0.7 : 1,
                }}
              >
                {isSavingNote ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <AppText style={{ fontSize: 14, fontWeight: "700", color: "#ffffff" }}>
                    Salvar
                  </AppText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </SectionCard>

        {/* Alerts */}
        {report.alerts.length > 0 && (
          <SectionCard title="Alertas">
            {report.alerts.map((a, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  gap: 8,
                  padding: 12,
                  borderRadius: 12,
                  marginBottom: 6,
                  backgroundColor: "#FEF2F2",
                  alignItems: "flex-start",
                }}
              >
                <Ionicons name="warning-outline" size={16} color="#DC2626" style={{ marginTop: 1 }} />
                <AppText style={{ fontSize: 13, color: "#DC2626", flex: 1, lineHeight: 18 }}>
                  {a}
                </AppText>
              </View>
            ))}
          </SectionCard>
        )}

        {/* Action buttons */}
        <View style={{ marginHorizontal: 16, marginTop: 16, gap: 10 }}>
          <TouchableOpacity
            onPress={() => setShowExportModal(true)}
            activeOpacity={0.8}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              paddingVertical: 14,
              borderRadius: 14,
              backgroundColor: colors.secondary,
            }}
          >
            <Ionicons name="document-outline" size={18} color="#ffffff" />
            <AppText style={{ fontSize: 14, fontWeight: "700", color: "#ffffff" }}>
              Exportar PDF
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => showModal({ type: "coming-soon", title: "Em breve", message: "Funcionalidade disponível em breve." })}
            activeOpacity={0.8}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              paddingVertical: 14,
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: colors.secondary,
            }}
          >
            <Ionicons name="print-outline" size={18} color={colors.secondary} />
            <AppText style={{ fontSize: 14, fontWeight: "700", color: colors.secondary }}>
              Imprimir
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              openPatientChat(patientId ?? "", report?.name ?? "Paciente")
            }
            activeOpacity={0.8}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              paddingVertical: 14,
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: colors.secondary,
            }}
          >
            <Ionicons name="chatbubble-outline" size={18} color={colors.secondary} />
            <AppText style={{ fontSize: 14, fontWeight: "600", color: colors.secondary }}>
              Compartilhar com paciente
            </AppText>
          </TouchableOpacity>
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
            <AppText
              style={{
                fontSize: 17,
                fontWeight: "800",
                color: colors.content,
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Exportar relatório
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
              Exportar relatório de {report.name}?
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
                style={{
                  flex: 1,
                  paddingVertical: 13,
                  borderRadius: 12,
                  backgroundColor: colors.secondary,
                  alignItems: "center",
                }}
              >
                <AppText style={{ fontSize: 14, fontWeight: "700", color: "#ffffff" }}>
                  Confirmar
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <SuccessModal {...modalProps} />
    </View>
  );
}
