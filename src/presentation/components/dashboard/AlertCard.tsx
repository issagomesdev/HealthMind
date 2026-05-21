import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { EmotionalAlert } from "../../../core/types";

interface AlertCardProps {
  alert: EmotionalAlert;
  onAction?: () => void;
}

const severityConfig = {
  high: {
    bg: "bg-red-50 dark:bg-red-950/40",
    nameCls: "text-red-600 dark:text-red-400",
    btnCls: "border border-red-200 dark:border-red-800",
    btnLabel: "Revisar",
    icon: "trending-down-outline" as const,
    iconColor: "#DC2626",
  },
  medium: {
    bg: "bg-blue-50 dark:bg-blue-950/40",
    nameCls: "text-blue-600 dark:text-blue-400",
    btnCls: "border border-blue-200 dark:border-blue-800",
    btnLabel: "Contatar",
    icon: "alert-circle-outline" as const,
    iconColor: "#2563EB",
  },
  low: {
    bg: "bg-surface dark:bg-surface-dark",
    nameCls: "text-content dark:text-content-dark",
    btnCls: "border border-border dark:border-border-dark",
    btnLabel: "Ver",
    icon: "information-circle-outline" as const,
    iconColor: "#64748B",
  },
};

export function AlertCard({ alert, onAction }: AlertCardProps) {
  const cfg = severityConfig[alert.severity];

  return (
    <View
      className={`${cfg.bg} rounded-2xl p-4 flex-row items-center gap-3`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
      }}
    >
      <View className="w-12 h-12 rounded-full bg-white/60 dark:bg-white/10 items-center justify-center">
        <Ionicons name="person" size={22} color={cfg.iconColor} />
      </View>

      <View className="flex-1 gap-0.5">
        <AppText variant="bodyMedium" className={`font-semibold ${cfg.nameCls}`}>
          {alert.patientName}
        </AppText>
        <View className="flex-row items-center gap-1.5" style={{ flex: 1, width: "85%" }}>
          <Ionicons name={cfg.icon} size={13} color={cfg.iconColor} style={{ flexShrink: 0 }} />
          <AppText variant="small" color="muted" numberOfLines={1} style={{ flex: 1 }}>
            {alert.message}
          </AppText>
        </View>
      </View>

      <TouchableOpacity
        onPress={onAction}
        activeOpacity={0.75}
        className={`${cfg.btnCls} rounded-full px-4 py-1.5 bg-white dark:bg-surface-dark`}
      >
        <AppText variant="smallMedium" className={cfg.nameCls}>
          {cfg.btnLabel}
        </AppText>
      </TouchableOpacity>
    </View>
  );
}
