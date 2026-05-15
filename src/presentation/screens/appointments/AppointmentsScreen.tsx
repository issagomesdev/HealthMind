import React, { useEffect } from "react";
import { View, ScrollView, Alert } from "react-native";
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
import { useTheme } from "../../../core/theme";

interface AppointmentsScreenProps {
  onNavigateToProfessionals: () => void;
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

  useFocusEffect(
    React.useCallback(() => {
      ctrl.loadAll();
    }, [])
  );

  useEffect(() => {
    if (ctrl.feedback) {
      Alert.alert("HealthMind", ctrl.feedback, [
        { text: "OK", onPress: ctrl.clearFeedback },
      ]);
    }
  }, [ctrl.feedback]);

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

        {/* Day appointments */}
        {ctrl.dayAppointments.length > 0 && (
          <View className="mb-6 gap-3">
            <SectionHeader title="Consultas do Dia" />
            {ctrl.dayAppointments.map((appt) => (
              <AppointmentListCard
                key={appt.id}
                appointment={appt}
                onCancel={ctrl.cancelAppointment}
                onReschedule={ctrl.rescheduleAppointment}
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
    </View>
  );
}
