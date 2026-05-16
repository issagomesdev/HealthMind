export type PatientStatus = "active" | "pending" | "stable" | "attention" | "high_risk" | "critical";
export type RiskLevel = "stable" | "attention" | "high_risk" | "critical";
export type PaymentType = "single" | "recurring";
export type RecurringInterval = "daily" | "weekly" | "monthly" | "bimonthly" | "annual";
export type AppointmentFormat = "online" | "in_person" | "hybrid";
export type PlanTag = "premium" | "free" | "cbt" | "mindfulness" | "coaching" | "grief_support" | "trauma" | "anxiety";
export type TherapyCategory = "Ansiedade" | "Trauma" | "Estresse" | "Raiva" | "Insônia" | "Depressão" | "Luto" | "Relacionamentos" | "Autoestima" | "Foco" | "Burnout";

export interface ProfessionalPatient {
  id: string;
  userId: string;
  name: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  age: number;
  gender: string;
  city: string;
  state: string;
  status: PatientStatus;
  riskLevel: RiskLevel;
  mainComplaint: string;
  secondaryComplaints: string[];
  dominantFeeling: string;
  recentFeelings: string[];
  averageMood: number;
  moodVariation: number;
  recurringEmotions: string[];
  lastInteraction: string;
  nextAppointment: string | null;
  planTags: PlanTag[];
  therapyCategories: TherapyCategory[];
  therapyGoals: string[];
  diaryPreview: string;
  recentDiaryEntries: DiaryEntry[];
  importantNotes: string;
  emotionalAlerts: string[];
  progressSummary: string;
  hasHealthInsurance: boolean;
  healthInsuranceName: string | null;
  hasPreviousTherapy: boolean;
  currentMedications: string;
  memberSince: string;
  contractRequest?: ContractRequest;
}

export interface DiaryEntry {
  id: string;
  date: string;
  summary: string;
  mood: number;
}

export interface ContractRequest {
  id: string;
  patientUserId: string;
  patientName: string;
  patientEmail: string;
  patientUsername: string;
  patientAge: number;
  patientCity: string;
  patientState: string;
  patientCategories: TherapyCategory[];
  message: string;
  serviceValue: number;
  paymentType: PaymentType;
  recurringInterval: RecurringInterval | null;
  categories: TherapyCategory[];
  sessionsIncluded: number | null;
  sessionDurationMinutes: number;
  appointmentFormat: AppointmentFormat;
  additionalNotes: string;
  allowExtraCharges: boolean;
  extraChargesPolicy: string;
  sentAt: string;
}

export interface UserToInvite {
  id: string;
  name: string;
  email: string;
  username: string;
  avatarUrl: string | null;
  age: number;
  city: string;
  state: string;
  categories: TherapyCategory[];
  mainComplaint: string;
}

export interface PaymentRecord {
  id: string;
  patientId: string;
  description: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "overdue";
  type: "regular" | "extra";
}

export interface ChatMessage {
  id: string;
  patientId: string;
  senderId: string;
  senderRole: "professional" | "patient";
  text: string;
  sentAt: string;
}

export interface ExtraCharge {
  id: string;
  patientId: string;
  description: string;
  amount: number;
  reason: string;
  requestedAt: string;
}

// ─── Diary ───────────────────────────────────────────────────────────────────
export type DiaryMoodLabel = "Estável" | "Ansioso" | "Triste" | "Irritado" | "Cansado" | "Feliz" | "Angustiado";

export interface DiaryRecord {
  id: string;
  patientId: string;
  recordedAt: string;
  mood: number;
  moodLabel: DiaryMoodLabel;
  dominantEmotion: string;
  emotions: string[];
  summary: string;
  fullText: string;
  triggers: string[];
  recurringThoughts: string[];
  emotionalIntensity: number;
  emotionTags: string[];
  hasAlert: boolean;
  alertMessage: string | null;
  sharedWithProfessional: boolean;
  appNotes: string;
  professionalObservation: string | null;
}

// ─── Appointments ─────────────────────────────────────────────────────────────
export type AppointmentType = "consultation" | "return" | "initial_assessment" | "follow_up";
export type AppointmentStatus = "scheduled" | "completed" | "cancelled" | "rescheduled" | "missed";
export type AppointmentFormatType = "online" | "in_person" | "hybrid";

export interface PatientAppointment {
  id: string;
  patientId: string;
  scheduledAt: string;
  type: AppointmentType;
  typeLabel: string;
  format: AppointmentFormatType;
  formatLabel: string;
  status: AppointmentStatus;
  statusLabel: string;
  durationMinutes: number;
  value: number | null;
  callLink: string | null;
  address: string | null;
  shortNote: string;
  sessionNotes: string;
  objectives: string[];
  referrals: string[];
  hasCharge: boolean;
  charged: boolean;
}

// ─── Observations ─────────────────────────────────────────────────────────────
export type ObservationCategory =
  | "Evolução"
  | "Sessão"
  | "Alerta"
  | "Plano terapêutico"
  | "Comportamento"
  | "Pagamento"
  | "Geral";
export type ObservationPriority = "Baixa" | "Média" | "Alta" | "Urgente";

export interface PatientObservation {
  id: string;
  patientId: string;
  title: string;
  createdAt: string;
  category: ObservationCategory;
  priority: ObservationPriority;
  summary: string;
  fullText: string;
  tags: string[];
  isPrivate: boolean;
  isPinned: boolean;
  isImportant: boolean;
  authorName: string;
  patientName: string;
}
