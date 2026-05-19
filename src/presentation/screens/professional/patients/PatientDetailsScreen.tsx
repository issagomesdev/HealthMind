import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TopBar } from "../../../components/navigation/TopBar";
import { AppText } from "../../../components/ui/AppText";
import { AppCard } from "../../../components/ui/AppCard";
import { LoadingState } from "../../../components/ui/LoadingState";
import { ConfirmActionModal } from "../../../components/ui/ConfirmActionModal";
import { useTheme } from "../../../../core/theme";
import { patientsService } from "../../../../services/patients/PatientsService";
import { patientDiaryService } from "../../../../services/patients/patientDiaryService";
import { patientAppointmentService } from "../../../../services/patients/patientAppointmentService";
import { patientObservationService } from "../../../../services/patients/patientObservationService";
import { ProfessionalPatient } from "../../../../types/patient";
import { getInitials, getRiskConfig } from "../../../../utils/patient";
import { ActionQuickCard } from "../../../components/professional/patients/ActionQuickCard";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

function formatDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function maskCurrency(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  const value = parseInt(digits, 10) / 100;
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const PLAN_TAG_LABELS: Record<string, string> = {
  premium: "Premium",
  free: "Free",
  cbt: "TCC",
  mindfulness: "Mindfulness",
  coaching: "Coaching",
  grief_support: "Suporte ao Luto",
  trauma: "Trauma",
  anxiety: "Ansiedade",
};

export function PatientDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const [patient, setPatient] = useState<ProfessionalPatient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showExtraChargeModal, setShowExtraChargeModal] = useState(false);
  const [showChargeConfirm, setShowChargeConfirm] = useState(false);
  const [extraDesc, setExtraDesc] = useState("");
  const [extraValueRaw, setExtraValueRaw] = useState("");
  const [extraReason, setExtraReason] = useState("");
  const [isSubmittingCharge, setIsSubmittingCharge] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    patientsService.getPatientById(id).then((p) => {
      setPatient(p);
      setIsLoading(false);
    });
  }, [id]);

  const handleExtraChargeSubmit = useCallback(async () => {
    if (!patient || !extraDesc || !extraValueRaw) return;
    setIsSubmittingCharge(true);
    try {
      const digits = extraValueRaw.replace(/\D/g, "");
      const amount = digits ? parseInt(digits, 10) / 100 : 0;
      await patientsService.addExtraCharge(patient.id, {
        description: extraDesc,
        amount,
        reason: extraReason,
      });
      setShowChargeConfirm(false);
      setShowExtraChargeModal(false);
      setExtraDesc("");
      setExtraValueRaw("");
      setExtraReason("");
    } finally {
      setIsSubmittingCharge(false);
    }
  }, [patient, extraDesc, extraValueRaw, extraReason]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        <TopBar title="Detalhes" onBackPress={() => router.back()} showMenu={false} />
        <LoadingState message="Carregando prontuário..." fullScreen />
      </View>
    );
  }

  if (!patient) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        <TopBar title="Detalhes" onBackPress={() => router.back()} showMenu={false} />
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="person-outline" size={48} color={colors.subtle} />
          <AppText variant="heading3" color="muted" className="text-center mt-4">
            Paciente não encontrado
          </AppText>
        </View>
      </View>
    );
  }

  const riskConfig = getRiskConfig(patient.riskLevel, patient.status);
  const isPending = patient.status === "pending";

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <TopBar title="Prontuário" onBackPress={() => router.back()} showMenu={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 48, gap: 14 }}
      >
        {/* Header card */}
        <AppCard>
          <View style={{ alignItems: "center", gap: 14 }}>
            <View
              style={{
                width: 88,
                height: 88,
                borderRadius: 44,
                backgroundColor: colors.secondary + "20",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AppText style={{ color: colors.secondary, fontWeight: "700", fontSize: 30 }}>
                {getInitials(patient.name)}
              </AppText>
            </View>

            <View style={{ alignItems: "center", gap: 4 }}>
              <AppText style={{ fontWeight: "800", fontSize: 26, color: colors.content, textAlign: "center" }}>
                {patient.name}
              </AppText>
              <AppText style={{ color: colors.subtle, fontSize: 14 }}>
                {patient.age} anos • {patient.gender}
              </AppText>
              <AppText style={{ color: colors.subtle, fontSize: 13 }}>
                {patient.city}, {patient.state}
              </AppText>
            </View>

            {/* Complaint pills — primary (red) + secondary (teal) */}
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              <View
                style={{
                  borderWidth: 1.5,
                  borderColor: "#EF444480",
                  borderRadius: 99,
                  paddingHorizontal: 12,
                  paddingVertical: 5,
                  backgroundColor: "#EF444408",
                }}
              >
                <AppText style={{ color: "#EF4444", fontWeight: "600", fontSize: 13 }}>
                  Principal: {patient.mainComplaint}
                </AppText>
              </View>
              {patient.secondaryComplaints.slice(0, 1).map((c) => (
                <View
                  key={c}
                  style={{
                    borderWidth: 1.5,
                    borderColor: colors.secondary + "80",
                    borderRadius: 99,
                    paddingHorizontal: 12,
                    paddingVertical: 5,
                    backgroundColor: colors.secondary + "08",
                  }}
                >
                  <AppText style={{ color: colors.secondary, fontWeight: "600", fontSize: 13 }}>
                    Secundária: {c}
                  </AppText>
                </View>
              ))}
            </View>

            {patient.planTags.length > 0 && (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
                {patient.planTags.map((tag) => (
                  <View
                    key={tag}
                    style={{
                      backgroundColor: tag === "premium" ? "#F59E0B15" : colors.secondary + "15",
                      borderRadius: 99,
                      paddingHorizontal: 10,
                      paddingVertical: 3,
                    }}
                  >
                    <AppText style={{ color: tag === "premium" ? "#F59E0B" : colors.secondary, fontWeight: "600", fontSize: 12 }}>
                      {PLAN_TAG_LABELS[tag] ?? tag}
                    </AppText>
                  </View>
                ))}
              </View>
            )}
          </View>
        </AppCard>

        {isPending ? (
          <PendingPatientView patient={patient} colors={colors} riskConfig={riskConfig} />
        ) : (
          <ActivePatientView
            patient={patient}
            colors={colors}
            riskConfig={riskConfig}
            router={router}
            onExtraCharge={() => setShowExtraChargeModal(true)}
          />
        )}
      </ScrollView>

      {/* Extra Charge Modal */}
      <Modal
        visible={showExtraChargeModal}
        transparent
        animationType="slide"
        onRequestClose={() => !isSubmittingCharge && setShowExtraChargeModal(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              gap: 14,
            }}
          >
            <AppText variant="heading3" style={{ fontWeight: "700" }}>
              Cobrança extra
            </AppText>
            <TextInput
              value={extraDesc}
              onChangeText={setExtraDesc}
              placeholder="Descrição (ex: Material extra)"
              placeholderTextColor={colors.subtle}
              style={{
                backgroundColor: colors.muted + "40",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 12,
                color: colors.content,
                fontSize: 15,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.muted + "40",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: 12,
                height: 48,
                gap: 6,
              }}
            >
              <AppText variant="bodyMedium" color="muted">R$</AppText>
              <TextInput
                value={extraValueRaw}
                onChangeText={(t) => setExtraValueRaw(maskCurrency(t))}
                placeholder="0,00"
                placeholderTextColor={colors.subtle}
                keyboardType="numeric"
                style={{ flex: 1, color: colors.content, fontSize: 16, fontWeight: "600" }}
              />
            </View>
            <TextInput
              value={extraReason}
              onChangeText={setExtraReason}
              placeholder="Motivo da cobrança extra"
              placeholderTextColor={colors.subtle}
              multiline
              numberOfLines={3}
              style={{
                backgroundColor: colors.muted + "40",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 12,
                color: colors.content,
                fontSize: 15,
                minHeight: 80,
                textAlignVertical: "top",
              }}
            />
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => setShowExtraChargeModal(false)}
                disabled={isSubmittingCharge}
                style={{
                  flex: 1,
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: "center",
                  borderWidth: 1.5,
                  borderColor: colors.border,
                }}
              >
                <AppText variant="bodyMedium" color="muted">Cancelar</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowChargeConfirm(true)}
                disabled={!extraDesc || !extraValueRaw}
                style={{
                  flex: 1,
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: "center",
                  backgroundColor: colors.secondary,
                  opacity: !extraDesc || !extraValueRaw ? 0.6 : 1,
                }}
              >
                <AppText variant="bodyMedium" style={{ color: "#fff", fontWeight: "700" }}>
                  Continuar
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Extra Charge: Confirm Modal */}
      <ConfirmActionModal
        visible={showChargeConfirm}
        onConfirm={handleExtraChargeSubmit}
        onCancel={() => setShowChargeConfirm(false)}
        isLoading={isSubmittingCharge}
        icon="receipt-outline"
        iconColor={colors.error}
        title="Confirmar cobrança extra?"
        confirmLabel="Confirmar"
        cancelLabel="Voltar"
        confirmColor={colors.error}
        description={
          <AppText style={{ fontSize: 14, color: colors.subtle, textAlign: "center", lineHeight: 20 }}>
            Será enviada uma cobrança de{" "}
            <AppText style={{ fontWeight: "700", color: colors.error }}>R$ {extraValueRaw}</AppText>{" "}
            referente a{" "}
            <AppText style={{ fontWeight: "600", color: colors.content }}>{extraDesc}</AppText>.
            {"\n"}O paciente receberá uma notificação para aceite.
          </AppText>
        }
      />
    </View>
  );
}

