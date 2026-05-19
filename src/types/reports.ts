export type ReportPeriod = "today" | "7d" | "30d" | "90d" | "custom";
export type PatientReportStatus = "stable" | "attention" | "critical";
export type ReportChartType = "mood" | "activity" | "diary" | "emotions";

export interface ReportsDashboardSummary {
  activePatients: number;
  consultationsCompleted: number;
  consultationsScheduled: number;
  averageMood: number;
  recentAlerts: number;
  activitiesCompleted: number;
  diaryEntries: number;
  moodTrend: number;
  activityAdherencePct: number;
}

export interface MoodChartPoint {
  date: string;
  value: number;
}

export interface EmotionDistribution {
  emotion: string;
  count: number;
  pct: number;
  color: string;
}

export interface ActivityAdherencePoint {
  week: string;
  completedPct: number;
}

export interface DiaryFrequencyPoint {
  week: string;
  count: number;
}

export interface PatientReportRow {
  id: string;
  name: string;
  avatarInitials: string;
  lastInteraction: string;
  averageMood: number;
  activityAdherencePct: number;
  status: PatientReportStatus;
  diaryEntriesLast30: number;
  trend: "improving" | "stable" | "worsening";
  riskLevel: "stable" | "attention" | "high_risk" | "critical";
  alertMessages: string[];
}

export interface PatientFullReport {
  id: string;
  name: string;
  avatarInitials: string;
  age: number;
  mainComplaint: string;
  memberSince: string;
  periodLabel: string;
  consultationsInPeriod: number;
  diaryEntriesInPeriod: number;
  activitiesCompletedInPeriod: number;
  averageMoodInPeriod: number;
  moodHistory: MoodChartPoint[];
  dominantEmotions: string[];
  recurringThemes: string[];
  triggers: string[];
  recommendedActivities: Array<{ label: string; completedCount: number; totalCount: number }>;
  appointmentsHistory: Array<{ date: string; type: string; notes: string; status: string }>;
  professionalNotes: Array<{ date: string; text: string; private: boolean }>;
  alerts: string[];
  progressSummary: string;
}
