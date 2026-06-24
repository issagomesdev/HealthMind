import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { TopBar } from "../../components/navigation/TopBar";
import { AppText } from "../../components/ui/AppText";
import { AppCard } from "../../components/ui/AppCard";
import { LoadingState } from "../../components/ui/LoadingState";
import { NextAppointmentCard } from "../../components/appointments/NextAppointmentCard";
import { AppointmentsCalendar } from "../../components/appointments/AppointmentsCalendar";
import { AppointmentListCard } from "../../components/appointments/AppointmentListCard";
import { DailyActivityCard } from "../../components/appointments/DailyActivityCard";
import { ReminderAlertCard } from "../../components/appointments/ReminderAlertCard";
import { FindProfessionalShortcutCard } from "../../components/appointments/FindProfessionalShortcutCard";
import { useAppointmentsController } from "../../controllers/useAppointmentsController";
import { SuccessModal } from "../../components/ui/SuccessModal";
import { ConfirmActionModal } from "../../components/ui/ConfirmActionModal";
import { useTheme } from "../../../core/theme";
import { UserAppointment } from "../../../core/types";
import {
  generateMockAppointmentsForDate,
  postponeMockAppointment,
  rescheduleMockAppointment,
} from "../../../data/fake/mockUserAppointments";

interface AppointmentsScreenProps {
  onNavigateToProfessionals: () => void;
}

type PendingActionType = "cancel" | "postpone" | "reschedule";

interface PendingAction {
  type: PendingActionType;
  appointmentId: string;
}

const CONFIRM_PROMPTS: Record<
  PendingActionType,
  { title: string; description: string; confirmLabel: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  cancel: {
    title: "Cancelar consulta",
    description: "Deseja cancelar esta consulta?",
    confirmLabel: "Confirmar cancelamento",
    icon: "close-circle-outline",
  },
  postpone: {
    title: "Adiar consulta",
    description: "Deseja adiar esta consulta?",
    confirmLabel: "Confirmar adiamento",
    icon: "calendar-outline",
  },
  reschedule: {
    title: "Remarcar consulta",
    description: "Deseja remarcar esta consulta?",
    confirmLabel: "Confirmar remarcação",
    icon: "calendar-outline",
  },
};

// Scheduled appointments first (soonest to latest), cancelled ones always last.
function sortAppointments(appointments: UserAppointment[]): UserAppointment[] {
  return [...appointments].sort((a, b) => {
    if (a.status === "cancelled" && b.status !== "cancelled") return 1;
    if (a.status !== "cancelled" && b.status === "cancelled") return -1;
    const dateA = new Date(`${a.date}T${a.time}`).getTime();
    const dateB = new Date(`${b.date}T${b.time}`).getTime();
    return dateA - dateB;
  });
}

function SectionHeader({ title, badge }: { title: string; badge?: string }) {
  const { colors } = useTheme();
  return (
    <View className="flex-row items-center justify-between px-5 mb-3">
      <AppText variant="heading3" className="font-bold">
        {title}
      </AppText>
      {badge && (
        <View
          className="px-2.5 py-1 rounded-full"
          style={{ backgroundColor: colors.secondary }}
        >
          <AppText variant="caption" color="white" className="font-bold tracking-wide uppercase">
            {badge}
          </AppText>
        </View>
      )}
    </View>
  );
}

