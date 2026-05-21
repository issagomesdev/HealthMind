/**
 * Centralized route constants for the entire app.
 * All navigation calls should reference these instead of raw strings.
 */
export const ROUTES = {
  // ── Tabs ────────────────────────────────────────────────────────────────────
  HOME:                   "/(protected)/(tabs)/home",
  DIARY:                  "/(protected)/(tabs)/diary",
  ACTIVITIES:             "/(protected)/(tabs)/activities",
  COMMUNITY:              "/(protected)/(tabs)/community",
  PROFILE:                "/(protected)/(tabs)/profile",

  // ── Professional tabs ────────────────────────────────────────────────────────
  PATIENTS:               "/(protected)/(tabs)/patients",

  // ── Professional screens ─────────────────────────────────────────────────────
  ADD_PATIENT:             "/(protected)/add-patient",
  PATIENT_DETAILS:         "/(protected)/patient-details",
  PATIENT_CHAT:            "/(protected)/patient-chat",
  ADD_PATIENT_OBSERVATION: "/(protected)/add-patient-observation",

  // ── Protected screens ────────────────────────────────────────────────────────
  SETTINGS:               "/(protected)/settings",
  CHECKIN:                "/(protected)/checkin",
  DIARY_CREATE:           "/(protected)/diary-create",
  COMMUNITY_CREATE:       "/(protected)/community-create",
  BREATHING:              "/(protected)/breathing",
  MOOD_INSIGHTS:          "/(protected)/mood-insights",
  NOTIFICATIONS:          "/(protected)/notifications",
  APPOINTMENTS:           "/(protected)/appointments",
  FIND_PROFESSIONAL:      "/(protected)/find-professional",

  // ── Gamification ─────────────────────────────────────────────────────────────
  LEVELS_BENEFITS:        "/(protected)/levels-benefits",

  // ── Chat ─────────────────────────────────────────────────────────────────────
  CHAT_CONVERSATION:      "/(protected)/chat-conversation",
  SIMULATED_CALL:         "/(protected)/simulated-call",

  // ── Profile / Settings sub-screens ──────────────────────────────────────────
  PROFILE_FORM:           "/(protected)/profile-form",
  PROFILE_ACCOUNT:        "/(protected)/profile-account",
  PROFILE_PRIVACY:        "/(protected)/profile-privacy",
  PROFILE_NOTIFICATIONS:  "/(protected)/profile-notifications",
  PROFILE_SUBSCRIPTION:   "/(protected)/profile-subscription",
  PROFILE_HELP:           "/(protected)/profile-help",

  // ── Auth ─────────────────────────────────────────────────────────────────────
  LOGIN:                  "/(auth)/login",
  REGISTER:               "/(auth)/register",

  // ── Onboarding de perfil ─────────────────────────────────────────────────────
  PATIENT_ONBOARDING:     "/(protected)/patient-onboarding",
  PROFESSIONAL_ONBOARDING: "/(protected)/professional-onboarding",
  ONBOARDING_COMPLETE:    "/(protected)/onboarding-complete",
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
