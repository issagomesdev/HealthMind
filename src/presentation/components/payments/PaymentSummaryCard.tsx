import React from "react";
import { View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";
import type { PaymentSummary } from "../../../types/payment";

const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

interface MiniCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  value: string;
  sub?: string;
  badge?: string;
  badgeColor?: string;
}

function MiniCard({ icon, iconColor, label, value, sub, badge, badgeColor }: MiniCardProps) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginRight: 12,
        width: 148,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: iconColor + "22",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <AppText
        style={{ fontSize: 18, fontWeight: "800", color: colors.content }}
        numberOfLines={1}
      >
        {value}
      </AppText>
      {sub ? (
        <AppText style={{ fontSize: 11, color: colors.subtle, marginTop: 2 }}>
          {sub}
        </AppText>
      ) : null}
      {badge ? (
        <View
          style={{
            alignSelf: "flex-start",
            backgroundColor: (badgeColor ?? "#D1FAE5"),
            borderRadius: 999,
            paddingHorizontal: 6,
            paddingVertical: 2,
            marginTop: 4,
          }}
        >
          <AppText style={{ fontSize: 10, fontWeight: "700", color: badgeColor ? "#fff" : "#065F46" }}>
            {badge}
          </AppText>
        </View>
      ) : null}
      <AppText
        style={{ fontSize: 12, color: colors.subtle, marginTop: 6 }}
        numberOfLines={2}
      >
        {label}
      </AppText>
    </View>
  );
}

interface PaymentSummaryCardProps {
  summary: PaymentSummary;
  userRole: "patient" | "professional";
}

export function PaymentSummaryCard({ summary, userRole }: PaymentSummaryCardProps) {
  const { colors } = useTheme();

  const planStatusColors: Record<string, string> = {
    active: "#065F46",
    expiring: "#92400E",
    cancelled: "#6B7280",
  };

  const planStatusLabels: Record<string, string> = {
    active: "Ativo",
    expiring: "Expirando",
    cancelled: "Cancelado",
  };

  const trendColor =
    (summary.revenueTrend ?? 0) >= 0 ? colors.secondary : colors.error;

  const cards: MiniCardProps[] =
    userRole === "patient"
      ? [
          {
            icon: "star-outline",
            iconColor: colors.accent,
            label: "Plano atual",
            value: summary.currentPlan ?? "—",
            badge: planStatusLabels[summary.planStatus ?? "active"],
            badgeColor: planStatusColors[summary.planStatus ?? "active"],
          },
          {
            icon: "calendar-outline",
            iconColor: colors.secondary,
            label: "Próx. cobrança",
            value: summary.nextBillingAmount
              ? formatBRL(summary.nextBillingAmount)
              : "—",
            sub: summary.nextBillingDate
              ? formatDate(summary.nextBillingDate)
              : undefined,
          },
          {
            icon: "time-outline",
            iconColor: colors.error,
            label: "Pendentes",
            value: String(summary.pendingCount ?? 0),
            sub: summary.pendingAmount
              ? formatBRL(summary.pendingAmount)
              : undefined,
          },
          {
            icon: "checkmark-circle-outline",
            iconColor: colors.secondary,
            label: "Pago no mês",
            value: summary.paidThisMonth
              ? formatBRL(summary.paidThisMonth)
              : "R$ 0,00",
          },
        ]
      : [
          {
            icon: "trending-up-outline",
            iconColor: colors.secondary,
            label: "Receita do mês",
            value: summary.revenueThisMonth
              ? formatBRL(summary.revenueThisMonth)
              : "—",
            badge:
              summary.revenueTrend !== undefined
                ? `${summary.revenueTrend >= 0 ? "+" : ""}${summary.revenueTrend}%`
                : undefined,
            badgeColor: trendColor,
          },
          {
            icon: "wallet-outline",
            iconColor: colors.accent,
            label: "A receber",
            value: summary.toReceive ? formatBRL(summary.toReceive) : "R$ 0,00",
          },
          {
            icon: "time-outline",
            iconColor: colors.error,
            label: "Pendentes",
            value: String(summary.professionalPendingCount ?? 0),
            sub: summary.professionalPendingAmount
              ? formatBRL(summary.professionalPendingAmount)
              : undefined,
          },
          {
            icon: "arrow-up-circle-outline",
            iconColor: colors.primary,
            label: "Repasses",
            value: String(summary.completedPayouts ?? 0),
            sub: "concluídos",
          },
        ];

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}
    >
      {cards.map((card, idx) => (
        <MiniCard key={idx} {...card} />
      ))}
    </ScrollView>
  );
}
