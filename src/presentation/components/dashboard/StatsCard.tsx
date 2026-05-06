import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";

interface StatsCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  subtitle?: string;
  variant?: "default" | "highlighted";
}

export function StatsCard({
  icon,
  label,
  value,
  subtitle,
  variant = "default",
}: StatsCardProps) {
  const { colors } = useTheme();
  const isHighlighted = variant === "highlighted";

  return (
    <View
      className={`rounded-2xl p-5 flex-row items-start justify-between ${
        isHighlighted
          ? "bg-secondary dark:bg-secondary-dark"
          : "bg-surface dark:bg-surface-dark"
      }`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isHighlighted ? 0.15 : 0.08,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      <View className="gap-1 flex-1">
        <View
          className={`w-10 h-10 rounded-xl items-center justify-center mb-1 ${
            isHighlighted ? "bg-white/20" : "bg-secondary/10 dark:bg-secondary-dark/20"
          }`}
        >
          <Ionicons
            name={icon}
            size={22}
            color={isHighlighted ? "#fff" : colors.secondary}
          />
        </View>
        <AppText
          variant="bodyMedium"
          className={`font-semibold ${isHighlighted ? "text-white" : ""}`}
          color={isHighlighted ? "white" : "default"}
        >
          {label}
        </AppText>
        {subtitle && (
          <AppText
            variant="small"
            className={isHighlighted ? "text-white/80" : ""}
            color={isHighlighted ? "white" : "muted"}
          >
            {subtitle}
          </AppText>
        )}
      </View>

      <AppText
        variant="heading1"
        className={`font-bold ${isHighlighted ? "text-white" : ""}`}
        color={isHighlighted ? "white" : "default"}
      >
        {String(value)}
      </AppText>
    </View>
  );
}
