import React, { useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AppText } from "../ui/AppText";
import { notificationsService } from "../../../services/notifications/NotificationsService";
import { useTheme } from "../../../core/theme";

export function NotificationBell() {
  const { colors } = useTheme();
  const router = useRouter();
  const [count, setCount] = useState(() => notificationsService.getUnreadCount());

  useEffect(() => {
    // Subscribe to service-level mutations so badge updates instantly
    return notificationsService.subscribe(setCount);
  }, []);

  return (
    <TouchableOpacity
      onPress={() => router.push("/(protected)/notifications")}
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
      <Ionicons name="notifications-outline" size={20} color={colors.subtle} />

      {count > 0 && (
        <View
          className="absolute -top-0.5 -right-0.5 min-w-4 h-4 rounded-full items-center justify-center px-1"
          style={{ backgroundColor: colors.error }}
        >
          <AppText
            variant="caption"
            color="white"
            style={{ fontSize: 9, lineHeight: 12, fontWeight: "700" }}
          >
            {count > 9 ? "9+" : String(count)}
          </AppText>
        </View>
      )}
    </TouchableOpacity>
  );
}
