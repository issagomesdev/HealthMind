import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../ui/AppText";
import { ObservationPriority } from "../../../../types/patient";

type PriorityConfig = {
  color: string;
  bg: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const PRIORITY_CONFIG: Record<ObservationPriority, PriorityConfig> = {
  Baixa:   { color: "#6DBF7B", bg: "#6DBF7B20", icon: "arrow-down-outline" },
  Média:   { color: "#60A5FA", bg: "#60A5FA20", icon: "remove-outline" },
  Alta:    { color: "#F59E0B", bg: "#F59E0B20", icon: "arrow-up-outline" },
  Urgente: { color: "#EF4444", bg: "#EF444420", icon: "flash-outline" },
};

interface ObservationPriorityBadgeProps {
  priority: ObservationPriority;
  size?: "sm" | "md";
}

export function ObservationPriorityBadge({ priority, size = "md" }: ObservationPriorityBadgeProps) {
  const cfg = PRIORITY_CONFIG[priority];
  const fontSize = size === "sm" ? 11 : 12;
  const iconSize = size === "sm" ? 11 : 12;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: cfg.bg,
        borderRadius: 99,
        paddingHorizontal: size === "sm" ? 8 : 10,
        paddingVertical: size === "sm" ? 3 : 4,
        alignSelf: "flex-start",
      }}
    >
      <Ionicons name={cfg.icon} size={iconSize} color={cfg.color} />
      <AppText style={{ color: cfg.color, fontWeight: "700", fontSize }}>{priority}</AppText>
    </View>
  );
}

export function getPriorityConfig(priority: ObservationPriority): PriorityConfig {
  return PRIORITY_CONFIG[priority];
}
