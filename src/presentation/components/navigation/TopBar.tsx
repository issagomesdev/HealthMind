import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "../ui/AppText";
import { NotificationBell } from "../notifications/NotificationBell";
import { useTheme } from "../../../core/theme";

interface TopBarProps {
  title?: string;
  showMenu?: boolean;
  showNotifications?: boolean;
  onMenuPress?: () => void;
}

export function TopBar({
  title,
  showMenu = true,
  showNotifications = true,
  onMenuPress,
}: TopBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-background dark:bg-background-dark flex-row items-center justify-between px-4"
      style={{ paddingTop: insets.top + 6, paddingBottom: 12 }}
    >
      {/* Left — menu */}
      <View className="w-10 items-start">
        {showMenu && (
          <TouchableOpacity
            onPress={onMenuPress}
            activeOpacity={0.7}
            className="w-9 h-9 rounded-full bg-surface dark:bg-surface-dark items-center justify-center"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <Ionicons name="menu-outline" size={22} color={colors.content} />
          </TouchableOpacity>
        )}
      </View>

      {/* Center — title */}
      {title ? (
        <AppText variant="bodyMedium" color="secondary" className="font-bold tracking-wide">
          {title}
        </AppText>
      ) : (
        <View />
      )}

      {/* Right — notification bell with live badge */}
      <View className="w-10 items-end">
        {showNotifications && <NotificationBell />}
      </View>
    </View>
  );
}
