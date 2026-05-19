import React from "react";
import { View, Text } from "react-native";
import type { PaymentStatus } from "../../../types/payment";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  size?: "sm" | "md";
}

interface BadgeConfig {
  bg: string;
  text: string;
  label: string;
}

const STATUS_CONFIG: Record<PaymentStatus, BadgeConfig> = {
  paid: { bg: "#D1FAE5", text: "#065F46", label: "Pago" },
  received: { bg: "#D1FAE5", text: "#065F46", label: "Recebido" },
  approved: { bg: "#D1FAE5", text: "#065F46", label: "Aprovado" },
  pending: { bg: "#FEF3C7", text: "#92400E", label: "Pendente" },
  processing: { bg: "#FEF3C7", text: "#92400E", label: "Processando" },
  awaiting_acceptance: { bg: "#FEF3C7", text: "#92400E", label: "Aguardando" },
  overdue: { bg: "#FEE2E2", text: "#991B1B", label: "Atrasado" },
  cancelled: { bg: "#F3F4F6", text: "#6B7280", label: "Cancelado" },
  refunded: { bg: "#F3F4F6", text: "#6B7280", label: "Reembolsado" },
  rejected: { bg: "#F3F4F6", text: "#6B7280", label: "Recusado" },
};

export function PaymentStatusBadge({
  status,
  size = "md",
}: PaymentStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    bg: "#F3F4F6",
    text: "#6B7280",
    label: status,
  };

  const paddingH = size === "sm" ? 6 : 8;
  const paddingV = size === "sm" ? 2 : 3;
  const fontSize = size === "sm" ? 10 : 11;

  return (
    <View
      style={{
        backgroundColor: config.bg,
        borderRadius: 999,
        paddingHorizontal: paddingH,
        paddingVertical: paddingV,
        alignSelf: "flex-start",
      }}
    >
      <Text
        style={{
          color: config.text,
          fontSize,
          fontWeight: "700",
          lineHeight: fontSize * 1.4,
        }}
      >
        {config.label}
      </Text>
    </View>
  );
}
