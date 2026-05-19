import dashboardData from "../data/fake/reports/reportsDashboard.json";
import patientRowsData from "../data/fake/reports/patientReports.json";
import fullReportsData from "../data/fake/reports/patientFullReports.json";
import type {
  ReportsDashboardSummary,
  PatientReportRow,
  PatientFullReport,
  MoodChartPoint,
  ReportPeriod,
  PatientReportStatus,
} from "../types/reports";

const delay = (ms = 400) => new Promise<void>((r) => setTimeout(r, ms));

let fullReports: Record<string, PatientFullReport> = {
  ...(fullReportsData as unknown as Record<string, PatientFullReport>),
};

class ReportsService {
  async getDashboardSummary(): Promise<ReportsDashboardSummary> {
    await delay();
    return dashboardData.summary as ReportsDashboardSummary;
  }

  async getMoodHistory(period: ReportPeriod): Promise<MoodChartPoint[]> {
    await delay(300);
    const all = dashboardData.moodHistory as MoodChartPoint[];
    if (period === "today") return all.slice(-1);
    if (period === "7d") return all.slice(-7);
    // 30d, 90d, custom — return all 30 points
    return all;
  }

  async getActivityAdherence(): Promise<Array<{ week: string; completedPct: number }>> {
    await delay(300);
    return dashboardData.activityAdherence;
  }

  async getDiaryFrequency(): Promise<Array<{ week: string; count: number }>> {
    await delay(300);
    return dashboardData.diaryFrequency;
  }

  async getEmotionDistribution(): Promise<
    Array<{ emotion: string; count: number; pct: number; color: string }>
  > {
    await delay(300);
    return dashboardData.emotionDistribution;
  }

  async getPatientRows(
    search?: string,
    status?: PatientReportStatus | "all"
  ): Promise<PatientReportRow[]> {
    await delay(400);
    let rows = patientRowsData as PatientReportRow[];

    if (search && search.trim().length > 0) {
      const q = search.toLowerCase().trim();
      rows = rows.filter((r) => r.name.toLowerCase().includes(q));
    }

    if (status && status !== "all") {
      rows = rows.filter((r) => r.status === status);
    }

    return rows;
  }

  async getPatientFullReport(patientId: string): Promise<PatientFullReport | null> {
    await delay(500);
    return fullReports[patientId] ?? null;
  }

  async addProfessionalNote(
    patientId: string,
    text: string,
    isPrivate: boolean
  ): Promise<void> {
    await delay(400);
    const report = fullReports[patientId];
    if (!report) return;

    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, "0")}/${String(
      today.getMonth() + 1
    ).padStart(2, "0")}/${today.getFullYear()}`;

    fullReports = {
      ...fullReports,
      [patientId]: {
        ...report,
        professionalNotes: [
          { date: dateStr, text, private: isPrivate },
          ...report.professionalNotes,
        ],
      },
    };
  }

  async exportReportFake(patientId?: string): Promise<{ success: boolean; message: string }> {
    await delay(600);
    return {
      success: true,
      message: "Relatório PDF gerado. Download disponível em breve.",
    };
  }
}

export const reportsService = new ReportsService();
