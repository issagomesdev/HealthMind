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
  onBackPress?: () => void;
  rightAction?: React.ReactNode;
}

export function TopBar({
  title,
  showMenu = true,
  showNotifications = true,
  onMenuPress,
  onBackPress,
  rightAction,
}: TopBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const leftAction = onBackPress ?? (showMenu ? onMenuPress : undefined);
  const leftIcon = onBackPress ? "chevron-back" : "menu-outline";
  const leftSize = onBackPress ? 24 : 22;

  return (
    <View
      className="bg-background dark:bg-background-dark flex-row items-center justify-between px-4"
      style={{ paddingTop: insets.top + 6, paddingBottom: 12 }}
    >
      {/* Left — back or menu */}
      <View className="w-10 items-start">
        {leftAction && (
          <TouchableOpacity
            onPress={leftAction}
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
            <Ionicons name={leftIcon} size={leftSize} color={colors.content} />
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

      {/* Right — custom action or notification bell */}
      <View className="items-end" style={{ minWidth: 40 }}>
        {rightAction ?? (showNotifications && <NotificationBell />)}
      </View>
    </View>
  );
}
