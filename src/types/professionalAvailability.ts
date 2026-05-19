export type AppointmentFormat = "online" | "presencial" | "hibrido";
export type BookingMode = "auto" | "manual";
export type UnavailableReason =
  | "viagem"
  | "evento"
  | "ferias"
  | "compromisso_pessoal"
  | "outro";

export interface TimeInterval {
  id: string;
  start: string; // "HH:MM"
  end: string; // "HH:MM"
}

export interface AvailabilityDay {
  enabled: boolean;
  intervals: TimeInterval[];
}

export type WeeklyAvailability = {
  segunda: AvailabilityDay;
  terca: AvailabilityDay;
  quarta: AvailabilityDay;
  quinta: AvailabilityDay;
  sexta: AvailabilityDay;
  sabado: AvailabilityDay;
  domingo: AvailabilityDay;
};

export interface UnavailablePeriod {
  id: string;
  startDate: string; // "YYYY-MM-DD"
  endDate: string;
  startTime?: string; // "HH:MM", se for dia parcial
  endTime?: string;
  reason: UnavailableReason;
  note?: string;
}

export interface AppointmentTypeConfig {
  id: string;
  type:
    | "avaliacao_inicial"
    | "acompanhamento"
    | "retorno"
    | "emergencia"
    | "orientacao_breve"
    | "supervisao";
  label: string;
  durationMinutes: number;
  valueFake: number; // em centavos
  formats: AppointmentFormat[];
  color: string;
}

export interface AppointmentRule {
  minAdvanceHours: number; // 2, 12, 24, 48
  maxAdvanceDays: number; // 7, 15, 30, 60
  allowPatientReschedule: boolean;
  rescheduleMinHours: number;
  allowPatientCancel: boolean;
  cancelMinHours: number;
  requireManualConfirmation: boolean;
  bookingMode: BookingMode;
}

export interface BreakConfig {
  breakBetweenMinutes: number; // 0, 10, 15, 30, 45
  lunchStart?: string; // "HH:MM"
  lunchEnd?: string;
  maxPerDay: number;
  maxConsecutive: number;
}

export interface FormatConfig {
  formats: AppointmentFormat[];
  officeAddress?: string;
  hideAddressUntilConfirmed: boolean;
  defaultOnlineLink?: string;
  autoGenerateLink: boolean;
}

export interface AvailableSlot {
  date: string; // "YYYY-MM-DD"
  time: string; // "HH:MM"
  label: string; // "Hoje, 14:30"
}

export interface ProfessionalAvailability {
  isGenerallyAvailable: boolean;
  weeklySchedule: WeeklyAvailability;
  defaultDurationMinutes: number;
  breakConfig: BreakConfig;
  formatConfig: FormatConfig;
  appointmentTypes: AppointmentTypeConfig[];
  bookingRules: AppointmentRule;
  unavailablePeriods: UnavailablePeriod[];
}
