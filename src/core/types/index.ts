export type UserRole = "patient" | "professional";
export type PlanType = "free" | "premium";
export type ThemeMode = "light" | "dark" | "system";

export type GenderType = "female" | "male" | "non_binary" | "other" | "prefer_not_to_say";
export type RegisterType = "CRP" | "CRM" | "OTHER";

export interface PatientProfile {
  id: string;
  user_id: string;
  birth_date: string | null;
  gender: GenderType | null;
  cpf: string | null;
  phone: string | null;
  address_zipcode: string | null;
  address_street: string | null;
  address_number: string | null;
  address_complement: string | null;
  address_neighborhood: string | null;
  address_city: string | null;
  address_state: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_relationship: string | null;
  main_complaint: string | null;
  therapy_goals: string | null;
  current_medications: string | null;
  has_previous_therapy: boolean | null;
  has_psychiatric_follow_up: boolean | null;
  has_health_insurance: boolean | null;
  health_insurance_name: string | null;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfessionalProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  cpf: string | null;
  phone: string | null;
  birth_date: string | null;
  gender: GenderType | null;
  professional_register: string | null;
  register_type: RegisterType | null;
  register_state: string | null;
  specialty: string | null;
  approach: string | null;
  bio: string | null;
  experience_years: number | null;
  clinic_name: string | null;
  consultation_price: number | null;
  offers_online_care: boolean;
  offers_in_person_care: boolean;
  address_zipcode: string | null;
  address_street: string | null;
  address_number: string | null;
  address_complement: string | null;
  address_neighborhood: string | null;
  address_city: string | null;
  address_state: string | null;
  profile_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  avatar_url: string | null;
  profile_completed: boolean;
  created_at: string;
}

export interface AuthResult {
  user: User;
  profile: PatientProfile | ProfessionalProfile | null;
}

export interface AuthState {
  user: User | null;
  profile: PatientProfile | ProfessionalProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface AppError {
  message: string;
  code?: string;
}

// ─── Mood / Check-in ──────────────────────────────────────────────────────────

export type MoodType = "PESSIMO" | "RUIM" | "NEUTRO" | "BEM" | "OTIMO";

export interface MoodEntry {
  mood: MoodType;
  stressLevel: number;
  description: string;
  createdAt: string;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export type MoodValue = 1 | 2 | 3 | 4 | 5;

export interface WeeklyMetric {
  day: string;
  value: number; // 0–1
}

export interface EmotionalAlert {
  id: string;
  patientId: string;
  patientName: string;
  alertType: "mood_drop" | "missed_checkin" | "custom";
  message: string;
  severity: "high" | "medium" | "low";
}

export interface AppointmentInfo {
  id: string;
  professionalName: string;
  specialty: string;
  dateLabel: string;
  time: string;
}

export interface ActivityInfo {
  id: string;
  title: string;
  durationLabel: string;
  category: string;
}

export interface PatientDashboardData {
  selectedMood: MoodValue | null;
  recommendedActivity: ActivityInfo;
  nextAppointment: AppointmentInfo | null;
  weeklyMetrics: WeeklyMetric[];
  weeklyInsight: string;
}

export interface ProfessionalDashboardData {
  activePatients: number;
  activePatientsChange: string;
  nextAppointmentsCount: number;
  nextAppointmentsTime: string;
  emotionalAlerts: EmotionalAlert[];
  weeklyMetrics: WeeklyMetric[];
  professionalInsight: string;
}

// ─── Activities ───────────────────────────────────────────────────────────────

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  durationMinutes: number;
  icon: string;
  recommended: boolean;
}

// ─── Progress ─────────────────────────────────────────────────────────────────

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  completed: boolean;
}

export interface FrequentEmotion {
  label: string;
  color: string;
}

export interface ProgressSummary {
  checkInStreak: number;
  frequentEmotions: FrequentEmotion[];
  achievements: Achievement[];
  weeklyMood: WeeklyMetric[];
  insight: string;
  insightSubtext: string;
}

// ─── Contents ─────────────────────────────────────────────────────────────────

export type ContentType = "trilha" | "leitura" | "áudio" | "prática";
export type ContentCategory =
  | "todos"
  | "ansiedade"
  | "autoestima"
  | "relacionamentos"
  | "trabalho"
  | "faculdade"
  | "família";

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  category: ContentCategory;
  type: ContentType;
  durationMinutes: number;
  featured: boolean;
  recommended: boolean;
}

