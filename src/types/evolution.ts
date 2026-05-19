export type EvolutionTrend = "improving" | "stable" | "worsening";
export type EvolutionRiskLevel = "stable" | "attention" | "high_risk" | "critical";
export type EngagementLevel = "high" | "medium" | "low" | "inactive";

export interface MoodDataPoint {
  date: string; // "YYYY-MM-DD"
  value: number; // 1-10
  label?: string;
}

export interface DashboardSummary {
  totalPatients: number;
  patientsInAlert: number;
  positiveEvolutionThisMonth: number;
  checkInsThisMonth: number;
  averageMoodScore: number;
  completedAppointments: number;
  patientsWithoutRecentInteraction: number;
  weekComparison: {
    checkIns: { current: number; previous: number; pct: number };
    mood: { current: number; previous: number; pct: number };
    engagement: { current: number; previous: number; pct: number };
  };
}

export interface PatientEvolutionSummary {
  id: string;
  name: string;
  avatarInitials: string;
  dominantMood: string;
  trend: EvolutionTrend;
  riskLevel: EvolutionRiskLevel;
  engagementLevel: EngagementLevel;
  evolutionPct: number;
  lastActivity: string;
  nextAppointment: string | null;
  emotionBadges: string[];
  checkInsLast7Days: number;
  averageMood: number;
  hasAlert: boolean;
  alertMessage: string | null;
}

export interface EmotionalInsight {
  id: string;
  patientId: string | null;
  patientName: string | null;
  category: "improvement" | "warning" | "pattern" | "engagement" | "neutral";
  title: string;
  text: string;
  generatedAt: string;
  icon: string;
}

export interface EmotionalAlert {
  id: string;
  patientId: string;
  patientName: string;
  type: "high_risk" | "mood_drop" | "no_checkin" | "anxiety_spike" | "disengagement" | "behavioral_change";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  triggeredAt: string;
  isRead: boolean;
}

export interface PatientEvolutionDetails {
  id: string;
  name: string;
  avatarInitials: string;
  age: number;
  specialty: string;
  memberSince: string;
  trend: EvolutionTrend;
  riskLevel: EvolutionRiskLevel;

  moodHistory: MoodDataPoint[];
  weeklyMoodHistory: MoodDataPoint[];

  emotionalScore: number;
  stabilityScore: number;
  engagementScore: number;
  therapeuticProgress: number;

  recurringEmotions: Array<{ label: string; count: number }>;
  triggers: string[];
  recurrentTopics: string[];

  diaryFrequency: number;
  appointmentsAttended: number;
  appointmentsMissed: number;
  activitiesCompleted: number;
  avgTimeBetweenInteractionsDays: number;

  insights: string[];
  therapeuticGoals: Array<{ label: string; progress: number }>;

  lastMonthComparison: {
    mood: { current: number; previous: number; pct: number };
    checkins: { current: number; previous: number; pct: number };
    stress: { current: number; previous: number; pct: number };
  };

  alerts: EmotionalAlert[];
  importantObservations: string[];

  activities: Array<{ label: string; completedCount: number; totalCount: number }>;
  habits: Array<{ label: string; icon: string; consistency: number }>;
}

export type PeriodFilter = "7d" | "30d" | "3m" | "6m" | "1y";
export type SortFilter = "most_active" | "in_alert" | "best_evolution" | "least_engagement";
export type RiskFilter = "all" | EvolutionRiskLevel;
