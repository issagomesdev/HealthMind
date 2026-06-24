import data from "../../data/fake/user_appointments.json";
import { getMockAppointmentsForDate } from "../../data/fake/mockUserAppointments";
import {
  UserAppointment,
  CalendarAppointmentDate,
  Reminder,
  DailyActivity,
} from "../../core/types";

// Simulated network delay
const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

// In-memory mutable state (simulates DB)
let appointments: UserAppointment[] = data.appointments as UserAppointment[];
let activities: DailyActivity[] = data.dailyActivities as DailyActivity[];
const reminders: Reminder[] = data.reminders as Reminder[];

class AppointmentsModuleService {
  // GET /appointments/upcoming
  async getUpcomingAppointment(): Promise<UserAppointment | null> {
    await delay();
    const today = new Date().toISOString().split("T")[0];
    const scheduled = appointments
      .filter((a) => a.status === "scheduled" && a.date >= today)
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
      });
    return scheduled[0] ?? null;
  }

  // GET /appointments/date/:date
  async getAppointmentsByDate(date: string): Promise<UserAppointment[]> {
    await delay(200);
    return getMockAppointmentsForDate(date);
  }

  // GET /appointments/calendar
  async getCalendarAppointments(): Promise<CalendarAppointmentDate[]> {
    await delay(200);
    const dateMap = new Map<string, boolean>();
    appointments
      .filter((a) => a.status === "scheduled")
      .forEach((a) => dateMap.set(a.date, true));
    return Array.from(dateMap.entries()).map(([date]) => ({
      date,
      hasAppointments: true,
    }));
  }

  // POST /appointments/:id/cancel
  async cancelAppointment(id: string): Promise<void> {
    await delay(400);
    appointments = appointments.map((a) =>
      a.id === id ? { ...a, status: "cancelled" } : a
    );
  }

  // POST /appointments/:id/reschedule
  async rescheduleAppointment(id: string): Promise<void> {
    await delay(400);
    // In real implementation: open rescheduling flow
    // Here we just simulate the request being sent
    void id;
  }

  // GET /activities/daily
  async getDailyActivities(): Promise<DailyActivity[]> {
    await delay(200);
    return [...activities];
  }

  // PATCH /activities/:id/toggle
  async toggleActivity(id: string): Promise<DailyActivity[]> {
    await delay(150);
    activities = activities.map((a) =>
      a.id === id ? { ...a, completed: !a.completed } : a
    );
    return [...activities];
  }

  // GET /reminders
  async getReminders(): Promise<Reminder[]> {
    await delay(200);
    return [...reminders];
  }
}

export const appointmentsModuleService = new AppointmentsModuleService();
