import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { AppNotification, NotificationType } from "../../../core/types";
import { useTheme } from "../../../core/theme";

interface NotificationCardProps {
  notification: AppNotification;
  onPress: (id: string) => void;
}

type IconConfig = {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgLight: string;
  bgDark: string;
};

const TYPE_CONFIG: Record<NotificationType, IconConfig> = {
  mood: {
    icon: "happy-outline",
    color: "#8B5CF6",
    bgLight: "#F5F3FF",
    bgDark: "#2E1065",
  },
  breathing: {
    icon: "partly-sunny-outline",
    color: "#2A9D8F",
    bgLight: "#F0FDFA",
    bgDark: "#042f2e",
  },
  appointment: {
    icon: "calendar-outline",
    color: "#4C78D9",
    bgLight: "#EFF6FF",
    bgDark: "#1e3a5f",
  },
  community: {
    icon: "chatbubbles-outline",
    color: "#F97316",
    bgLight: "#FFF7ED",
    bgDark: "#431407",
  },
  hydration: {
    icon: "water-outline",
    color: "#0EA5E9",
    bgLight: "#F0F9FF",
    bgDark: "#082f49",
  },
  activity: {
    icon: "barbell-outline",
    color: "#10B981",
    bgLight: "#ECFDF5",
    bgDark: "#022c22",
  },
  premium: {
    icon: "star-outline",
    color: "#F59E0B",
    bgLight: "#FFFBEB",
    bgDark: "#451a03",
  },
};

function formatRelativeTime(createdAt: string): string {
  const now = new Date();
  const date = new Date(createdAt);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 2) return "Agora";
  if (diffMins < 60) return `Há ${diffMins} min`;
  if (diffHours < 24) return `Há ${diffHours}h`;
  if (diffDays === 1) return "Ontem";
  return `${diffDays} dias atrás`;
}

export function NotificationCard({ notification, onPress }: NotificationCardProps) {
  const { colors, isDark } = useTheme();
  const cfg = TYPE_CONFIG[notification.type];

  const cardBg = notification.read
    ? undefined
    : isDark
    ? `${colors.secondary}10`
    : `${colors.secondary}08`;

  return (
    <TouchableOpacity
      onPress={() => onPress(notification.id)}
      activeOpacity={0.75}
      className="flex-row items-start gap-3 px-5 py-4"
      style={cardBg ? { backgroundColor: cardBg } : undefined}
    >
      {/* Icon */}
      <View
        className="w-10 h-10 rounded-2xl items-center justify-center mt-0.5 shrink-0"
        style={{
          backgroundColor: isDark ? cfg.bgDark : cfg.bgLight,
        }}
      >
        <Ionicons name={cfg.icon} size={18} color={cfg.color} />
      </View>

      {/* Content */}
      <View className="flex-1 gap-0.5">
        <View className="flex-row items-start justify-between gap-2">
          <AppText
            variant="smallMedium"
            className={`flex-1 ${notification.read ? "" : "font-bold"}`}
          >
            {notification.title}
          </AppText>
          <AppText variant="caption" color="muted" className="shrink-0 mt-0.5">
            {formatRelativeTime(notification.createdAt)}
          </AppText>
        </View>
        <AppText variant="small" color="muted" className="leading-5 pr-2">
          {notification.description}
        </AppText>
      </View>

      {/* Unread dot */}
      {!notification.read && (
        <View
          className="w-2 h-2 rounded-full mt-2 shrink-0"
          style={{ backgroundColor: colors.secondary }}
        />
      )}
    </TouchableOpacity>
  );
}
