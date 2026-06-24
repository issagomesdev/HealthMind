import {
  ProfessionalAppointment,
  AppointmentType,
  AppointmentFormat,
  ReminderBefore,
} from "../../types/professionalCalendar";
import { getTodayDateString, toDateString } from "../../utils/date";

export const POSSIBLE_TIMES = [
  "08:00", "09:00", "10:00", "10:30", "14:00", "15:30", "16:30", "18:00",
];

export const MOCK_PATIENTS: Array<
  Pick<ProfessionalAppointment, "patientId" | "patientName" | "patientAvatarUrl" | "patientRiskLevel">
> = [
  { patientId: "p1", patientName: "Mariana Souza", patientAvatarUrl: null, patientRiskLevel: "stable" },
  { patientId: "p2", patientName: "Rafael Lima", patientAvatarUrl: null, patientRiskLevel: "attention" },
  { patientId: "p3", patientName: "Camila Rocha", patientAvatarUrl: null, patientRiskLevel: "critical" },
  { patientId: "p4", patientName: "Lucas Almeida", patientAvatarUrl: null, patientRiskLevel: "stable" },
  { patientId: "p5", patientName: "Beatriz Martins", patientAvatarUrl: null, patientRiskLevel: "attention" },
  { patientId: "p6", patientName: "Paulo Ferreira", patientAvatarUrl: null, patientRiskLevel: "high_risk" },
];

const APPOINTMENT_TYPES: Array<{ type: AppointmentType; typeLabel: string }> = [
  { type: "initial_assessment", typeLabel: "Primeira consulta" },
  { type: "follow_up", typeLabel: "Acompanhamento" },
  { type: "return", typeLabel: "Retorno" },
  { type: "review", typeLabel: "Avaliação" },
];

const APPOINTMENT_FORMATS: Array<{
  format: AppointmentFormat;
  formatLabel: string;
  callLink: string | null;
  address: string | null;
}> = [
  { format: "online", formatLabel: "Online", callLink: "https://meet.google.com/abc-defg-hij", address: null },
  { format: "in_person", formatLabel: "Presencial", callLink: null, address: "Clínica HealthMind, Sala 204" },
];

const REMINDER_OPTIONS: ReminderBefore[] = ["10min", "30min", "1hour", "1day"];

const MIN_DAYS_WITH_APPOINTMENTS = 6;
const MAX_DAYS_WITH_APPOINTMENTS = 14;
const MIN_PER_DAY = 1;
const MAX_PER_DAY = 4;
const POSTPONE_WINDOW_DAYS = 14;

// Cached per "year-month" key (month is 1-12, matching this screen's existing
// convention) so the calendar dots and the day list stay consistent across
// navigation instead of re-rolling random data on every call.
const appointmentsCache = new Map<string, ProfessionalAppointment[]>();

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(items: T[]): T {
  return items[randomInt(0, items.length - 1)];
}

function pickRandomUnique<T>(items: T[], count: number): T[] {
  const pool = [...items];
  const picked: T[] = [];
  const total = Math.min(count, pool.length);
  for (let i = 0; i < total; i++) {
    const index = randomInt(0, pool.length - 1);
    picked.push(pool.splice(index, 1)[0]);
  }
  return picked;
}

