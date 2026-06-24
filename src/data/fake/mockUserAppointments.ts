import { UserAppointment } from "../../core/types";

export const POSSIBLE_TIMES = ["09:00", "10:00", "10:30", "14:30", "16:30", "18:00"];

export const MOCK_PROFESSIONALS = [
  { professionalName: "Dra. Ana Silva", specialty: "Terapia Cognitivo-Comportamental" },
  { professionalName: "Dr. Carlos Mendes", specialty: "Psicologia Clínica" },
  { professionalName: "Dra. Fernanda Costa", specialty: "Psiquiatria" },
  { professionalName: "Dr. Rafael Almeida", specialty: "Psicoterapia" },
  { professionalName: "Dra. Juliana Rocha", specialty: "Terapia Familiar" },
  { professionalName: "Dr. Henrique Lima", specialty: "Psicanálise" },
  { professionalName: "Dra. Camila Torres", specialty: "Neuropsicologia" },
  { professionalName: "Dr. Lucas Ferreira", specialty: "Terapia de Casal" },
  { professionalName: "Dra. Mariana Oliveira", specialty: "Psicologia Infantil" },
  { professionalName: "Dr. Gustavo Martins", specialty: "Psiquiatria Infantil" },
  { professionalName: "Dra. Beatriz Santos", specialty: "Terapia Humanista" },
  { professionalName: "Dr. Felipe Barbosa", specialty: "Psicologia Clínica" },
  { professionalName: "Dra. Larissa Gomes", specialty: "Terapia Cognitivo-Comportamental" },
  { professionalName: "Dr. André Ribeiro", specialty: "Dependência Química" },
  { professionalName: "Dra. Patrícia Nunes", specialty: "Transtornos de Ansiedade" },
  { professionalName: "Dr. Eduardo Carvalho", specialty: "Terapia Comportamental" },
  { professionalName: "Dra. Renata Azevedo", specialty: "Psicologia Organizacional" },
  { professionalName: "Dr. Marcelo Vieira", specialty: "Mindfulness e Saúde Mental" },
  { professionalName: "Dra. Isabela Moreira", specialty: "Transtornos Alimentares" },
  { professionalName: "Dr. Thiago Castro", specialty: "Avaliação Psicológica" },
];


export const APPOINTMENT_TYPES = ["Online", "Presencial"];

const MIN_APPOINTMENTS = 3;
const MAX_APPOINTMENTS = 8;
const MAX_PICK_ATTEMPTS = 10;

const MIN_RANDOM_APPOINTMENTS = 1;
const MAX_RANDOM_APPOINTMENTS = 4;
const RANDOM_WINDOW_DAYS = 21;
const MAX_PROFESSIONAL_REPEATS = 2;

// Cached per "year-month" key so the calendar dots and the day list for a
// selected date always agree, instead of re-rolling random data on every call.
const appointmentsCache = new Map<string, UserAppointment[]>();

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(items: T[]): T {
  return items[randomInt(0, items.length - 1)];
}

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function todayYMD(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Generates mocked user appointments for a given month (month is 0-indexed,
 * January = 0, matching JS Date conventions and the calendar's view state).
 */
export function generateMockUserAppointments(year: number, month: number): UserAppointment[] {
  const cacheKey = `${year}-${month}`;
  const cached = appointmentsCache.get(cacheKey);
  if (cached) return cached;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const totalAppointments = randomInt(MIN_APPOINTMENTS, MAX_APPOINTMENTS);
  const today = todayYMD();
  const usedSlots = new Set<string>();

  const appointments: UserAppointment[] = [];
  for (let seq = 1; seq <= totalAppointments; seq++) {
    let day = 0;
    let time = "";
    let attempts = 0;
    do {
      day = randomInt(1, daysInMonth);
      time = randomItem(POSSIBLE_TIMES);
      attempts++;
    } while (usedSlots.has(`${day}-${time}`) && attempts < MAX_PICK_ATTEMPTS);

    const slotKey = `${day}-${time}`;
    if (usedSlots.has(slotKey)) continue;
    usedSlots.add(slotKey);

    const date = formatDate(year, month, day);
    const professional = randomItem(MOCK_PROFESSIONALS);

    appointments.push({
      id: `appt_${year}_${String(month + 1).padStart(2, "0")}_${String(seq).padStart(3, "0")}`,
      professionalName: professional.professionalName,
      specialty: professional.specialty,
      date,
      time,
      status: date < today ? "completed" : "scheduled",
      type: randomItem(APPOINTMENT_TYPES),
    });
  }

  appointments.sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)));
  appointmentsCache.set(cacheKey, appointments);
  return appointments;
}

