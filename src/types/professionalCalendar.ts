export type CalEventType = "appointment" | "reminder" | "task";
export type AppointmentStatus = "scheduled" | "in_progress" | "completed" | "cancelled" | "missed";
export type AppointmentFormat = "online" | "in_person" | "hybrid";
export type AppointmentType = "initial_assessment" | "follow_up" | "return" | "emergency" | "review";
export type ReminderPriority = "low" | "medium" | "high";
export type ReminderCategory = "patient" | "study" | "financial" | "schedule" | "administrative";
export type TaskCategory = "wellness" | "organization" | "study";
export type RecurrenceType = "none" | "weekly" | "biweekly" | "monthly";
export type ReminderBefore = "10min" | "30min" | "1hour" | "1day";

export interface ProfessionalAppointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatarUrl: string | null;
  patientRiskLevel: "stable" | "attention" | "high_risk" | "critical";
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMinutes: number;
  type: AppointmentType;
  typeLabel: string;
  format: AppointmentFormat;
  formatLabel: string;
  status: AppointmentStatus;
  statusLabel: string;
  subject: string;
  description: string;
  callLink: string | null;
  address: string | null;
  value: number | null;
  reminderBefore: ReminderBefore;
  internalNotes: string;
  recurrence: RecurrenceType;
  notifyPatient: boolean;
}

export interface ProfessionalTask {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  category: TaskCategory;
  icon: string;
  completed: boolean;
  date: string; // YYYY-MM-DD
}

export interface ProfessionalReminder {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  time: string | null; // HH:mm or null
  priority: ReminderPriority;
  category: ReminderCategory;
  patientId: string | null;
  patientName: string | null;
  completed: boolean;
}

export interface CalendarDayData {
  date: string; // YYYY-MM-DD
  hasAppointment: boolean;
  hasReminder: boolean;
  hasTask: boolean;
}
