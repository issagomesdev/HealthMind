import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "../../../components/ui/AppText";
import { AppCard } from "../../../components/ui/AppCard";
import { LoadingState } from "../../../components/ui/LoadingState";
import { ConfirmActionModal } from "../../../components/ui/ConfirmActionModal";
import { SuccessModal } from "../../../components/ui/SuccessModal";
import { useModal } from "../../../../hooks/useModal";
import { TopBar } from "../../../components/navigation/TopBar";
import { CalendarAppointmentStatusBadge } from "../../../components/professional/calendar/CalendarAppointmentStatusBadge";
import { useTheme } from "../../../../core/theme";
import { professionalCalendarService } from "../../../../services/professionalCalendarService";
import { ProfessionalAppointment } from "../../../../types/professionalCalendar";
import { getInitials, getRiskConfig } from "../../../../utils/patient";
import { useCallActions } from "../../../../hooks/useCallActions";
import { setPendingCalendarFocus } from "../../../../state/pendingCalendarFocus";
import { getTodayDateString } from "../../../../utils/date";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatValue(val: number): string {
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const RECURRENCE_LABELS: Record<string, string> = {
  none: "Não repete",
  weekly: "Semanal",
  biweekly: "Quinzenal",
  monthly: "Mensal",
};

const REMINDER_LABELS: Record<string, string> = {
  "10min": "10 minutos antes",
  "30min": "30 minutos antes",
  "1hour": "1 hora antes",
  "1day": "1 dia antes",
};

// ─── Info row helper ─────────────────────────────────────────────────────────

function InfoRow({
  icon,
  label,
  value,
  colors,
  valueColor,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  colors: ReturnType<typeof useTheme>["colors"];
  valueColor?: string;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.muted,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={16} color={colors.subtle} />
      </View>
      <View style={{ flex: 1 }}>
        <AppText style={{ fontSize: 11, fontWeight: "600", color: colors.subtle, marginBottom: 2 }}>
          {label.toUpperCase()}
        </AppText>
        <AppText
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: valueColor ?? colors.content,
            lineHeight: 20,
          }}
        >
          {value}
        </AppText>
      </View>
    </View>
  );
}

// ─── Action Button ────────────────────────────────────────────────────────────

function ActionButton({
  icon,
  label,
  onPress,
  color,
  ghost,
  colors,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  color?: string;
  ghost?: boolean;
  colors: ReturnType<typeof useTheme>["colors"];
}) {
  const btnColor = color ?? colors.secondary;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 13,
        borderRadius: 14,
        backgroundColor: ghost ? btnColor + "15" : btnColor,
        marginBottom: 10,
      }}
    >
      <Ionicons name={icon} size={18} color={ghost ? btnColor : "#fff"} />
      <AppText
        style={{
          fontSize: 15,
          fontWeight: "700",
          color: ghost ? btnColor : "#fff",
        }}
      >
        {label}
      </AppText>
    </TouchableOpacity>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────

