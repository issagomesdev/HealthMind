import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";

interface SettingsOptionCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconBg?: string;
  title: string;
  description: string;
  onPress: () => void;
  isLast?: boolean;
  danger?: boolean;
}

export function SettingsOptionCard({
  icon,
  iconColor,
  iconBg,
  title,
  description,
  onPress,
  isLast = false,
  danger = false,
}: SettingsOptionCardProps) {
  const { colors } = useTheme();
  const resolvedColor = danger ? colors.error : (iconColor ?? colors.secondary);
  const resolvedBg = iconBg ?? (danger ? colors.error + "18" : colors.secondary + "18");

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className={`flex-row items-center gap-4 px-5 py-4 ${
        !isLast ? "border-b border-border dark:border-border-dark" : ""
      }`}
    >
      <View
        className="w-10 h-10 rounded-2xl items-center justify-center"
        style={{ backgroundColor: resolvedBg }}
      >
        <Ionicons name={icon} size={20} color={resolvedColor} />
      </View>

      <View className="flex-1 gap-0.5">
        <AppText
          variant="bodyMedium"
          className="font-semibold"
          color={danger ? "error" : "default"}
        >
          {title}
        </AppText>
        <AppText variant="small" color="muted">
          {description}
        </AppText>
      </View>

      {!danger && (
        <Ionicons name="chevron-forward" size={18} color={colors.subtle} />
      )}
    </TouchableOpacity>
  );
}
