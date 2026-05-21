import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { useTheme } from "../../../core/theme";
import type { PaymentTransaction, PaymentType } from "../../../types/payment";

const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const TYPE_ICON: Record<PaymentType, keyof typeof Ionicons.glyphMap> = {
  subscription: "star-outline",
  premium_plan: "star-outline",
  renewal: "refresh-outline",
  upgrade: "trending-up-outline",
  appointment: "calendar-outline",
  extra_charge: "cash-outline",
  payout: "arrow-up-circle-outline",
  contract: "document-text-outline",
  refund: "return-down-back-outline",
};

const TYPE_COLOR: Record<string, string> = {
  subscription: "#7C3AED",
  premium_plan: "#7C3AED",
  renewal: "#7C3AED",
  upgrade: "#7C3AED",
  appointment: "#2A9D8F",
  extra_charge: "#F59E0B",
  payout: "#6D28D9",
  contract: "#059669",
  refund: "#6B7280",
};

interface PaymentHistoryCardProps {
  transaction: PaymentTransaction;
  onPress: () => void;
  userRole: "patient" | "professional";
}

export function PaymentHistoryCard({
  transaction,
  onPress,
  userRole,
}: PaymentHistoryCardProps) {
  const { colors } = useTheme();
  const icon = TYPE_ICON[transaction.type] ?? "cash-outline";
  const iconColor = TYPE_COLOR[transaction.type] ?? colors.secondary;

  const isExpense = userRole === "patient";
  const isPayout = transaction.type === "payout";
  const isAmountNegative = transaction.amount < 0;
  const isPositive =
    transaction.status === "paid" ||
    transaction.status === "received" ||
    transaction.status === "approved";

  let amountColor = colors.content;
  if (isAmountNegative) amountColor = "#EF4444";
  else if (isPositive) amountColor = "#065F46";
  else if (transaction.status === "overdue") amountColor = "#F97316";
  else if (transaction.status === "pending") amountColor = "#D97706";

  let amountPrefix = isExpense ? "− " : "+ ";
  if (isPayout) amountPrefix = "↑ ";
  if (transaction.status === "refunded") amountPrefix = "+ ";
  if (isAmountNegative) amountPrefix = "";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.surface,
      }}
    >
      {/* Icon */}
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: iconColor + "1A",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>

      {/* Middle */}
      <View style={{ flex: 1, gap: 2 }}>
        <AppText
          style={{ fontSize: 15, fontWeight: "700", color: colors.content }}
          numberOfLines={1}
        >
          {transaction.description}
        </AppText>
        <AppText style={{ fontSize: 13, color: colors.subtle }} numberOfLines={1}>
          {transaction.relatedPersonName}
        </AppText>
        <AppText style={{ fontSize: 12, color: colors.subtle }}>
          {formatDate(transaction.date)}
        </AppText>
      </View>

      {/* Right */}
      <View style={{ alignItems: "flex-end", gap: 4 }}>
        <AppText
          style={{ fontSize: 15, fontWeight: "700", color: amountColor }}
        >
          {amountPrefix}
          {formatBRL(transaction.amount)}
        </AppText>
        <PaymentStatusBadge status={transaction.status} size="sm" />
      </View>
    </TouchableOpacity>
  );
}