function PendingPatientView({
  patient,
  colors,
  riskConfig,
}: {
  patient: ProfessionalPatient;
  colors: ReturnType<typeof useTheme>["colors"];
  riskConfig: ReturnType<typeof getRiskConfig>;
}) {
  const cr = patient.contractRequest;
  if (!cr) return null;
  return (
    <>
      <AppCard>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 12,
            backgroundColor: "#9CA3AF15",
            borderRadius: 10,
            padding: 10,
          }}
        >
          <Ionicons name="time-outline" size={18} color="#9CA3AF" />
          <AppText variant="small" style={{ color: "#9CA3AF", fontWeight: "600" }}>
            Aguardando aceitação do paciente
          </AppText>
        </View>
        <AppText variant="bodyMedium" style={{ fontWeight: "700", marginBottom: 10 }}>
          Proposta enviada em {new Date(cr.sentAt).toLocaleDateString("pt-BR")}
        </AppText>
        <InfoRow label="Valor" value={`R$ ${cr.serviceValue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`} />
        <InfoRow
          label="Pagamento"
          value={cr.paymentType === "recurring" ? `Recorrente (${cr.recurringInterval ?? "—"})` : "Pagamento único"}
        />
        <InfoRow label="Formato" value={cr.appointmentFormat === "online" ? "Online" : cr.appointmentFormat === "in_person" ? "Presencial" : "Híbrido"} />
        {cr.sessionsIncluded && <InfoRow label="Sessões incluídas" value={String(cr.sessionsIncluded)} />}
        <InfoRow label="Duração" value={`${cr.sessionDurationMinutes} min`} />
        {cr.categories.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <AppText variant="small" color="muted" style={{ marginBottom: 6 }}>Categorias</AppText>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {cr.categories.map((cat) => (
                <View key={cat} style={{ backgroundColor: colors.secondary + "15", borderRadius: 99, paddingHorizontal: 10, paddingVertical: 3 }}>
                  <AppText variant="caption" style={{ color: colors.secondary, fontWeight: "600" }}>{cat}</AppText>
                </View>
              ))}
            </View>
          </View>
        )}
        {cr.message !== "" && (
          <View style={{ marginTop: 12 }}>
            <AppText variant="small" color="muted" style={{ marginBottom: 4 }}>Mensagem</AppText>
            <AppText variant="small" color="default">{cr.message}</AppText>
          </View>
        )}
      </AppCard>
    </>
  );
}