function getMonthCacheKey(year: number, month: number): string {
  return `${year}-${month}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function buildAppointment(
  date: string,
  time: string,
  patient: (typeof MOCK_PATIENTS)[number],
  seq: number
): ProfessionalAppointment {
  const { type, typeLabel } = randomItem(APPOINTMENT_TYPES);
  const { format, formatLabel, callLink, address } = randomItem(APPOINTMENT_FORMATS);
  const isPastAppointment = date < getTodayDateString();
  const status = isPastAppointment ? "completed" : "scheduled";
  const statusLabel = isPastAppointment ? "Concluída" : "Agendada";

  return {
    id: `cal_${date}_${String(seq).padStart(2, "0")}`,
    patientId: patient.patientId,
    patientName: patient.patientName,
    patientAvatarUrl: patient.patientAvatarUrl,
    patientRiskLevel: patient.patientRiskLevel,
    date,
    time,
    durationMinutes: 50,
    type,
    typeLabel,
    format,
    formatLabel,
    status,
    statusLabel,
    subject: `${typeLabel} — ${patient.patientName}`,
    description: `Sessão de ${typeLabel.toLowerCase()} com ${patient.patientName}.`,
    callLink,
    address,
    value: randomInt(150, 250),
    reminderBefore: randomItem(REMINDER_OPTIONS),
    internalNotes: "",
    recurrence: "none",
    notifyPatient: true,
  };
}

function sortByDateTime(appointments: ProfessionalAppointment[]): ProfessionalAppointment[] {
  return [...appointments].sort((a, b) =>
    a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)
  );
}

/**
 * Generates mocked professional appointments for a given month (month is
 * 1-12). Results are cached per year/month so revisiting a month keeps the
 * same generated appointments instead of re-rolling them on every call.
 */
export function generateMockProfessionalAppointments(
  year: number,
  month: number
): ProfessionalAppointment[] {
  const cacheKey = getMonthCacheKey(year, month);
  const cached = appointmentsCache.get(cacheKey);
  if (cached) return cached;

  const totalDays = daysInMonth(year, month);
  const daysWithAppointments = Math.min(
    randomInt(MIN_DAYS_WITH_APPOINTMENTS, MAX_DAYS_WITH_APPOINTMENTS),
    totalDays
  );
  const chosenDays = pickRandomUnique(
    Array.from({ length: totalDays }, (_, i) => i + 1),
    daysWithAppointments
  );

  const appointments: ProfessionalAppointment[] = [];
  chosenDays.forEach((day) => {
    const date = formatDate(year, month, day);
    const countForDay = randomInt(MIN_PER_DAY, MAX_PER_DAY);
    const times = pickRandomUnique(POSSIBLE_TIMES, countForDay).sort();
    const patients = pickRandomUnique(MOCK_PATIENTS, times.length);
    times.forEach((time, idx) => {
      appointments.push(buildAppointment(date, time, patients[idx], idx + 1));
    });
  });

  const sorted = sortByDateTime(appointments);
  appointmentsCache.set(cacheKey, sorted);
  return sorted;
}

/** Looks up the mocked appointments for a specific "YYYY-MM-DD" date, sorted by time. */
export function getAppointmentsForDate(date: string): ProfessionalAppointment[] {
  const [year, month] = date.split("-").map(Number);
  const monthAppointments = generateMockProfessionalAppointments(year, month);
  return monthAppointments.filter((a) => a.date === date);
}

/** Ensures the current and next month are generated, so "next appointment" lookups have data. */
function ensureAppointmentsAroundToday(): void {
  const now = new Date();
  generateMockProfessionalAppointments(now.getFullYear(), now.getMonth() + 1);
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  generateMockProfessionalAppointments(next.getFullYear(), next.getMonth() + 1);
}

/** Flattens every appointment generated so far across all cached months. */
export function getAllGeneratedAppointments(): ProfessionalAppointment[] {
  ensureAppointmentsAroundToday();
  return Array.from(appointmentsCache.values()).flat();
}

/** Finds a single mocked appointment by id, across whichever month it was generated in. */
export function findAppointmentById(id: string): ProfessionalAppointment | null {
  for (const monthAppointments of appointmentsCache.values()) {
    const found = monthAppointments.find((a) => a.id === id);
    if (found) return found;
  }
  return null;
}

/** Replaces an appointment in its month's cache, returning the updated record. */
export function updateAppointmentInCache(
  id: string,
  updater: (appointment: ProfessionalAppointment) => ProfessionalAppointment
): ProfessionalAppointment | null {
  for (const [cacheKey, monthAppointments] of appointmentsCache.entries()) {
    const index = monthAppointments.findIndex((a) => a.id === id);
    if (index === -1) continue;
    const updated = updater(monthAppointments[index]);
    const next = [...monthAppointments];
    next[index] = updated;
    appointmentsCache.set(cacheKey, next);
    return updated;
  }
  return null;
}

/** Adds a newly created appointment into its month's cache. */
export function addAppointmentToCache(appointment: ProfessionalAppointment): void {
  const [year, month] = appointment.date.split("-").map(Number);
  const cacheKey = getMonthCacheKey(year, month);
  const existing = appointmentsCache.get(cacheKey) ?? generateMockProfessionalAppointments(year, month);
  appointmentsCache.set(cacheKey, sortByDateTime([...existing, appointment]));
}

function addDays(base: Date, days: number): string {
  const result = new Date(base);
  result.setDate(result.getDate() + days);
  return toDateString(result);
}

function pickNearbyUpcomingSlot(): { date: string; time: string } {
  return {
    date: addDays(new Date(), randomInt(1, POSTPONE_WINDOW_DAYS)),
    time: randomItem(POSSIBLE_TIMES),
  };
}

function buildPostponedAppointment(appointment: ProfessionalAppointment): ProfessionalAppointment {
  const laterTimes = POSSIBLE_TIMES.filter((t) => t > appointment.time);
  const nextSlot =
    laterTimes.length > 0
      ? { date: appointment.date, time: randomItem(laterTimes) }
      : pickNearbyUpcomingSlot();

  return {
    ...appointment,
    ...nextSlot,
    status: "scheduled",
    statusLabel: "Agendada",
  };
}

/** Moves a cached appointment to a different month bucket if its date requires it. */
function relocateAppointmentInCache(
  cacheKey: string,
  monthAppointments: ProfessionalAppointment[],
  updated: ProfessionalAppointment
): ProfessionalAppointment {
  appointmentsCache.set(cacheKey, monthAppointments.filter((a) => a.id !== updated.id));
  addAppointmentToCache(updated);
  return updated;
}

/**
 * Postpones a mocked appointment: tries a later time slot on the same day
 * first, otherwise moves it to a nearby upcoming date. Moves the record
 * between month buckets when the new date falls in a different month.
 */
export function postponeAppointmentInCache(id: string): ProfessionalAppointment | null {
  for (const [cacheKey, monthAppointments] of appointmentsCache.entries()) {
    const index = monthAppointments.findIndex((a) => a.id === id);
    if (index === -1) continue;
    const postponed = buildPostponedAppointment(monthAppointments[index]);
    return relocateAppointmentInCache(cacheKey, monthAppointments, postponed);
  }
  return null;
}

/**
 * Reschedules a cancelled mocked appointment: assigns a fresh nearby upcoming
 * slot and restores it to "scheduled". Moves the record between month
 * buckets when the new date falls in a different month.
 */
export function rescheduleAppointmentInCache(id: string): ProfessionalAppointment | null {
  for (const [cacheKey, monthAppointments] of appointmentsCache.entries()) {
    const index = monthAppointments.findIndex((a) => a.id === id);
    if (index === -1) continue;
    const { date, time } = pickNearbyUpcomingSlot();
    const rescheduled: ProfessionalAppointment = {
      ...monthAppointments[index],
      date,
      time,
      status: "scheduled",
      statusLabel: "Agendada",
    };
    return relocateAppointmentInCache(cacheKey, monthAppointments, rescheduled);
  }
  return null;
}
