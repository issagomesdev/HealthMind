import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../../core/auth/AuthContext";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";
import { PATIENT_TABS, PROFESSIONAL_TABS } from "../../../core/constants/navigation";

// Minimal interface compatible with Expo Router's Tabs.tabBar prop
interface TabRoute {
  name: string;
  key: string;
}

interface BottomTabBarExternalProps {
  state: { index: number; routes: TabRoute[] };
  navigation: { navigate: (name: string) => void };
  [key: string]: unknown;
}

export function BottomTabBar({ state, navigation }: BottomTabBarExternalProps) {
  const { user } = useAuth();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const tabs = user?.role === "professional" ? PROFESSIONAL_TABS : PATIENT_TABS;

  return (
    <View
      className="bg-surface dark:bg-surface-dark"
      style={{
        paddingBottom: insets.bottom,
        borderTopWidth: 1,
        borderTopColor: isDark ? "#374151" : "#E5E7EB",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
        elevation: 10,
      }}
    >
      <View className="flex-row h-[58px]">
        {tabs.map((tab) => {
          const routeIndex = state.routes.findIndex((r) => r.name === tab.route);
          const isActive = routeIndex !== -1 && state.index === routeIndex;

          return (
            <TouchableOpacity
              key={tab.route}
              onPress={() => navigation.navigate(tab.route)}
              activeOpacity={0.7}
              className="flex-1 items-center justify-center gap-0.5"
            >
              {isActive && (
                <View className="absolute top-0 self-center w-9 h-[3px] rounded-b-full bg-secondary dark:bg-secondary-dark" />
              )}
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon}
                size={22}
                color={isActive ? colors.secondary : colors.subtle}
              />
              <AppText
                variant="caption"
                color={isActive ? "secondary" : "muted"}
                className={isActive ? "font-semibold" : ""}
              >
                {tab.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
