import appointmentsData from "../../data/fake/patientAppointments.json";
import {
  PatientAppointment,
  AppointmentType,
  AppointmentFormatType,
} from "../../types/patient";

const delay = (ms = 350) => new Promise<void>((r) => setTimeout(r, ms));

let appointments: PatientAppointment[] = appointmentsData.appointments as PatientAppointment[];

export type AppointmentTabFilter = "upcoming" | "past" | "cancelled" | "all";

function isUpcoming(apt: PatientAppointment): boolean {
  return (
    new Date(apt.scheduledAt) >= new Date() &&
    apt.status !== "cancelled" &&
    apt.status !== "missed"
  );
}

function isPast(apt: PatientAppointment): boolean {
  return (
    apt.status === "completed" ||
    apt.status === "missed" ||
    (new Date(apt.scheduledAt) < new Date() && apt.status !== "cancelled")
  );
}

class PatientAppointmentService {
  async getPatientAppointments(
    patientId: string,
    tab: AppointmentTabFilter = "all"
  ): Promise<PatientAppointment[]> {
    await delay(300);
    let result = appointments.filter((a) => a.patientId === patientId);

    if (tab === "upcoming") result = result.filter(isUpcoming);
    else if (tab === "past") result = result.filter(isPast);
    else if (tab === "cancelled") result = result.filter((a) => a.status === "cancelled");

    return result.sort(
      (a, b) => new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime()
    );
  }

  async getAppointmentById(id: string): Promise<PatientAppointment | null> {
    await delay(200);
    return appointments.find((a) => a.id === id) ?? null;
  }

  async getNextAppointment(patientId: string): Promise<PatientAppointment | null> {
    await delay(150);
    const upcoming = appointments
      .filter((a) => a.patientId === patientId && isUpcoming(a))
      .sort((a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime());
    return upcoming[0] ?? null;
  }

  async createAppointment(
    patientId: string,
    data: {
      scheduledAt: string;
      type: AppointmentType;
      format: AppointmentFormatType;
      durationMinutes: number;
      value: number | null;
      shortNote: string;
      objectives: string[];
    }
  ): Promise<PatientAppointment> {
    await delay(500);
    const typeLabels: Record<AppointmentType, string> = {
      consultation: "Consulta",
      return: "Retorno",
      initial_assessment: "Avaliação inicial",
      follow_up: "Acompanhamento",
    };
    const formatLabels: Record<AppointmentFormatType, string> = {
      online: "Online",
      in_person: "Presencial",
      hybrid: "Híbrido",
    };
    const newApt: PatientAppointment = {
      id: `apt${Date.now()}`,
      patientId,
      scheduledAt: data.scheduledAt,
      type: data.type,
      typeLabel: typeLabels[data.type],
      format: data.format,
      formatLabel: formatLabels[data.format],
      status: "scheduled",
      statusLabel: "Agendada",
      durationMinutes: data.durationMinutes,
      value: data.value,
      callLink: data.format !== "in_person" ? `https://meet.fake-link.com/${Date.now()}` : null,
      address: data.format !== "online" ? "Endereço a confirmar" : null,
      shortNote: data.shortNote,
      sessionNotes: "",
      objectives: data.objectives,
      referrals: [],
      hasCharge: data.value != null,
      charged: false,
    };
    appointments = [...appointments, newApt];
    return newApt;
  }

  async cancelAppointment(appointmentId: string): Promise<void> {
    await delay(300);
    appointments = appointments.map((a) =>
      a.id === appointmentId
        ? { ...a, status: "cancelled" as const, statusLabel: "Cancelada" }
        : a
    );
  }

  async rescheduleAppointment(appointmentId: string, newDate: string): Promise<PatientAppointment> {
    await delay(400);
    appointments = appointments.map((a) =>
      a.id === appointmentId
        ? { ...a, scheduledAt: newDate, status: "rescheduled" as const, statusLabel: "Remarcada" }
        : a
    );
    return appointments.find((a) => a.id === appointmentId)!;
  }
}

export const patientAppointmentService = new PatientAppointmentService();