/** Looks up the mocked appointments for a specific "YYYY-MM-DD" date. */
export function getMockAppointmentsForDate(date: string): UserAppointment[] {
  const [year, month] = date.split("-").map(Number);
  const monthAppointments = generateMockUserAppointments(year, month - 1);
  return monthAppointments.filter((a) => a.date === date);
}

function addDays(base: Date, days: number): string {
  const result = new Date(base);
  result.setDate(result.getDate() + days);
  return result.toISOString().split("T")[0];
}

function pickUniqueUpcomingSlot(usedSlots: Set<string>): { date: string; time: string } {
  let date = "";
  let time = "";
  let attempts = 0;
  do {
    date = addDays(new Date(), randomInt(0, RANDOM_WINDOW_DAYS));
    time = randomItem(POSSIBLE_TIMES);
    attempts++;
  } while (usedSlots.has(`${date}-${time}`) && attempts < MAX_PICK_ATTEMPTS);

  usedSlots.add(`${date}-${time}`);
  return { date, time };
}

function pickDiversifiedProfessional(usage: Map<string, number>) {
  const available = MOCK_PROFESSIONALS.filter(
    (p) => (usage.get(p.professionalName) ?? 0) < MAX_PROFESSIONAL_REPEATS
  );
  const professional = randomItem(available.length > 0 ? available : MOCK_PROFESSIONALS);
  usage.set(professional.professionalName, (usage.get(professional.professionalName) ?? 0) + 1);
  return professional;
}

function pickRandomUniqueTimes(count: number): string[] {
  const pool = [...POSSIBLE_TIMES];
  const picked: string[] = [];
  const total = Math.min(count, pool.length);
  for (let i = 0; i < total; i++) {
    const index = randomInt(0, pool.length - 1);
    picked.push(pool.splice(index, 1)[0]);
  }
  return picked;
}

// Cached per selected calendar date so revisiting a date keeps the same
// mocked appointments instead of re-rolling them on every render.
const appointmentsByDateCache = new Map<string, UserAppointment[]>();

/**
 * Generates a small, realistic batch of appointments (1 to 4) for a single
 * "YYYY-MM-DD" date, favoring different professionals (max 2 repeats).
 */
export function generateMockAppointmentsForDate(date: string): UserAppointment[] {
  const cached = appointmentsByDateCache.get(date);
  if (cached) return cached;

  const count = randomInt(MIN_RANDOM_APPOINTMENTS, MAX_RANDOM_APPOINTMENTS);
  const today = todayYMD();
  const professionalUsage = new Map<string, number>();

  const appointments = pickRandomUniqueTimes(count).map((time, index) => {
    const professional = pickDiversifiedProfessional(professionalUsage);
    return {
      id: `appt_${date}_${String(index + 1).padStart(2, "0")}`,
      professionalName: professional.professionalName,
      specialty: professional.specialty,
      date,
      time,
      status: (date < today ? "completed" : "scheduled") as UserAppointment["status"],
      type: randomItem(APPOINTMENT_TYPES),
    };
  });

  appointments.sort((a, b) => a.time.localeCompare(b.time));
  appointmentsByDateCache.set(date, appointments);
  return appointments;
}

/** Simulates rescheduling: assigns a fresh upcoming slot and resets status to "scheduled". */
export function rescheduleMockAppointment(appointment: UserAppointment): UserAppointment {
  const { date, time } = pickUniqueUpcomingSlot(new Set());
  return { ...appointment, date, time, status: "scheduled" };
}

/**
 * Simulates postponing: tries a later time slot on the same day first,
 * otherwise moves to a fresh nearby upcoming date.
 */
export function postponeMockAppointment(appointment: UserAppointment): UserAppointment {
  const laterTimes = POSSIBLE_TIMES.filter((t) => t > appointment.time);
  if (laterTimes.length > 0) {
    return { ...appointment, time: randomItem(laterTimes), status: "scheduled" };
  }
  const { date, time } = pickUniqueUpcomingSlot(new Set());
  return { ...appointment, date, time, status: "scheduled" };
}
