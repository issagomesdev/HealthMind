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
import { useRouter } from "expo-router";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";
import { useAuth } from "../../../core/auth/AuthContext";
import { useNavigationContext } from "../../context/NavigationContext";
import { ROUTES } from "../../../core/constants/routes";

const MENU_ITEMS: Array<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route: string;
  highlight: boolean;
}> = [
  {
    icon: "search-outline",
    label: "Encontrar um profissional",
    route: ROUTES.FIND_PROFESSIONAL,
    highlight: true,
  },
  {
    icon: "calendar-outline",
    label: "Consultas",
    route: ROUTES.APPOINTMENTS,
    highlight: false,
  },
  {
    icon: "partly-sunny-outline",
    label: "Respiração Guiada",
    route: ROUTES.BREATHING,
    highlight: false,
  },
  // {
  //   icon: "notifications-outline",
  //   label: "Notificações",
  //   route: ROUTES.NOTIFICATIONS, // notification feed, not settings
  //   highlight: false,
  // },
  // {
  //   icon: "lock-closed-outline",
  //   label: "Privacidade do diário",
  //   route: ROUTES.PROFILE_PRIVACY,
  //   highlight: false,
  // },
  {
    icon: "help-circle-outline",
    label: "Ajuda & Suporte",
    route: ROUTES.PROFILE_HELP,
    highlight: false,
  },
  // {
  //   icon: "settings-outline",
  //   label: "Configurações",
  //   route: ROUTES.SETTINGS,
  //   highlight: false,
  // },
];

export function SideMenu() {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isMenuVisible, slideAnim, backdropAnim, closeMenu } = useNavigationContext();

  const handleNavigate = (route: string) => {
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
        {/* Animated drawer panel */}
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
            <AppText variant="small" color="muted" className="mt-0.5">
              {user?.email ?? "—"}
            </AppText>
            <View className="self-start px-2.5 py-1 rounded-full mt-2 bg-secondary/12 dark:bg-secondary-dark/20">
              <AppText variant="caption" color="secondary" className="font-semibold">
                {user?.role === "professional" ? "Profissional" : "Paciente"}
              </AppText>
            </View>
          </View>

          {/* Divider */}
          <View className="h-px bg-border dark:bg-border-dark mx-6 mb-3" />

          {/* Menu items */}
          <View className="px-3 flex-1 gap-0.5">
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.label}
                activeOpacity={0.7}
                onPress={() => handleNavigate(item.route)}
                className="flex-row items-center gap-3 px-4 py-3.5 rounded-xl active:bg-muted dark:active:bg-muted-dark"
              >
                <View
                  className="w-8 h-8 rounded-lg items-center justify-center"
                  style={{
                    backgroundColor: item.highlight
                      ? colors.secondary + "22"
                      : colors.secondary + "1a",
                  }}
                >
                  <Ionicons
                    name={item.icon}
                    size={17}
                    color={item.highlight ? colors.secondary : colors.secondary}
                  />
                </View>
                <AppText
                  variant="bodyMedium"
                  color={item.highlight ? "secondary" : "default"}
                  className={item.highlight ? "font-semibold" : ""}
                >
                  {item.label}
                </AppText>
              </TouchableOpacity>
            ))}
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
