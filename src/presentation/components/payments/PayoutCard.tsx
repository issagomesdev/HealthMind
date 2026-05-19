import React from "react";
import { View, TouchableOpacity } from "react-native";
import { AppText } from "../ui/AppText";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { useTheme } from "../../../core/theme";
import type { PaymentPayout } from "../../../types/payment";

const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

interface PayoutCardProps {
  payout: PaymentPayout;
  onPress: () => void;
}

export function PayoutCard({ payout, onPress }: PayoutCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        backgroundColor: colors.surface,
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 6,
        }}
      >
        <View style={{ flex: 1 }}>
          <AppText
            style={{ fontSize: 15, fontWeight: "700", color: colors.content }}
          >
            {formatBRL(payout.amount)}
          </AppText>
          <AppText style={{ fontSize: 12, color: colors.subtle, marginTop: 2 }}>
            {formatDate(payout.requestedAt)}
          </AppText>
        </View>
        <PaymentStatusBadge status={payout.status} size="sm" />
      </View>

      <AppText style={{ fontSize: 12, color: colors.subtle, marginBottom: 4 }}>
        {payout.method}
      </AppText>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <AppText style={{ fontSize: 11, color: colors.subtle }}>
          Taxa: {formatBRL(payout.fee)} (2,5%)
        </AppText>
        <AppText
          style={{
            fontSize: 13,
            fontWeight: "600",
            color: colors.secondary,
          }}
        >
          Líquido: {formatBRL(payout.netAmount)}
        </AppText>
      </View>
    </TouchableOpacity>
  );
}
