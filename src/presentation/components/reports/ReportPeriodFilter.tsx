import React from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";
import type { ReportPeriod } from "../../../types/reports";

const PERIODS: Array<{ value: ReportPeriod; label: string }> = [
  { value: "today", label: "Hoje" },
  { value: "7d", label: "7 dias" },
  { value: "30d", label: "30 dias" },
  { value: "90d", label: "90 dias" },
  { value: "custom", label: "Personalizado" },
];

interface ReportPeriodFilterProps {
  period: ReportPeriod;
  onChange: (p: ReportPeriod) => void;
}

export function ReportPeriodFilter({ period, onChange }: ReportPeriodFilterProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}
    >
      {PERIODS.map((p) => {
        const isActive = period === p.value;
        return (
          <TouchableOpacity
            key={p.value}
            onPress={() => onChange(p.value)}
            activeOpacity={0.7}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: isActive ? colors.secondary : colors.surface,
              borderWidth: isActive ? 0 : 1,
              borderColor: colors.border,
            }}
          >
            <AppText
              style={{
                fontSize: 13,
                fontWeight: isActive ? "700" : "500",
                color: isActive ? "#ffffff" : colors.content,
              }}
            >
              {p.label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
