import React from "react";
import {
  View,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, usePathname } from "expo-router";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";
import { useAuth } from "../../../core/auth/AuthContext";
import { useNavigationContext } from "../../context/NavigationContext";
import { ROUTES } from "../../../core/constants/routes";
import { ProfessionalProfile } from "../../../core/types";

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route: string;
  disabled?: boolean;
};

const PATIENT_MENU_ITEMS: MenuItem[] = [
  {
    icon: "home-outline",
    label: "Início",
    route: ROUTES.HOME,
  },
  {
    icon: "partly-sunny-outline",
    label: "Respiração Guiada",
    route: ROUTES.BREATHING,
  },
  {
    icon: "search-outline",
    label: "Encontrar um profissional",
    route: ROUTES.FIND_PROFESSIONAL,
  },
  {
    icon: "calendar-outline",
    label: "Consultas",
    route: ROUTES.APPOINTMENTS,
  },
  {
    icon: "chatbubble-outline",
    label: "Chat",
    route: "/(protected)/messages",
  },
  {
    icon: "cash-outline",
    label: "Pagamentos",
    route: "/(protected)/payments",
  },
  {
    icon: "help-circle-outline",
    label: "Ajuda & Suporte",
    route: ROUTES.PROFILE_HELP,
  },
];

const PROFESSIONAL_MENU_ITEMS: MenuItem[] = [
  {
    icon: "home-outline",
    label: "Início",
    route: ROUTES.HOME,
  },
  {
    icon: "partly-sunny-outline",
    label: "Respiração Guiada",
    route: ROUTES.BREATHING,
  },
  {
    icon: "people-outline",
    label: "Pacientes",
    route: "/(protected)/(tabs)/patients",
  },
  {
    icon: "calendar-outline",
    label: "Agenda",
    route: "/(protected)/(tabs)/calendar",
  },
  {
    icon: "stats-chart-outline",
    label: "Painel de Evolução",
    route: "/(protected)/evolution-dashboard",
  },
  {
    icon: "chatbubble-outline",
    label: "Chat",
    route: "/(protected)/messages",
  },
  {
    icon: "cash-outline",
    label: "Pagamentos",
    route: "/(protected)/payments",
  },
  {
    icon: "document-text-outline",
    label: "Relatórios",
    route: "/(protected)/reports",
  },
  {
    icon: "help-circle-outline",
    label: "Ajuda & Suporte",
    route: "/(protected)/professional-help",
  },
];

// Strips Expo Router group segments like (protected), (tabs) to get the visible URL segment.
function normalizeRoute(route: string): string {
  return route.replace(/\/\([^)]+\)/g, "") || "/";
}

function isMenuItemActive(pathname: string, itemRoute: string): boolean {
  const normalized = normalizeRoute(itemRoute);
  if (normalized === "/") return pathname === "/";
  return pathname === normalized || pathname.startsWith(normalized + "/");
}

