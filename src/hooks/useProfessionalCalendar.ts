import { useState, useEffect, useCallback } from "react";
import { professionalCalendarService } from "../services/professionalCalendarService";
import {
  ProfessionalAppointment,
  ProfessionalTask,
  ProfessionalReminder,
  CalendarDayData,
} from "../types/professionalCalendar";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

interface DaySummary {
  appointmentsCount: number;
  tasksCount: number;
  importantReminders: number;
  nextAppointment: ProfessionalAppointment | null;
}

interface UseProfessionalCalendarReturn {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  currentYear: number;
  currentMonth: number;
  setCurrentMonth: (year: number, month: number) => void;
  appointments: ProfessionalAppointment[];
  tasks: ProfessionalTask[];
  reminders: ProfessionalReminder[];
  nextAppointment: ProfessionalAppointment | null;
  calendarDots: CalendarDayData[];
  summary: DaySummary;
  isLoading: boolean;
  refresh: () => void;
  toggleTask: (id: string) => Promise<void>;
  toggleReminder: (id: string) => Promise<void>;
}

export function useProfessionalCalendar(): UseProfessionalCalendarReturn {
  const today = todayStr();
  const [selectedDate, setSelectedDateState] = useState(today);
  const [currentYear, setCurrentYear] = useState(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonthState] = useState(() => new Date().getMonth() + 1);

  const [appointments, setAppointments] = useState<ProfessionalAppointment[]>([]);
  const [tasks, setTasks] = useState<ProfessionalTask[]>([]);
  const [reminders, setReminders] = useState<ProfessionalReminder[]>([]);
  const [nextAppointment, setNextAppointment] = useState<ProfessionalAppointment | null>(null);
  const [calendarDots, setCalendarDots] = useState<CalendarDayData[]>([]);
  const [summary, setSummary] = useState<DaySummary>({
    appointmentsCount: 0,
    tasksCount: 0,
    importantReminders: 0,
    nextAppointment: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const setSelectedDate = useCallback((date: string) => {
    setSelectedDateState(date);
    const d = new Date(date + "T00:00:00");
    setCurrentYear(d.getFullYear());
    setCurrentMonthState(d.getMonth() + 1);
  }, []);

  const setCurrentMonth = useCallback((year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonthState(month);
  }, []);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  // Load all data for the selected date
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    Promise.all([
      professionalCalendarService.getAppointmentsForDate(selectedDate),
      professionalCalendarService.getTasksForDate(selectedDate),
      professionalCalendarService.getRemindersForDate(selectedDate),
      professionalCalendarService.getNextAppointment(),
      professionalCalendarService.getDaySummary(selectedDate),
    ])
      .then(([appts, tks, rems, next, sum]) => {
        if (cancelled) return;
        setAppointments(appts);
        setTasks(tks);
        setReminders(rems);
        setNextAppointment(next);
        setSummary(sum);
        setIsLoading(false);
      })
      .catch(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDate, refreshKey]);

  // Load calendar dots when month changes
  useEffect(() => {
    let cancelled = false;
    professionalCalendarService
      .getCalendarDots(currentYear, currentMonth)
      .then((dots) => {
        if (!cancelled) setCalendarDots(dots);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [currentYear, currentMonth, refreshKey]);

  const toggleTask = useCallback(async (id: string) => {
    const updated = await professionalCalendarService.toggleTask(id);
    setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }, []);

  const toggleReminder = useCallback(async (id: string) => {
    const updated = await professionalCalendarService.toggleReminder(id);
    setReminders((prev) => prev.map((r) => (r.id === id ? updated : r)));
  }, []);

  return {
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
  };
}
