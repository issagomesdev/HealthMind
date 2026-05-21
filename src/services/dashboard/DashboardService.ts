import { PatientDashboardData, ProfessionalDashboardData } from "../../core/types";

// Future: replace mock returns with ApiService calls:
//   GET /dashboard/patient
//   GET /dashboard/professional

class DashboardServiceImpl {
  async getPatientDashboard(): Promise<PatientDashboardData> {
    return {
      selectedMood: null,
      recommendedActivity: {
        id: "1",
        title: "Meditação Guiada: Encontrando Foco",
        durationLabel: "10 min",
        category: "Meditação",
      },
      nextAppointment: {
        id: "1",
        professionalName: "Dra. Ana Silva",
        specialty: "Psicóloga Clínica",
        dateLabel: "Hoje",
        time: "14:00",
      },
      weeklyMetrics: [
        { day: "Seg", value: 0.6 },
        { day: "Ter", value: 0.8 },
        { day: "Qua", value: 0.5 },
        { day: "Qui", value: 0.9 },
        { day: "Sex", value: 0.7 },
      ],
      weeklyInsight: "Seu humor esteve mais estável esta semana.",
    };
  }

  async getProfessionalDashboard(): Promise<ProfessionalDashboardData> {
    return {
      activePatients: 42,
      activePatientsChange: "+3 esta semana",
      nextAppointmentsCount: 5,
      nextAppointmentsTime: "Hoje, a partir das 10:00",
      emotionalAlerts: [
        {
          id: "1",
          patientId: "p7",
          patientName: "Beatriz Almeida",
          alertType: "mood_drop",
          message: "Autolesão relatada — protocolo de crise ativo",
          severity: "high",
        },
        {
          id: "2",
          patientId: "p6",
          patientName: "Paulo Ferreira",
          alertType: "missed_checkin",
          message: "Flashbacks aumentando — check-in perdido",
          severity: "medium",
        },
      ],
      weeklyMetrics: [
        { day: "S", value: 0.4 },
        { day: "T", value: 0.55 },
        { day: "Q", value: 0.8 },
        { day: "Q", value: 1.0 },
        { day: "S", value: 0.6 },
        { day: "S", value: 0.35 },
        { day: "D", value: 0.5 },
      ],
      professionalInsight:
        "Considere reservar um intervalo entre consultas de alta intensidade hoje para manter seu bem-estar pessoal.",
    };
  }
}

export const DashboardService = new DashboardServiceImpl();