export function AppointmentsScreen({ onNavigateToProfessionals }: AppointmentsScreenProps) {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const ctrl = useAppointmentsController();
  const { colors } = useTheme();

  const [appointments, setAppointments] = useState<UserAppointment[]>([]);
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useFocusEffect(
    React.useCallback(() => {
      ctrl.loadAll();
    }, [])
  );

  // Re-generate the mocked appointments list whenever the calendar's
  // selected date changes, reusing cached data if the date was seen before.
  useEffect(() => {
    setAppointments(sortAppointments(generateMockAppointmentsForDate(ctrl.selectedDate)));
  }, [ctrl.selectedDate]);

  const handleRequestCancelAppointment = (appointmentId: string) => {
    setPendingAction({ type: "cancel", appointmentId });
  };

  const handleRequestPostponeAppointment = (appointmentId: string) => {
    setPendingAction({ type: "postpone", appointmentId });
  };

  const handleRequestRescheduleAppointment = (appointmentId: string) => {
    setPendingAction({ type: "reschedule", appointmentId });
  };

  const handleConfirmCancelAppointment = (appointmentId: string) => {
    setAppointments((prev) =>
      sortAppointments(prev.map((a) => (a.id === appointmentId ? { ...a, status: "cancelled" } : a)))
    );
  };

  const handleConfirmPostponeAppointment = (appointmentId: string) => {
    setAppointments((prev) =>
      sortAppointments(prev.map((a) => (a.id === appointmentId ? postponeMockAppointment(a) : a)))
    );
    setSuccessMessage("Sua consulta foi adiada com sucesso.");
  };

  const handleConfirmRescheduleAppointment = (appointmentId: string) => {
    setAppointments((prev) =>
      sortAppointments(prev.map((a) => (a.id === appointmentId ? rescheduleMockAppointment(a) : a)))
    );
    setSuccessMessage("Sua consulta foi remarcada com sucesso.");
  };

  const handleConfirmPendingAction = () => {
    if (!pendingAction) return;
    const { type, appointmentId } = pendingAction;
    if (type === "cancel") handleConfirmCancelAppointment(appointmentId);
    else if (type === "postpone") handleConfirmPostponeAppointment(appointmentId);
    else handleConfirmRescheduleAppointment(appointmentId);
    setPendingAction(null);
  };

  if (ctrl.isLoading) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        <TopBar title="HealthMind" onBackPress={() => router.back()} />
        <LoadingState message="Carregando consultas..." />
      </View>
    );
  }

  const pendingActivities = ctrl.activities.filter((a) => !a.completed).length;

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <TopBar title="HealthMind" onBackPress={() => router.back()} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        {/* Page header */}
        <View className="px-5 pt-2 pb-5 gap-1">
          <AppText variant="heading1" className="font-bold">
            Consultas
          </AppText>
          <AppText variant="body" color="muted">
            Gerencie seus compromissos e atividades diárias.
          </AppText>
        </View>

        {/* Next appointment */}
        {ctrl.upcoming && (
          <View className="mb-6">
            <NextAppointmentCard
              appointment={ctrl.upcoming}
              onReschedule={ctrl.rescheduleAppointment}
            />
          </View>
        )}

        {/* Calendar */}
        <View className="mb-6">
          <AppointmentsCalendar
            appointmentDates={ctrl.appointmentDates}
            selectedDate={ctrl.selectedDate}
            onSelectDate={ctrl.selectDate}
          />
        </View>

        {/* Appointments list */}
        {appointments.length > 0 && (
          <View className="mb-6 gap-3">
            <SectionHeader title="Suas Consultas" />
            {appointments.map((appt) => (
              <AppointmentListCard
                key={appt.id}
                appointment={appt}
                onCancel={handleRequestCancelAppointment}
                onPostpone={handleRequestPostponeAppointment}
                onReschedule={handleRequestRescheduleAppointment}
              />
            ))}
          </View>
        )}

        {/* Daily activities */}
        {ctrl.activities.length > 0 && (
          <View className="mb-6">
            <SectionHeader
              title="Atividades de Hoje"
              badge={pendingActivities > 0 ? `${pendingActivities} pendentes` : undefined}
            />
            <AppCard className="mx-5 py-1 px-5 divide-y divide-border dark:divide-border-dark">
              {ctrl.activities.map((act, i) => (
                <View key={act.id}>
                  {i > 0 && (
                    <View className="h-px bg-border dark:bg-border-dark" />
                  )}
                  <DailyActivityCard
                    activity={act}
                    onToggle={ctrl.toggleActivity}
                  />
                </View>
              ))}
            </AppCard>
          </View>
        )}

        {/* Reminders */}
        {ctrl.reminders.length > 0 && (
          <View className="mb-6 gap-3">
            <SectionHeader title="Lembretes" />
            <View className="px-5 gap-3">
              {ctrl.reminders.map((rem) => (
                <ReminderAlertCard key={rem.id} reminder={rem} />
              ))}
            </View>
          </View>
        )}

        {/* Find professional shortcut */}
        <FindProfessionalShortcutCard onPress={onNavigateToProfessionals} />
      </ScrollView>

      <SuccessModal
        visible={!!ctrl.feedback}
        type="info"
        title="HealthMind"
        message={ctrl.feedback ?? ""}
        actionLabel="Ok"
        onClose={ctrl.clearFeedback}
      />

      <SuccessModal
        visible={!!successMessage}
        type="success"
        title="Sucesso!"
        message={successMessage ?? ""}
        actionLabel="Ok"
        onClose={() => setSuccessMessage(null)}
      />

      <ConfirmActionModal
        visible={!!pendingAction}
        icon={pendingAction ? CONFIRM_PROMPTS[pendingAction.type].icon : "help-circle-outline"}
        iconColor={pendingAction?.type === "cancel" ? colors.error : colors.secondary}
        confirmColor={pendingAction?.type === "cancel" ? colors.error : undefined}
        title={pendingAction ? CONFIRM_PROMPTS[pendingAction.type].title : ""}
        description={pendingAction ? CONFIRM_PROMPTS[pendingAction.type].description : ""}
        confirmLabel={pendingAction ? CONFIRM_PROMPTS[pendingAction.type].confirmLabel : "Confirmar"}
        cancelLabel="Voltar"
        onConfirm={handleConfirmPendingAction}
        onCancel={() => setPendingAction(null)}
      />
    </View>
  );
}
