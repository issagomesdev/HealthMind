import React from "react";
import { View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { ReportSkeletonCard } from "./ReportSkeletonCard";
import { useTheme } from "../../../core/theme";
import type { ReportsDashboardSummary } from "../../../types/reports";

interface CardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  color?: string;
  badge?: string;
  width: number;
}

function SummaryCard({ icon, label, value, color, badge, width }: CardProps) {
  const { colors } = useTheme();
  const iconColor = color ?? colors.secondary;

  return (
    <View
      style={{
        width,
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 14,
        marginBottom: 8,
      }}
    >
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          backgroundColor: iconColor + "18",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <Ionicons name={icon} size={18} color={iconColor} />
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <AppText style={{ fontSize: 22, fontWeight: "800", color: colors.content }}>
          {value}
        </AppText>
        {badge ? (
          <View
            style={{
              backgroundColor: colors.secondary + "20",
              borderRadius: 8,
              paddingHorizontal: 5,
              paddingVertical: 2,
            }}
          >
            <AppText style={{ fontSize: 10, fontWeight: "700", color: colors.secondary }}>
              {badge}
            </AppText>
          </View>
        ) : null}
      </View>
      <AppText style={{ fontSize: 12, color: colors.subtle, marginTop: 3 }}>
        {label}
      </AppText>
    </View>
  );
}

interface ReportSummaryCardsProps {
  summary: ReportsDashboardSummary;
  isLoading: boolean;
}

export function ReportSummaryCards({ summary, isLoading }: ReportSummaryCardsProps) {
  const { colors } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const cardWidth = (screenWidth - 48) / 2 - 4;

  if (isLoading) {
    return (
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <ReportSkeletonCard key={i} height={110} width={cardWidth} borderRadius={16} />
        ))}
      </View>
    );
  }

  const cards: CardProps[] = [
    {
      icon: "people-outline",
      label: "Pacientes Ativos",
      value: String(summary.activePatients),
      color: colors.secondary,
      width: cardWidth,
    },
    {
      icon: "calendar-outline",
      label: "Consultas Realizadas",
      value: String(summary.consultationsCompleted),
      width: cardWidth,
    },
    {
      icon: "happy-outline",
      label: "Média de Humor",
      value: summary.averageMood.toFixed(1),
      badge: `+${summary.moodTrend}%`,
      width: cardWidth,
    },
    {
      icon: "warning-outline",
      label: "Alertas Recentes",
      value: String(summary.recentAlerts),
      color: summary.recentAlerts > 0 ? colors.error : colors.secondary,
      width: cardWidth,
    },
    {
      icon: "fitness-outline",
      label: "Atividades Concluídas",
      value: String(summary.activitiesCompleted),
      width: cardWidth,
    },
    {
      icon: "book-outline",
      label: "Diários Registrados",
      value: String(summary.diaryEntries),
      width: cardWidth,
    },
  ];

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
      {cards.map((card) => (
        <SummaryCard key={card.label} {...card} />
      ))}
    </View>
  );
}
