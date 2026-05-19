import dashboardData from "../data/fake/evolutionDashboard.json";
import patientListData from "../data/fake/patientEvolutionList.json";
import patientDetailsData from "../data/fake/patientEvolutionDetails.json";
import type {
  DashboardSummary,
  PatientEvolutionSummary,
  PatientEvolutionDetails,
  EmotionalInsight,
  EmotionalAlert,
  MoodDataPoint,
  PeriodFilter,
  SortFilter,
  RiskFilter,
} from "../types/evolution";

const delay = (ms = 400) => new Promise<void>((r) => setTimeout(r, ms));

const PERIOD_DAYS: Record<PeriodFilter, number> = {
  "7d": 7,
  "30d": 30,
  "3m": 90,
  "6m": 180,
  "1y": 365,
};

// Local mutable copy for alert read state
let alertsState: EmotionalAlert[] = dashboardData.recentAlerts as EmotionalAlert[];

class EvolutionService {
  async getDashboardSummary(): Promise<DashboardSummary> {
    await delay();
    return dashboardData.summary as DashboardSummary;
  }

  async getGlobalMoodHistory(period: PeriodFilter): Promise<MoodDataPoint[]> {
    await delay(300);
    const all = dashboardData.globalMoodHistory as MoodDataPoint[];
    const days = PERIOD_DAYS[period];
    // Return last `days` points (or all if we have fewer)
    return all.slice(-days);
  }

  async getWeeklyMoodHistory(): Promise<MoodDataPoint[]> {
    await delay(300);
    return dashboardData.weeklyMoodHistory as MoodDataPoint[];
  }

  async getPatientList(
    sort?: SortFilter,
    risk?: RiskFilter,
    search?: string
  ): Promise<PatientEvolutionSummary[]> {
    await delay();
    let list = [...(patientListData as PatientEvolutionSummary[])];

    // Search filter
    if (search && search.trim().length > 0) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    // Risk filter
    if (risk && risk !== "all") {
      list = list.filter((p) => p.riskLevel === risk);
    }

    // Sort
    if (sort) {
      switch (sort) {
        case "in_alert":
          list.sort((a, b) => (b.hasAlert ? 1 : 0) - (a.hasAlert ? 1 : 0));
          break;
        case "best_evolution":
          list.sort((a, b) => b.evolutionPct - a.evolutionPct);
          break;
        case "least_engagement":
          list.sort((a, b) => {
            const order: Record<string, number> = { inactive: 0, low: 1, medium: 2, high: 3 };
            return (order[a.engagementLevel] ?? 0) - (order[b.engagementLevel] ?? 0);
          });
          break;
        case "most_active":
        default:
          list.sort((a, b) => b.checkInsLast7Days - a.checkInsLast7Days);
          break;
      }
    }

    return list;
  }

  async getInsights(): Promise<EmotionalInsight[]> {
    await delay(300);
    return dashboardData.recentInsights as EmotionalInsight[];
  }

  async getAlerts(): Promise<EmotionalAlert[]> {
    await delay(300);
    return [...alertsState];
  }

  async getPatientDetails(patientId: string): Promise<PatientEvolutionDetails | null> {
    await delay();
    const details = (patientDetailsData as Record<string, PatientEvolutionDetails>)[patientId];
    return details ?? null;
  }

  async markAlertRead(alertId: string): Promise<void> {
    await delay(200);
    alertsState = alertsState.map((a) => (a.id === alertId ? { ...a, isRead: true } : a));
  }
}

export const evolutionService = new EvolutionService();