function ActivePatientView({
  patient,
  colors,
  riskConfig,
  router,
  onExtraCharge,
}: {
  patient: ProfessionalPatient;
  colors: ReturnType<typeof useTheme>["colors"];
  riskConfig: ReturnType<typeof getRiskConfig>;
  router: ReturnType<typeof useRouter>;
  onExtraCharge: () => void;
}) {
  type BS = { label: string; tone: "neutral" | "success" | "warning" | "danger" | "info" } | null;
  const [paymentBS,     setPaymentBS]     = React.useState<BS>(null);
  const [chatBS,        setChatBS]        = React.useState<BS>(null);
  const [diaryBS,       setDiaryBS]       = React.useState<BS>(null);
  const [appointmentBS, setAppointmentBS] = React.useState<BS>(null);
  const [observationBS, setObservationBS] = React.useState<BS>(null);
  const [extraChargeBS, setExtraChargeBS] = React.useState<BS>(null);

  React.useEffect(() => {
    const pid = patient.id;

    // Pagamentos + Cobrança extra
    patientsService.getPatientPaymentHistory(pid).then(({ payments, extraCharges }) => {
      const overdue  = payments.some((p) => p.status === "overdue");
      const pending  = payments.some((p) => p.status === "pending");
      if (overdue)       setPaymentBS({ label: "Em atraso", tone: "danger" });
      else if (pending)  setPaymentBS({ label: "Pendente",  tone: "warning" });
      else               setPaymentBS({ label: "Em dia",    tone: "success" });

      if (extraCharges.length > 0) {
        const latest = [...extraCharges].sort((a, b) => b.requestedAt.localeCompare(a.requestedAt))[0];
        setExtraChargeBS({
          label: `R$ ${latest.amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`,
          tone: "warning",
        });
      }
    });

    // Chat: mensagens não lidas
    patientsService.getUnreadMessageCount(pid).then((count) => {
      if (count > 0) setChatBS({ label: `${count} nova${count > 1 ? "s" : ""}`, tone: "info" });
    });

    // Diário: alertas ou total de registros
    patientDiaryService.getPatientDiaries(pid).then((diaries) => {
      const alerts = diaries.filter((d) => d.hasAlert).length;
      if (alerts > 0)           setDiaryBS({ label: `${alerts} alerta${alerts > 1 ? "s" : ""}`, tone: "danger" });
      else if (diaries.length)  setDiaryBS({ label: `${diaries.length} reg.`, tone: "info" });
    });

    // Agendamentos: próxima data + contagem
    Promise.all([
      patientAppointmentService.getNextAppointment(pid),
      patientAppointmentService.getUpcomingCount(pid),
    ]).then(([next, count]) => {
      if (!next) return;
      const d = new Date(next.scheduledAt);
      const isToday = d.toDateString() === new Date().toDateString();
      const timeStr = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      const label = isToday
        ? `Hoje ${timeStr}`
        : count > 1
          ? `${count} próx.`
          : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
      setAppointmentBS({ label, tone: isToday ? "warning" : "info" });
    });

    // Observações: urgentes/importantes ou total
    patientObservationService.getPatientObservations(pid).then((obs) => {
      const urgent    = obs.filter((o) => o.priority === "Urgente").length;
      const important = obs.filter((o) => o.isImportant).length;
      if (urgent)           setObservationBS({ label: `${urgent} urgente${urgent > 1 ? "s" : ""}`, tone: "danger" });
      else if (important)   setObservationBS({ label: `${important} import.`, tone: "warning" });
      else if (obs.length)  setObservationBS({ label: `${obs.length} nota${obs.length > 1 ? "s" : ""}`, tone: "neutral" });
    });
  }, [patient.id]);

  return (
    <>
      {/* Average Mood card */}
      <AppCard>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <Ionicons name="happy-outline" size={20} color={colors.secondary} />
          <AppText variant="small" color="muted" style={{ fontWeight: "500" }}>
            Humor Médio
          </AppText>
        </View>
        <AppText style={{ fontSize: 28, fontWeight: "800", color: colors.content, marginBottom: 4 }}>
          {riskConfig.label}
        </AppText>
        <AppText style={{ fontSize: 14, fontWeight: "600", color: patient.moodVariation >= 0 ? "#6DBF7B" : "#EF4444" }}>
          {patient.moodVariation >= 0 ? "+" : ""}{patient.moodVariation}% vs mês anterior
        </AppText>
        <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 99, overflow: "hidden", marginTop: 14, marginBottom: 12 }}>
          <View
            style={{
              height: "100%",
              width: `${(patient.averageMood / 10) * 100}%` as `${number}%`,
              backgroundColor: patient.averageMood >= 7 ? "#6DBF7B" : patient.averageMood >= 5 ? "#F59E0B" : "#EF4444",
              borderRadius: 99,
            }}
          />
        </View>
        <InfoRow label="Última interação" value={formatDate(patient.lastInteraction)} />
        {patient.nextAppointment && (
          <InfoRow label="Próxima consulta" value={formatDateTime(patient.nextAppointment)} />
        )}
      </AppCard>

      {/* Main Complaint */}
      <AppCard>
        <AppText variant="bodyMedium" style={{ fontWeight: "700", marginBottom: 10 }}>
          Queixa Principal
        </AppText>
        <AppText variant="body" color="default" style={{ marginBottom: 10 }}>
          {patient.mainComplaint}
        </AppText>
        {patient.secondaryComplaints.length > 0 && (
          <>
            <AppText variant="small" color="muted" style={{ marginBottom: 6 }}>
              Queixas secundárias
            </AppText>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              {patient.secondaryComplaints.map((c) => (
                <ChipTag key={c} label={c} colors={colors} />
              ))}
            </View>
          </>
        )}
        {patient.therapyGoals.length > 0 && (
          <>
            <AppText variant="small" color="muted" style={{ marginBottom: 6 }}>
              Objetivos terapêuticos
            </AppText>
            {patient.therapyGoals.map((g, i) => (
              <View key={i} style={{ flexDirection: "row", gap: 8, marginBottom: 4 }}>
                <Ionicons name="checkmark-circle-outline" size={16} color={colors.secondary} style={{ marginTop: 2 }} />
                <AppText variant="small" color="default" style={{ flex: 1 }}>{g}</AppText>
              </View>
            ))}
          </>
        )}
      </AppCard>

      {/* Recurrent Emotions card */}
      <AppCard>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Ionicons name="pulse-outline" size={20} color={colors.secondary} />
          <AppText variant="bodyMedium" style={{ fontWeight: "700" }}>
            Emoções Recorrentes
          </AppText>
        </View>
        {patient.recurringEmotions.length > 0 && (
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            {patient.recurringEmotions.map((e, i) => {
              const palette = [
                { bg: "#6DBF7B25", text: "#3D8C52" },
                { bg: "#FCA5A525", text: "#EF4444" },
                { bg: "#60A5FA25", text: "#2563EB" },
                { bg: "#F59E0B25", text: "#D97706" },
                { bg: "#C084FC25", text: "#9333EA" },
              ];
              const c = palette[i % palette.length];
              return (
                <View key={e} style={{ backgroundColor: c.bg, borderRadius: 99, paddingHorizontal: 12, paddingVertical: 6 }}>
                  <AppText style={{ color: c.text, fontWeight: "600", fontSize: 13 }}>{e}</AppText>
                </View>
              );
            })}
          </View>
        )}
        <InfoRow label="Sentimento dominante" value={patient.dominantFeeling} />
        {patient.recentFeelings.length > 0 && (
          <View style={{ marginTop: 8 }}>
            <AppText variant="small" color="muted" style={{ marginBottom: 6 }}>Sentimentos recentes</AppText>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {patient.recentFeelings.map((f) => <ChipTag key={f} label={f} colors={colors} />)}
            </View>
          </View>
        )}
      </AppCard>

      {/* Diary preview */}
      {(patient.diaryPreview || patient.recentDiaryEntries.length > 0) && (
        <AppCard>
          <AppText variant="bodyMedium" style={{ fontWeight: "700", marginBottom: 10 }}>
            Resumo do Diário
          </AppText>
          {patient.diaryPreview !== "" && (
            <AppText variant="small" color="muted" style={{ marginBottom: 12, lineHeight: 20 }}>
              {patient.diaryPreview}
            </AppText>
          )}
          {patient.recentDiaryEntries.slice(0, 3).map((entry) => (
            <View
              key={entry.id}
              style={{
                borderLeftWidth: 3,
                borderLeftColor: entry.mood >= 7 ? "#6DBF7B" : entry.mood >= 5 ? "#F59E0B" : "#EF4444",
                paddingLeft: 12,
                marginBottom: 10,
              }}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 2 }}>
                <AppText variant="caption" color="muted">
                  {new Date(entry.date).toLocaleDateString("pt-BR")}
                </AppText>
                <AppText variant="caption" style={{ color: entry.mood >= 7 ? "#6DBF7B" : entry.mood >= 5 ? "#F59E0B" : "#EF4444", fontWeight: "600" }}>
                  Humor {entry.mood}/10
                </AppText>
              </View>
              <AppText variant="small" color="default" numberOfLines={2}>{entry.summary}</AppText>
            </View>
          ))}
        </AppCard>
      )}

      {/* Notes & Alerts */}
      {(patient.importantNotes || patient.emotionalAlerts.length > 0) && (
        <AppCard>
          <AppText variant="bodyMedium" style={{ fontWeight: "700", marginBottom: 10 }}>
            Observações
          </AppText>
          {patient.importantNotes !== "" && (
            <AppText variant="small" color="default" style={{ lineHeight: 20, marginBottom: 10 }}>
              {patient.importantNotes}
            </AppText>
          )}
          {patient.emotionalAlerts.map((alert, i) => (
            <View
              key={i}
              style={{
                backgroundColor: colors.error + "12",
                borderRadius: 8,
                padding: 10,
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 8,
                marginBottom: 6,
              }}
            >
              <Ionicons name="warning-outline" size={16} color={colors.error} style={{ marginTop: 1 }} />
              <AppText variant="small" style={{ color: colors.error, flex: 1 }}>{alert}</AppText>
            </View>
          ))}
        </AppCard>
      )}

      {/* Progress */}
      {patient.progressSummary !== "" && (
        <AppCard>
          <AppText variant="bodyMedium" style={{ fontWeight: "700", marginBottom: 10 }}>
            Evolução
          </AppText>
          <AppText variant="small" color="default" style={{ lineHeight: 20 }}>
            {patient.progressSummary}
          </AppText>
        </AppCard>
      )}

      {/* Complementary info */}
      <AppCard>
        <AppText variant="bodyMedium" style={{ fontWeight: "700", marginBottom: 10 }}>
          Informações Complementares
        </AppText>
        <InfoRow label="Plano de saúde" value={patient.hasHealthInsurance ? (patient.healthInsuranceName ?? "Sim") : "Não"} />
        <InfoRow label="Terapia anterior" value={patient.hasPreviousTherapy ? "Sim" : "Não"} />
        <InfoRow label="Medicações" value={patient.currentMedications || "Nenhuma"} />
        <InfoRow label="Membro desde" value={formatDate(patient.memberSince)} />
      </AppCard>

      {/* Action shortcuts */}
      <AppCard>
        <AppText variant="bodyMedium" style={{ fontWeight: "700", marginBottom: 12 }}>
          Ações rápidas
        </AppText>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
          <ActionQuickCard
            icon="card-outline"
            title="Pagamentos"
            color={colors.secondary}
            badgeLabel={paymentBS?.label}
            badgeTone={paymentBS?.tone}
            onPress={() => router.push(`/(protected)/patient-payment?id=${patient.id}` as never)}
          />
          <ActionQuickCard
            icon="chatbubble-outline"
            title="Chat"
            color={colors.accent}
            badgeLabel={chatBS?.label}
            badgeTone={chatBS?.tone}
            onPress={() => router.push(`/(protected)/patient-chat?id=${patient.id}` as never)}
          />
          <ActionQuickCard
            icon="book-outline"
            title="Diário"
            color="#6DBF7B"
            badgeLabel={diaryBS?.label}
            badgeTone={diaryBS?.tone}
            onPress={() =>
              router.push(
                `/(protected)/patient-diary?id=${patient.id}&name=${encodeURIComponent(patient.name)}` as never
              )
            }
          />
          <ActionQuickCard
            icon="calendar-outline"
            title="Agendamentos"
            color="#F59E0B"
            badgeLabel={appointmentBS?.label}
            badgeTone={appointmentBS?.tone}
            onPress={() =>
              router.push(
                `/(protected)/patient-appointments?id=${patient.id}&name=${encodeURIComponent(patient.name)}` as never
              )
            }
          />
          <ActionQuickCard
            icon="pencil-outline"
            title="Observações"
            color={colors.primary}
            badgeLabel={observationBS?.label}
            badgeTone={observationBS?.tone}
            onPress={() =>
              router.push(
                `/(protected)/patient-observations?id=${patient.id}&name=${encodeURIComponent(patient.name)}` as never
              )
            }
          />
          <ActionQuickCard
            icon="cash-outline"
            title="Cobrança extra"
            color={colors.error}
            badgeLabel={extraChargeBS?.label}
            badgeTone={extraChargeBS?.tone}
            onPress={onExtraCharge}
          />
        </View>
      </AppCard>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
      <AppText variant="small" color="muted" style={{ flex: 1 }}>
        {label}
      </AppText>
      <AppText variant="small" color="default" style={{ flex: 1.5, textAlign: "right", fontWeight: "500" }}>
        {value}
      </AppText>
    </View>
  );
}

function ChipTag({
  label,
  colors,
  variant = "secondary",
}: {
  label: string;
  colors: ReturnType<typeof useTheme>["colors"];
  variant?: "secondary" | "primary";
}) {
  return (
    <View
      style={{
        backgroundColor: variant === "primary" ? colors.primary + "15" : colors.secondary + "15",
        borderRadius: 99,
        paddingHorizontal: 10,
        paddingVertical: 3,
      }}
    >
      <AppText
        variant="caption"
        style={{
          color: variant === "primary" ? colors.primary : colors.secondary,
          fontWeight: "600",
        }}
      >
        {label}
      </AppText>
    </View>
  );
}