export function AppointmentDetailsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ id: string }>();
  const { startSimulatedCall } = useCallActions();

  const [appointment, setAppointment] = useState<ProfessionalAppointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { show: showModal, modalProps } = useModal();

  // Modals
  const [cancelModal, setCancelModal] = useState(false);
  const [completeModal, setCompleteModal] = useState(false);
  const [postponeModal, setPostponeModal] = useState(false);
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [postponeLoading, setPostponeLoading] = useState(false);
  const [rescheduleLoading, setRescheduleLoading] = useState(false);

  useEffect(() => {
    if (!params.id) {
      setIsLoading(false);
      return;
    }
    professionalCalendarService
      .getAppointmentById(params.id)
      .then((a) => {
        setAppointment(a);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [params.id]);

  const handleCancel = async () => {
    if (!appointment) return;
    setCancelLoading(true);
    try {
      await professionalCalendarService.cancelAppointment(appointment.id);
      setCancelModal(false);
      setPendingCalendarFocus(appointment.date, appointment.id);
      router.back();
    } catch {
      showModal({ type: "error", title: "Erro", message: "Não foi possível cancelar a consulta." });
    } finally {
      setCancelLoading(false);
    }
  };

  const handlePostpone = async () => {
    if (!appointment) return;
    setPostponeLoading(true);
    try {
      const updated = await professionalCalendarService.postponeAppointment(appointment.id);
      setPostponeModal(false);
      if (updated) {
        setPendingCalendarFocus(updated.date, updated.id);
        router.back();
      }
    } catch {
      showModal({ type: "error", title: "Erro", message: "Não foi possível adiar a consulta." });
    } finally {
      setPostponeLoading(false);
    }
  };

  const handleReschedule = async () => {
    if (!appointment) return;
    setRescheduleLoading(true);
    try {
      const updated = await professionalCalendarService.rescheduleAppointment(appointment.id);
      setRescheduleModal(false);
      if (updated) {
        setPendingCalendarFocus(updated.date, updated.id);
        router.back();
      }
    } catch {
      showModal({ type: "error", title: "Erro", message: "Não foi possível reagendar a consulta." });
    } finally {
      setRescheduleLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!appointment) return;
    setCompleteLoading(true);
    try {
      await professionalCalendarService.updateAppointmentStatus(appointment.id, "completed");
      setAppointment((prev) =>
        prev ? { ...prev, status: "completed", statusLabel: "Concluída" } : prev
      );
      setCompleteModal(false);
    } catch {
      showModal({ type: "error", title: "Erro", message: "Não foi possível atualizar o status." });
    } finally {
      setCompleteLoading(false);
    }
  };

  const handleOpenCall = () => {
    if (!appointment) return;
    startSimulatedCall(
      { id: appointment.patientId, name: appointment.patientName },
      "video"
    );
  };

  const handleViewPatient = () => {
    if (appointment?.patientId) {
      router.push(`/patient-details?id=${appointment.patientId}`);
    }
  };

  const handleChat = () => {
    if (appointment?.patientId) {
      router.push(`/patient-chat?id=${appointment.patientId}`);
    }
  };

  if (isLoading) {
    return <LoadingState message="Carregando consulta..." />;
  }

  if (!appointment) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <TopBar title="Detalhes" onBackPress={() => router.back()} showNotifications={false} />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <AppText style={{ color: colors.subtle }}>Consulta não encontrada.</AppText>
        </View>
      </View>
    );
  }

  const initials = getInitials(appointment.patientName);
  const riskConfig = getRiskConfig(
    appointment.patientRiskLevel,
    appointment.patientRiskLevel === "stable" ? "stable" : "active"
  );

  const isActive = appointment.status === "scheduled" || appointment.status === "in_progress";
  const isCancelled = appointment.status === "cancelled";
  const isPastDate = appointment.date < getTodayDateString();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar
        title="Detalhes da Consulta"
        onBackPress={() => router.back()}
        showNotifications={false}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Patient card */}
        <AppCard style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
            {/* Avatar */}
            <View
              style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: colors.secondary + "25",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: colors.secondary + "40",
              }}
            >
              <AppText style={{ fontSize: 20, fontWeight: "800", color: colors.secondary }}>
                {initials}
              </AppText>
            </View>

            <View style={{ flex: 1 }}>
              <AppText
                style={{ fontSize: 18, fontWeight: "800", color: colors.content, marginBottom: 4 }}
              >
                {appointment.patientName}
              </AppText>
              <View
                style={{
                  alignSelf: "flex-start",
                  backgroundColor: riskConfig.bg,
                  borderRadius: 99,
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  borderWidth: 1,
                  borderColor: riskConfig.border,
                }}
              >
                <AppText style={{ fontSize: 12, fontWeight: "600", color: riskConfig.text }}>
                  {riskConfig.label}
                </AppText>
              </View>
            </View>

            <CalendarAppointmentStatusBadge status={appointment.status} />
          </View>
        </AppCard>

        {/* Details card */}
        <AppCard style={{ marginBottom: 20 }}>
          <AppText
            style={{
              fontSize: 15,
              fontWeight: "700",
              color: colors.content,
              marginBottom: 4,
            }}
          >
            Informações da consulta
          </AppText>

          <InfoRow
            icon="calendar-outline"
            label="Data"
            value={formatDate(appointment.date)}
            colors={colors}
          />
          <InfoRow
            icon="time-outline"
            label="Horário"
            value={`${appointment.time} · ${appointment.durationMinutes} min`}
            colors={colors}
          />
          <InfoRow
            icon="list-outline"
            label="Tipo"
            value={appointment.typeLabel}
            colors={colors}
          />
          <InfoRow
            icon={
              appointment.format === "online"
                ? "videocam-outline"
                : appointment.format === "in_person"
                ? "location-outline"
                : "git-merge-outline"
            }
            label="Formato"
            value={appointment.formatLabel}
            colors={colors}
          />
          {appointment.callLink && (
            <InfoRow
              icon="link-outline"
              label="Link da chamada"
              value={appointment.callLink}
              colors={colors}
              valueColor={colors.secondary}
            />
          )}
          {appointment.address && (
            <InfoRow
              icon="location-outline"
              label="Endereço"
              value={appointment.address}
              colors={colors}
            />
          )}
          <InfoRow
            icon="repeat-outline"
            label="Recorrência"
            value={RECURRENCE_LABELS[appointment.recurrence] ?? appointment.recurrence}
            colors={colors}
          />
          <InfoRow
            icon="notifications-outline"
            label="Lembrete"
            value={REMINDER_LABELS[appointment.reminderBefore] ?? appointment.reminderBefore}
            colors={colors}
          />
          {appointment.value !== null && (
            <InfoRow
              icon="cash-outline"
              label="Valor"
              value={formatValue(appointment.value)}
              colors={colors}
            />
          )}
        </AppCard>

        {/* Subject & Description */}
        {(appointment.subject || appointment.description) && (
          <AppCard style={{ marginBottom: 20 }}>
            {appointment.subject ? (
              <>
                <AppText
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: colors.subtle,
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                    marginBottom: 6,
                  }}
                >
                  Assunto
                </AppText>
                <AppText
                  style={{ fontSize: 15, fontWeight: "600", color: colors.content, marginBottom: 12 }}
                >
                  {appointment.subject}
                </AppText>
              </>
            ) : null}
            {appointment.description ? (
              <>
                <AppText
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: colors.subtle,
                    textTransform: "uppercase",
                    letterSpacing: 0.6,
                    marginBottom: 6,
                  }}
                >
                  Descrição
                </AppText>
                <AppText
                  style={{ fontSize: 14, color: colors.subtle, lineHeight: 20 }}
                >
                  {appointment.description}
                </AppText>
              </>
            ) : null}
          </AppCard>
        )}

        {/* Internal notes */}
        {appointment.internalNotes ? (
          <AppCard
            style={{
              marginBottom: 20,
              borderLeftWidth: 4,
              borderLeftColor: colors.accent,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Ionicons name="lock-closed-outline" size={15} color={colors.accent} />
              <AppText
                style={{ fontSize: 12, fontWeight: "700", color: colors.accent, textTransform: "uppercase", letterSpacing: 0.6 }}
              >
                Notas internas (privadas)
              </AppText>
            </View>
            <AppText style={{ fontSize: 14, color: colors.content, lineHeight: 20 }}>
              {appointment.internalNotes}
            </AppText>
          </AppCard>
        ) : null}

        {/* Actions */}
        <View style={{ marginTop: 4 }}>
          {!isCancelled && !isPastDate && (
            <ActionButton
              icon="videocam-outline"
              label="Entrar na chamada"
              onPress={handleOpenCall}
              color={colors.secondary}
              colors={colors}
            />
          )}

          <ActionButton
            icon="person-outline"
            label="Ver prontuário"
            onPress={handleViewPatient}
            ghost
            colors={colors}
          />

          <ActionButton
            icon="chatbubble-ellipses-outline"
            label="Chat com paciente"
            onPress={handleChat}
            ghost
            color={colors.accent}
            colors={colors}
          />

          {isActive && (
            <ActionButton
              icon="checkmark-circle-outline"
              label="Marcar como concluída"
              onPress={() => setCompleteModal(true)}
              ghost
              color="#6DBF7B"
              colors={colors}
            />
          )}

          {!isPastDate && (
            isCancelled ? (
              <ActionButton
                icon="calendar-outline"
                label="Reagendar consulta"
                onPress={() => setRescheduleModal(true)}
                color={colors.secondary}
                colors={colors}
              />
            ) : (
              <>
                <ActionButton
                  icon="calendar-outline"
                  label="Adiar consulta"
                  onPress={() => setPostponeModal(true)}
                  ghost
                  color={colors.secondary}
                  colors={colors}
                />

                <ActionButton
                  icon="close-circle-outline"
                  label="Cancelar consulta"
                  onPress={() => setCancelModal(true)}
                  ghost
                  color={colors.error}
                  colors={colors}
                />
              </>
            )
          )}
        </View>
      </ScrollView>

      {/* Cancel modal */}
      <ConfirmActionModal
        visible={cancelModal}
        onConfirm={handleCancel}
        onCancel={() => setCancelModal(false)}
        isLoading={cancelLoading}
        icon="close-circle-outline"
        iconColor={colors.error}
        title="Cancelar consulta"
        description={`Deseja cancelar a consulta com ${appointment.patientName} agendada para ${appointment.date} às ${appointment.time}?`}
        confirmLabel="Cancelar consulta"
        cancelLabel="Manter"
        confirmColor={colors.error}
      />

      {/* Postpone modal */}
      <ConfirmActionModal
        visible={postponeModal}
        onConfirm={handlePostpone}
        onCancel={() => setPostponeModal(false)}
        isLoading={postponeLoading}
        icon="calendar-outline"
        iconColor={colors.secondary}
        title="Adiar consulta"
        description={`Deseja adiar a consulta com ${appointment.patientName}?`}
        confirmLabel="Confirmar adiamento"
        cancelLabel="Voltar"
        confirmColor={colors.secondary}
      />

      {/* Reschedule modal */}
      <ConfirmActionModal
        visible={rescheduleModal}
        onConfirm={handleReschedule}
        onCancel={() => setRescheduleModal(false)}
        isLoading={rescheduleLoading}
        icon="calendar-outline"
        iconColor={colors.secondary}
        title="Reagendar consulta"
        description={`Deseja reagendar a consulta com ${appointment.patientName}?`}
        confirmLabel="Confirmar reagendamento"
        cancelLabel="Voltar"
        confirmColor={colors.secondary}
      />

      {/* Complete modal */}
      <ConfirmActionModal
        visible={completeModal}
        onConfirm={handleComplete}
        onCancel={() => setCompleteModal(false)}
        isLoading={completeLoading}
        icon="checkmark-circle-outline"
        iconColor="#6DBF7B"
        title="Marcar como concluída"
        description={`Confirmar que a consulta com ${appointment.patientName} foi realizada?`}
        confirmLabel="Confirmar conclusão"
        cancelLabel="Voltar"
        confirmColor="#6DBF7B"
      />

      <SuccessModal {...modalProps} />
    </View>
  );
}
