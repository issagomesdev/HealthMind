import React from "react";
import { View } from "react-native";
import { AppText } from "../ui/AppText";
import type { PatientReportStatus } from "../../../types/reports";

const STATUS_CONFIG: Record<
  PatientReportStatus,
  { label: string; bg: string; text: string }
> = {
  stable: { label: "Estável", bg: "#D1FAE5", text: "#059669" },
  attention: { label: "Atenção", bg: "#FEF3C7", text: "#D97706" },
  critical: { label: "Crítico", bg: "#FEE2E2", text: "#DC2626" },
};

interface PatientReportStatusBadgeProps {
  status: PatientReportStatus;
}

export function PatientReportStatusBadge({ status }: PatientReportStatusBadgeProps) {
  const cfg = STATUS_CONFIG[status];

  return (
    <View
      style={{
        backgroundColor: cfg.bg,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
        alignSelf: "flex-start",
      }}
    >
      <AppText
        style={{ fontSize: 11, fontWeight: "700", color: cfg.text }}
      >
        {cfg.label}
      </AppText>
    </View>
  );
}
