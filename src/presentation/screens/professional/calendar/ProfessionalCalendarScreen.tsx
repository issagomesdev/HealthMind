import React, { useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "../../../components/ui/AppText";
import { EmptyState } from "../../../components/ui/EmptyState";
import { LoadingState } from "../../../components/ui/LoadingState";
import { TopBar } from "../../../components/navigation/TopBar";
import { useTheme } from "../../../../core/theme";
import { useNavigationContext } from "../../../context/NavigationContext";
import { useProfessionalCalendar } from "../../../../hooks/useProfessionalCalendar";
import { CalendarMonthView } from "../../../components/professional/calendar/CalendarMonthView";
import { DaySummaryRow } from "../../../components/professional/calendar/DaySummaryRow";
import { NextAppointmentCard } from "../../../components/professional/calendar/NextAppointmentCard";
import { AppointmentListCard } from "../../../components/professional/calendar/AppointmentListCard";
import { ProfessionalTaskCard } from "../../../components/professional/calendar/ProfessionalTaskCard";
import { ProfessionalReminderCard } from "../../../components/professional/calendar/ProfessionalReminderCard";
import { CalendarSectionHeader } from "../../../components/professional/calendar/CalendarSectionHeader";

const PT_MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function formatSelectedDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().slice(0, 10);

  if (dateStr === todayStr) return "Hoje";
  if (dateStr === tomorrowStr) return "Amanhã";

  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

export function ProfessionalCalendarScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { openMenu } = useNavigationContext();

  const {
    selectedDate,
    setSelectedDate,
    currentYear,
    currentMonth,
    setCurrentMonth,
    appointments,
    tasks,
    reminders,
    nextAppointment,
    calendarDots,
    summary,
    isLoading,
    refresh,
    toggleTask,
    toggleReminder,
  } = useProfessionalCalendar();

  const handlePrevMonth = useCallback(() => {
    if (currentMonth === 1) {
      setCurrentMonth(currentYear - 1, 12);
    } else {
      setCurrentMonth(currentYear, currentMonth - 1);
    }
  }, [currentYear, currentMonth, setCurrentMonth]);

  const handleNextMonth = useCallback(() => {
    if (currentMonth === 12) {
      setCurrentMonth(currentYear + 1, 1);
    } else {
      setCurrentMonth(currentYear, currentMonth + 1);
    }
  }, [currentYear, currentMonth, setCurrentMonth]);

  const handleNewAppointment = () => {
    router.push("/create-appointment");
  };

  if (isLoading) {
    return <LoadingState message="Carregando agenda..." />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar
        title="HealthMind"
        onBackPress={() => router.back()}
        showNotifications={false}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={refresh}
            tintColor={colors.secondary}
          />
        }
      >
        {/* Screen header */}
        <View
          style={{
            paddingTop: 8,
            paddingHorizontal: 20,
            paddingBottom: 4,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <AppText
              style={{ fontSize: 26, fontWeight: "800", color: colors.content, lineHeight: 32 }}
            >
              Agenda
            </AppText>
            <AppText style={{ fontSize: 13, color: colors.subtle, marginTop: 2 }}>
              {PT_MONTHS[currentMonth - 1]} {currentYear}
            </AppText>
          </View>
          <TouchableOpacity
            onPress={handleNewAppointment}
            activeOpacity={0.8}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: colors.secondary,
              borderRadius: 99,
              paddingHorizontal: 14,
              paddingVertical: 10,
            }}
          >
            <Ionicons name="add" size={18} color="#fff" />
            <AppText style={{ fontSize: 13, fontWeight: "700", color: "#fff" }}>
              Nova consulta
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Calendar grid */}
        <View
          style={{
            backgroundColor: colors.surface,
            marginHorizontal: 16,
            marginTop: 12,
            borderRadius: 20,
            padding: 16,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 10,
            elevation: 3,
          }}
        >
          <CalendarMonthView
            year={currentYear}
            month={currentMonth}
            selectedDate={selectedDate}
            onDayPress={setSelectedDate}
            calendarDots={calendarDots}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />
        </View>

        {/* Day summary */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <AppText
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: colors.content,
              marginBottom: 10,
            }}
          >
            {formatSelectedDate(selectedDate)}
          </AppText>
          <DaySummaryRow
            appointmentsCount={summary.appointmentsCount}
            tasksCount={summary.tasksCount}
            importantReminders={summary.importantReminders}
          />
        </View>

        {/* Next appointment card */}
        <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
          <CalendarSectionHeader title="Próxima consulta" />
          <NextAppointmentCard appointment={nextAppointment} />
        </View>

        {/* Appointments for selected date */}
        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          <CalendarSectionHeader
            title={`Consultas — ${formatSelectedDate(selectedDate)}`}
            right={
              appointments.length > 0 ? (
                <AppText style={{ fontSize: 13, color: colors.subtle }}>
                  {appointments.length} consulta{appointments.length !== 1 ? "s" : ""}
                </AppText>
              ) : undefined
            }
          />

          {appointments.length === 0 ? (
            <EmptyState
              icon="calendar-outline"
              title="Nenhuma consulta"
              description="Não há consultas agendadas para este dia."
              actionLabel="Agendar consulta"
              onAction={handleNewAppointment}
            />
          ) : (
            appointments.map((apt) => (
              <AppointmentListCard key={apt.id} appointment={apt} />
            ))
          )}
        </View>

        {/* Tasks for the day */}
        {tasks.length > 0 && (
          <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
            <CalendarSectionHeader
              title="Atividades de hoje"
              right={
                <AppText style={{ fontSize: 13, color: colors.subtle }}>
                  {tasks.filter((t) => t.completed).length}/{tasks.length} concluídas
                </AppText>
              }
            />
            {tasks.map((task) => (
              <ProfessionalTaskCard
                key={task.id}
                task={task}
                onToggle={() => toggleTask(task.id)}
              />
            ))}
          </View>
        )}

        {/* Reminders for the day */}
        {reminders.length > 0 && (
          <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
            <CalendarSectionHeader
              title="Lembretes"
              right={
                <AppText style={{ fontSize: 13, color: colors.subtle }}>
                  {reminders.filter((r) => !r.completed).length} pendente
                  {reminders.filter((r) => !r.completed).length !== 1 ? "s" : ""}
                </AppText>
              }
            />
            {reminders.map((rem) => (
              <ProfessionalReminderCard
                key={rem.id}
                reminder={rem}
                onToggle={() => toggleReminder(rem.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
