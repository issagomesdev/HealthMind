import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../ui/AppText";
import { useTheme } from "../../../../core/theme";
import type { EmotionalAlert } from "../../../../types/evolution";

interface Props {
  alert: EmotionalAlert;
  onPress?: () => void;
  onDismiss?: () => void;
}

const TYPE_CONFIG: Record<
  EmotionalAlert["type"],
  { icon: keyof typeof Ionicons.glyphMap; color: string }
> = {
  high_risk: { icon: "alert-outline", color: "#DC2626" },
  mood_drop: { icon: "trending-down-outline", color: "#EA580C" },
  no_checkin: { icon: "time-outline", color: "#D97706" },
  anxiety_spike: { icon: "pulse-outline", color: "#DC2626" },
  disengagement: { icon: "person-remove-outline", color: "#9CA3AF" },
  behavioral_change: { icon: "git-compare-outline", color: "#7C3AED" },
};

const SEVERITY_CONFIG: Record<
  EmotionalAlert["severity"],
  { bg: string; text: string; label: string }
> = {
  low: { bg: "#F3F4F6", text: "#6B7280", label: "Baixa" },
  medium: { bg: "#FEF3C7", text: "#92400E", label: "Média" },
  high: { bg: "#FFEDD5", text: "#9A3412", label: "Alta" },
  critical: { bg: "#FEE2E2", text: "#991B1B", label: "Crítica" },
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = Date.now();
  const diff = now - d.getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (hours < 1) return "Agora mesmo";
  if (hours < 24) return `${hours}h atrás`;
  if (days === 1) return "Ontem";
  return `${days} dias atrás`;
}

export function EmotionalAlertCard({ alert, onPress, onDismiss }: Props) {
  const { colors } = useTheme();
  const typeCfg = TYPE_CONFIG[alert.type];
  const sevCfg = SEVERITY_CONFIG[alert.severity];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="rounded-2xl mb-3 p-4"
      style={{
        backgroundColor: colors.surface,
        borderLeftWidth: 4,
        borderLeftColor: typeCfg.color,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View className="flex-row items-start" style={{ gap: 12 }}>
        {/* Icon */}
        <View
          className="w-10 h-10 rounded-xl items-center justify-center"
          style={{ backgroundColor: typeCfg.color + "18" }}
        >
          <Ionicons name={typeCfg.icon} size={20} color={typeCfg.color} />
        </View>

        {/* Content */}
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <AppText style={{ fontSize: 13, fontWeight: "700", color: colors.content, flex: 1 }}>
              {alert.title}
            </AppText>
            <View
              className="rounded-full px-2 py-0.5 ml-2"
              style={{ backgroundColor: sevCfg.bg }}
            >
              <AppText style={{ fontSize: 10, fontWeight: "700", color: sevCfg.text }}>
                {sevCfg.label}
              </AppText>
            </View>
          </View>

          <AppText variant="caption" style={{ color: colors.secondary, fontWeight: "600", marginBottom: 4 }}>
            {alert.patientName}
          </AppText>

          <AppText variant="caption" style={{ color: colors.subtle }}>
            {alert.description}
          </AppText>

          <View className="flex-row items-center justify-between mt-2">
            <AppText variant="caption" style={{ color: colors.subtle }}>
              {formatTime(alert.triggeredAt)}
            </AppText>
            {onDismiss ? (
              <TouchableOpacity
                onPress={onDismiss}
                className="flex-row items-center"
                style={{ gap: 3 }}
              >
                <Ionicons name="checkmark-outline" size={13} color={colors.subtle} />
                <AppText variant="caption" style={{ color: colors.subtle }}>
                  Marcar como lido
                </AppText>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
