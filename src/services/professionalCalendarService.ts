import tasksData from "../data/fake/professionalTasks.json";
import remindersData from "../data/fake/professionalReminders.json";
import {
  ProfessionalAppointment,
  ProfessionalTask,
  ProfessionalReminder,
  CalendarDayData,
  AppointmentStatus,
} from "../types/professionalCalendar";
import {
  generateMockProfessionalAppointments,
  getAppointmentsForDate as getMockAppointmentsForDate,
  getAllGeneratedAppointments,
  findAppointmentById,
  updateAppointmentInCache,
  addAppointmentToCache,
  postponeAppointmentInCache,
  rescheduleAppointmentInCache,
} from "../data/fake/mockProfessionalAppointments";
import { getTodayDateString } from "../utils/date";

const delay = (ms = 300) => new Promise<void>((r) => setTimeout(r, ms));

let tasks: ProfessionalTask[] = tasksData.tasks as ProfessionalTask[];
let reminders: ProfessionalReminder[] = remindersData.reminders as ProfessionalReminder[];

function nowStr(): string {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

// Active appointments first (by time), cancelled ones always last.
function sortForDayList(appointments: ProfessionalAppointment[]): ProfessionalAppointment[] {
  return [...appointments].sort((a, b) => {
    if (a.status === "cancelled" && b.status !== "cancelled") return 1;
    if (a.status !== "cancelled" && b.status === "cancelled") return -1;
    return a.time.localeCompare(b.time);
  });
}

class ProfessionalCalendarService {
  // ─── Appointments ──────────────────────────────────────────────────────────

  async getAppointmentsForDate(date: string): Promise<ProfessionalAppointment[]> {
    await delay();
    return sortForDayList(getMockAppointmentsForDate(date));
  }

  async getNextAppointment(): Promise<ProfessionalAppointment | null> {
    await delay(150);
    const today = getTodayDateString();
    const now = nowStr();

    const upcoming = getAllGeneratedAppointments()
      .filter((a) => {
        if (a.status === "cancelled" || a.status === "completed") return false;
        if (a.date > today) return true;
        if (a.date === today && a.time >= now) return true;
        return false;
      })
      .sort((a, b) => {
        const da = `${a.date}T${a.time}`;
        const db = `${b.date}T${b.time}`;
        return da.localeCompare(db);
      });

    return upcoming[0] ?? null;
  }

  async getCalendarDots(year: number, month: number): Promise<CalendarDayData[]> {
    await delay(200);
    const prefix = `${year}-${String(month).padStart(2, "0")}`;
    const monthAppointments = generateMockProfessionalAppointments(year, month);

    const daysMap = new Map<string, CalendarDayData>();

    monthAppointments.forEach((a) => {
      const existing = daysMap.get(a.date) ?? {
        date: a.date,
        hasAppointment: false,
        hasReminder: false,
        hasTask: false,
      };
      existing.hasAppointment = true;
      daysMap.set(a.date, existing);
    });

    reminders.forEach((r) => {
      if (!r.date.startsWith(prefix)) return;
      const existing = daysMap.get(r.date) ?? {
        date: r.date,
        hasAppointment: false,
        hasReminder: false,
        hasTask: false,
      };
      existing.hasReminder = true;
      daysMap.set(r.date, existing);
    });

    tasks.forEach((t) => {
      if (!t.date.startsWith(prefix)) return;
      const existing = daysMap.get(t.date) ?? {
        date: t.date,
        hasAppointment: false,
        hasReminder: false,
        hasTask: false,
      };
      existing.hasTask = true;
      daysMap.set(t.date, existing);
    });

    return Array.from(daysMap.values());
  }

  async createAppointment(
    data: Omit<ProfessionalAppointment, "id">
  ): Promise<ProfessionalAppointment> {
    await delay(500);
    const newItem: ProfessionalAppointment = {
      ...data,
      id: `cal-a${Date.now()}`,
    };
    addAppointmentToCache(newItem);
    return newItem;
  }

  async updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<void> {
    await delay(300);
    updateAppointmentInCache(id, (a) => ({
      ...a,
      status,
      statusLabel: statusLabelMap[status],
    }));
  }

  async cancelAppointment(id: string): Promise<void> {
    await this.updateAppointmentStatus(id, "cancelled");
  }

  async postponeAppointment(id: string): Promise<ProfessionalAppointment | null> {
    await delay(400);
    return postponeAppointmentInCache(id);
  }

  async rescheduleAppointment(id: string): Promise<ProfessionalAppointment | null> {
    await delay(400);
    return rescheduleAppointmentInCache(id);
  }

  async getAppointmentById(id: string): Promise<ProfessionalAppointment | null> {
    await delay(150);
    return findAppointmentById(id);
  }

  // ─── Tasks ─────────────────────────────────────────────────────────────────

  async getTasksForDate(date: string): Promise<ProfessionalTask[]> {
    await delay(200);
    return tasks.filter((t) => t.date === date);
  }

  async toggleTask(id: string): Promise<ProfessionalTask> {
    await delay(150);
    let found: ProfessionalTask | null = null;
    tasks = tasks.map((t) => {
      if (t.id === id) {
        found = { ...t, completed: !t.completed };
        return found;
      }
      return t;
    });
    if (!found) throw new Error(`Task ${id} not found`);
    return found;
  }

  // ─── Reminders ─────────────────────────────────────────────────────────────

  async getRemindersForDate(date: string): Promise<ProfessionalReminder[]> {
    await delay(200);
    return reminders
      .filter((r) => r.date === date)
      .sort((a, b) => {
        const pa = priorityOrder[a.priority];
        const pb = priorityOrder[b.priority];
        if (pa !== pb) return pa - pb;
        const ta = a.time ?? "99:99";
        const tb = b.time ?? "99:99";
        return ta.localeCompare(tb);
      });
  }

  async toggleReminder(id: string): Promise<ProfessionalReminder> {
    await delay(150);
    let found: ProfessionalReminder | null = null;
    reminders = reminders.map((r) => {
      if (r.id === id) {
        found = { ...r, completed: !r.completed };
        return found;
      }
      return r;
    });
    if (!found) throw new Error(`Reminder ${id} not found`);
    return found;
  }

  // ─── Day Summary ───────────────────────────────────────────────────────────

  async getDaySummary(date: string): Promise<{
    appointmentsCount: number;
    tasksCount: number;
    importantReminders: number;
    nextAppointment: ProfessionalAppointment | null;
  }> {
    await delay(200);
    const dayAppointments = getMockAppointmentsForDate(date).filter(
      (a) => a.status !== "cancelled"
    );
    const dayTasks = tasks.filter((t) => t.date === date && !t.completed);
    const dayReminders = reminders.filter(
      (r) => r.date === date && r.priority === "high" && !r.completed
    );
    const next = await this.getNextAppointment();

    return {
      appointmentsCount: dayAppointments.length,
      tasksCount: dayTasks.length,
      importantReminders: dayReminders.length,
      nextAppointment: next,
    };
  }
}

const statusLabelMap: Record<AppointmentStatus, string> = {
  scheduled: "Agendada",
  in_progress: "Em andamento",
  completed: "Concluída",
  cancelled: "Cancelada",
  missed: "Não compareceu",
};

const priorityOrder: Record<string, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export const professionalCalendarService = new ProfessionalCalendarService();
