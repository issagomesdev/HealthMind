import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../ui/AppText";
import type { EvolutionRiskLevel } from "../../../../types/evolution";

interface RiskConfig {
  label: string;
  bg: string;
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
}

const RISK_CONFIG: Record<EvolutionRiskLevel, RiskConfig> = {
  stable: {
    label: "Estável",
    bg: "#D1FAE5",
    text: "#065F46",
    icon: "checkmark-circle-outline",
    iconColor: "#059669",
  },
  attention: {
    label: "Atenção",
    bg: "#FEF3C7",
    text: "#92400E",
    icon: "warning-outline",
    iconColor: "#D97706",
  },
  high_risk: {
    label: "Risco Alto",
    bg: "#FFEDD5",
    text: "#9A3412",
    icon: "alert-circle-outline",
    iconColor: "#EA580C",
  },
  critical: {
    label: "Crítico",
    bg: "#FEE2E2",
    text: "#991B1B",
    icon: "alert-outline",
    iconColor: "#DC2626",
  },
};

interface Props {
  level: EvolutionRiskLevel;
  size?: "sm" | "md";
}

export function RiskBadge({ level, size = "md" }: Props) {
  const cfg = RISK_CONFIG[level];
  const isSmall = size === "sm";

  return (
    <View
      className="flex-row items-center rounded-full"
      style={{
        backgroundColor: cfg.bg,
        paddingHorizontal: isSmall ? 6 : 10,
        paddingVertical: isSmall ? 2 : 4,
        gap: 4,
      }}
    >
      <Ionicons name={cfg.icon} size={isSmall ? 10 : 13} color={cfg.iconColor} />
      <AppText
        style={{
          fontSize: isSmall ? 10 : 12,
          fontWeight: "700",
          color: cfg.text,
        }}
      >
        {cfg.label}
      </AppText>
    </View>
  );
}

export function getRiskColors(level: EvolutionRiskLevel) {
  return RISK_CONFIG[level];
}