// ─── Professionals / Appointments ────────────────────────────────────────────

export type Symptom =
  | "ansiedade" | "estresse" | "insonia" | "autoestima" | "burnout"
  | "relacionamentos" | "procrastinacao" | "luto" | "autoconhecimento"
  | "sono" | "dependencia_emocional" | "tristeza_constante" | "falta_motivacao"
  | "organizacao_emocional" | "controle_emocional" | "pressao_trabalho"
  | "pressao_academica" | "autoaceitacao" | "inseguranca" | "medos_sociais"
  | "dificuldade_foco" | "exaustao_mental" | "compulsao_alimentar"
  | "isolamento_social" | "desenvolvimento_pessoal" | "inteligencia_emocional"
  | "conflitos_familiares" | "saude_emocional" | "rotina_saudavel" | "crises_ansiedade";

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  description: string;
  avatar?: string;
  tags: string[];
  rating: number;
  appointmentsCount: number;
}

export interface AppointmentSlot {
  date: string;
  time: string;
  available: boolean;
}

// ─── Profile / Settings / Subscription ───────────────────────────────────────

export type DiaryPrivacy = "PRIVATE" | "PROFESSIONALS" | "PUBLIC";

export interface NotificationSettings {
  dailyCheckIn: boolean;
  hydrationReminder: boolean;
  selfCareSuggestions: boolean;
  communityReplies: boolean;
  appointments: boolean;
  weeklyReports: boolean;
}

export type SubscriptionPlan = "ESSENTIAL" | "PREMIUM";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string | null;
  plan: SubscriptionPlan;
  badge: string;
  level: number;
}

// ─── Community ────────────────────────────────────────────────────────────────

export type CommunityCategory =
  | "motivacao"
  | "apoio"
  | "dica"
  | "reflexao"
  | "experiencia"
  | "rotina"
  | "saude_mental";

export interface CommunityTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface CommunityUser {
  id: string;
  name: string;
  avatar?: string;
}

export interface CommunityPost {
  id: string;
  user: CommunityUser;
  topic: string;
  categories: CommunityCategory[];
  content: string;
  image?: string;
  likes: number;
  comments: number;
  liked: boolean;
  createdAt: string;
}

// ─── Mood Insights ────────────────────────────────────────────────────────────

export interface MoodInsightItem {
  title: string;
  description: string;
}

export interface EmotionTrend {
  emotion: string;
  count: number;
  color: string;
}

export interface MoodRecommendation {
  id: string;
  text: string;
}

export interface MoodSummaryData {
  summary: string;
  conclusion: string;
}

export interface MoodTrendWeek {
  weekLabel: string;
  value: number; // 0–1
}

// ─── Notifications ────────────────────────────────────────────────────────────

export type NotificationType =
  | "mood"
  | "breathing"
  | "appointment"
  | "community"
  | "hydration"
  | "activity"
  | "premium";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  createdAt: string; // ISO 8601
  read: boolean;
}

// ─── Breathing ────────────────────────────────────────────────────────────────

export type BreathingPhase = "inhale" | "hold" | "exhale";

export interface BreathingPreset {
  id: string;
  name: string;
  description: string;
  inhale: number;  // seconds
  hold: number;    // seconds (0 = skip)
  exhale: number;  // seconds
}

export interface BreathingSessionConfig {
  preset: BreathingPreset;
  durationMinutes: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

// ─── Appointments Module ──────────────────────────────────────────────────────

export interface UserAppointment {
  id: string;
  professionalName: string;
  specialty: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  status: "scheduled" | "completed" | "cancelled";
  type?: string;
}

export interface CalendarAppointmentDate {
  date: string; // YYYY-MM-DD
  hasAppointments: boolean;
}

export interface Reminder {
  id: string;
  title: string;
  description: string;
  type: "hydration" | "mood" | "activity";
}

export interface DailyActivity {
  id: string;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
}

// ─── Diary ────────────────────────────────────────────────────────────────────

export type FeelingTag =
  | "alegria"
  | "tristeza"
  | "ansiedade"
  | "estresse"
  | "raiva"
  | "gratidão";

export interface DiaryEntry {
  id: string;
  content: string;
  feelings: FeelingTag[];
  imageUri?: string | null;
  createdAt: string;
}
