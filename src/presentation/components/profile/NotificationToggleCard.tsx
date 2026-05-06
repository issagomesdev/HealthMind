import React from "react";
import { View, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";

interface NotificationToggleCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
  isLast?: boolean;
}

export function NotificationToggleCard({
  icon,
  title,
  description,
  value,
  onChange,
  isLast = false,
}: NotificationToggleCardProps) {
  const { colors } = useTheme();

  return (
    <View
      className={`flex-row items-center gap-4 px-5 py-4 ${
        !isLast ? "border-b border-border dark:border-border-dark" : ""
      }`}
    >
      <View
        className="w-10 h-10 rounded-2xl items-center justify-center"
        style={{ backgroundColor: colors.secondary + "18" }}
      >
        <Ionicons name={icon} size={20} color={colors.secondary} />
      </View>

      <View className="flex-1 gap-0.5">
        <AppText variant="bodyMedium" className="font-semibold">
          {title}
        </AppText>
        <AppText variant="small" color="muted">
          {description}
        </AppText>
      </View>

      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.secondary + "88" }}
        thumbColor={value ? colors.secondary : colors.subtle}
        ios_backgroundColor={colors.border}
      />
    </View>
  );
}
