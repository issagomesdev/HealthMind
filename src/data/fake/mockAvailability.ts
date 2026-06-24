export const POSSIBLE_TIMES = ["09:00", "10:30", "14:00", "16:30", "18:00"];

const MIN_AVAILABLE_DAYS = 6;
const MAX_AVAILABLE_DAYS = 12;
const MIN_TIMES_PER_DAY = 1;
const MAX_TIMES_PER_DAY = 4;

export interface MockAvailabilityDay {
  date: string;
  times: string[];
}

// Cached per "year-month" key so the calendar grid and the time lookup for a
// selected date always agree, instead of re-rolling random data on every call.
const availabilityCache = new Map<string, MockAvailabilityDay[]>();

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

/**
 * Generates mocked availability for a given month (month is 0-indexed,
 * January = 0, matching JS Date conventions and the calendar's view state).
 */
export function generateMockAvailability(year: number, month: number): MockAvailabilityDay[] {
  const cacheKey = `${year}-${month}`;
  const cached = availabilityCache.get(cacheKey);
  if (cached) return cached;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const availableDaysCount = randomInt(MIN_AVAILABLE_DAYS, MAX_AVAILABLE_DAYS);
  const days = pickRandomUnique(
    Array.from({ length: daysInMonth }, (_, i) => i + 1),
    availableDaysCount
  );

  const availability = days
    .map((day) => ({
      date: formatDate(year, month, day),
      times: pickRandomUnique(POSSIBLE_TIMES, randomInt(MIN_TIMES_PER_DAY, MAX_TIMES_PER_DAY)).sort(),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  availabilityCache.set(cacheKey, availability);
  return availability;
}

/** Looks up the mocked times for a specific "YYYY-MM-DD" date. */
export function getMockTimesForDate(date: string): string[] {
  const [year, month] = date.split("-").map(Number);
  const monthAvailability = generateMockAvailability(year, month - 1);
  return monthAvailability.find((day) => day.date === date)?.times ?? [];
}