export function SideMenu() {
  const { colors } = useTheme();
  const { user, profile, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const { isMenuVisible, slideAnim, backdropAnim, closeMenu } = useNavigationContext();

  const isProfessional = user?.role === "professional";
  const professionalProfile = isProfessional ? (profile as ProfessionalProfile) : null;
  const MENU_ITEMS = isProfessional ? PROFESSIONAL_MENU_ITEMS : PATIENT_MENU_ITEMS;

  const handleNavigate = (route: string, disabled?: boolean) => {
    if (disabled) return;
    closeMenu();
    router.push(route as any);
  };

  const handleLogout = () => {
    closeMenu();
    logout();
  };

  return (
    <Modal
      visible={isMenuVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={closeMenu}
    >
      <View className="flex-1 flex-row">
        <Animated.View
          className="w-[288px] bg-surface dark:bg-surface-dark"
          style={{
            transform: [{ translateX: slideAnim }],
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            shadowColor: "#000",
            shadowOffset: { width: 4, height: 0 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 16,
          }}
        >
          {/* Close button */}
          <TouchableOpacity
            onPress={closeMenu}
            activeOpacity={0.7}
            className="absolute right-4 w-9 h-9 rounded-full bg-muted dark:bg-muted-dark items-center justify-center"
            style={{ top: insets.top + 12 }}
          >
            <Ionicons name="close" size={18} color={colors.subtle} />
          </TouchableOpacity>

          {/* User section */}
          <View className="px-6 pt-5 pb-6">
            <View
              className="w-16 h-16 rounded-full bg-secondary/15 dark:bg-secondary-dark/25 items-center justify-center mb-4"
            >
              <Ionicons name="person" size={30} color={colors.secondary} />
            </View>
            <AppText variant="bodyMedium" className="font-semibold">
              {user?.name ?? "—"}
            </AppText>
            {isProfessional && professionalProfile?.specialty ? (
              <AppText variant="small" color="muted" className="mt-0.5">
                {professionalProfile.specialty}
              </AppText>
            ) : (
              <AppText variant="small" color="muted" className="mt-0.5">
                {user?.email ?? "—"}
              </AppText>
            )}
            <View className="self-start px-2.5 py-1 rounded-full mt-2 bg-secondary/12 dark:bg-secondary-dark/20">
              <AppText variant="caption" color="secondary" className="font-semibold">
                {isProfessional ? "Profissional" : "Paciente"}
              </AppText>
            </View>
          </View>

          {/* Divider */}
          <View className="h-px bg-border dark:bg-border-dark mx-6 mb-3" />

          {/* Menu items */}
          <View className="px-3 flex-1 gap-0.5">
            {MENU_ITEMS.map((item) => {
              const isActive = isMenuItemActive(pathname, item.route);
              return (
                <TouchableOpacity
                  key={item.label}
                  activeOpacity={item.disabled ? 1 : 0.7}
                  onPress={() => handleNavigate(item.route, item.disabled)}
                  style={[
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                      paddingHorizontal: 16,
                      paddingVertical: 14,
                      borderRadius: 12,
                    },
                    isActive && { backgroundColor: colors.secondary + "18" },
                    item.disabled && { opacity: 0.4 },
                  ]}
                >
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 8,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isActive
                        ? colors.secondary + "28"
                        : colors.secondary + "1a",
                    }}
                  >
                    <Ionicons
                      name={item.icon}
                      size={17}
                      color={colors.secondary}
                    />
                  </View>
                  <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <AppText
                      variant="bodyMedium"
                      color={isActive ? "secondary" : "default"}
                      style={isActive ? { fontWeight: "700" } : undefined}
                    >
                      {item.label}
                    </AppText>
                    {item.disabled && (
                      <View
                        className="rounded-full px-1.5 py-0.5"
                        style={{ backgroundColor: colors.muted }}
                      >
                        <AppText style={{ fontSize: 9, fontWeight: "700", color: colors.subtle }}>
                          EM BREVE
                        </AppText>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Logout */}
          <View className="px-6 pb-4 pt-3">
            <View className="h-px bg-border dark:bg-border-dark mb-4" />
            <TouchableOpacity
              onPress={handleLogout}
              activeOpacity={0.8}
              className="flex-row items-center gap-3 px-4 py-3.5 rounded-xl bg-error/8 dark:bg-error-dark/10"
            >
              <View className="w-8 h-8 rounded-lg bg-error/15 dark:bg-error-dark/15 items-center justify-center">
                <Ionicons name="log-out-outline" size={17} color={colors.error} />
              </View>
              <AppText variant="bodyMedium" color="error">
                Sair da conta
              </AppText>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Backdrop */}
        <TouchableWithoutFeedback onPress={closeMenu}>
          <Animated.View
            className="flex-1"
            style={{ backgroundColor: "rgba(0,0,0,0.5)", opacity: backdropAnim }}
          />
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
}
