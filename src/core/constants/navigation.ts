import { Ionicons } from "@expo/vector-icons";

export type NavRoute =
  | "home"
  | "diary"
  | "activities"
  | "patients"
  | "calendar"
  | "community"
  | "profile";

export interface NavItem {
  label: string;
  route: NavRoute;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
}

export const PATIENT_TABS: NavItem[] = [
  { label: "Home",        route: "home",       icon: "home-outline",        activeIcon: "home"        },
  { label: "Diário",      route: "diary",      icon: "book-outline",        activeIcon: "book"        },
  { label: "Atividades",  route: "activities", icon: "fitness-outline",     activeIcon: "fitness"     },
  { label: "Comunidade",  route: "community",  icon: "chatbubbles-outline", activeIcon: "chatbubbles" },
  { label: "Perfil",      route: "profile",    icon: "person-outline",      activeIcon: "person"      },
];

export const PROFESSIONAL_TABS: NavItem[] = [
  { label: "Home",       route: "home",      icon: "home-outline",        activeIcon: "home"        },
  { label: "Pacientes",  route: "patients",  icon: "people-outline",      activeIcon: "people"      },
  { label: "Agenda",     route: "calendar",  icon: "calendar-outline",    activeIcon: "calendar"    },
  { label: "Comunidade", route: "community", icon: "chatbubbles-outline", activeIcon: "chatbubbles" },
  { label: "Perfil",     route: "profile",   icon: "person-outline",      activeIcon: "person"      },
];
