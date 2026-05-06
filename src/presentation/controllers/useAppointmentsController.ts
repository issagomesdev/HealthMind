import { useState, useCallback } from "react";
import { UserAppointment, CalendarAppointmentDate, Reminder, DailyActivity } from "../../core/types";
import { appointmentsModuleService } from "../../services/appointments/AppointmentsModuleService";

function todayString() {
  return new Date().toISOString().split("T")[0];
}

export interface AppointmentsController {
  isLoading: boolean;
  upcoming: UserAppointment | null;
  selectedDate: string;
  appointmentDates: CalendarAppointmentDate[];
  dayAppointments: UserAppointment[];
  activities: DailyActivity[];
  reminders: Reminder[];
  feedback: string | null;
  loadAll: () => Promise<void>;
  selectDate: (date: string) => Promise<void>;
  cancelAppointment: (id: string) => Promise<void>;
  rescheduleAppointment: (id: string) => Promise<void>;
  toggleActivity: (id: string) => Promise<void>;
  clearFeedback: () => void;
}

export function useAppointmentsController(): AppointmentsController {
  const today = todayString();
  const [isLoading, setIsLoading] = useState(true);
  const [upcoming, setUpcoming] = useState<UserAppointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [appointmentDates, setAppointmentDates] = useState<CalendarAppointmentDate[]>([]);
  const [dayAppointments, setDayAppointments] = useState<UserAppointment[]>([]);
  const [activities, setActivities] = useState<DailyActivity[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [upcomingRes, datesRes, dayRes, actsRes, remsRes] = await Promise.all([
        appointmentsModuleService.getUpcomingAppointment(),
        appointmentsModuleService.getCalendarAppointments(),
        appointmentsModuleService.getAppointmentsByDate(today),
        appointmentsModuleService.getDailyActivities(),
        appointmentsModuleService.getReminders(),
      ]);
      setUpcoming(upcomingRes);
      setAppointmentDates(datesRes);
      setDayAppointments(dayRes);
      setActivities(actsRes);
      setReminders(remsRes);
    } finally {
      setIsLoading(false);
    }
  }, [today]);

  const selectDate = useCallback(async (date: string) => {
    setSelectedDate(date);
    const results = await appointmentsModuleService.getAppointmentsByDate(date);
    setDayAppointments(results);
  }, []);

  const cancelAppointment = useCallback(async (id: string) => {
    await appointmentsModuleService.cancelAppointment(id);
    setDayAppointments((prev) => prev.filter((a) => a.id !== id));
    setUpcoming((prev) => (prev?.id === id ? null : prev));
    showFeedback("Consulta cancelada com sucesso.");
  }, []);

  const rescheduleAppointment = useCallback(async (id: string) => {
    await appointmentsModuleService.rescheduleAppointment(id);
    showFeedback("Solicitação de reagendamento enviada.");
  }, []);

  const toggleActivity = useCallback(async (id: string) => {
    const updated = await appointmentsModuleService.toggleActivity(id);
    setActivities(updated);
  }, []);

  const clearFeedback = useCallback(() => setFeedback(null), []);

  return {
    isLoading,
    upcoming,
    selectedDate,
    appointmentDates,
    dayAppointments,
    activities,
    reminders,
    feedback,
    loadAll,
    selectDate,
    cancelAppointment,
    rescheduleAppointment,
    toggleActivity,
    clearFeedback,
  };
}
