import React from "react";
import { View, TouchableOpacity } from "react-native";
import { AppText } from "../ui/AppText";
import { PaymentStatusBadge } from "./PaymentStatusBadge";
import { useTheme } from "../../../core/theme";
import type { ExtraCharge } from "../../../types/payment";

const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

const STATUS_BORDER: Record<string, string> = {
  awaiting_acceptance: "#F59E0B",
  approved: "#10B981",
  rejected: "#9CA3AF",
  pending: "#F59E0B",
  paid: "#10B981",
  received: "#10B981",
  overdue: "#EF4444",
  cancelled: "#9CA3AF",
  refunded: "#9CA3AF",
  processing: "#F59E0B",
};

interface ExtraChargeCardProps {
  charge: ExtraCharge;
  onPress: () => void;
  userRole: "patient" | "professional";
  onAccept?: () => void;
  onReject?: () => void;
}

export function ExtraChargeCard({
  charge,
  onPress,
  userRole,
  onAccept,
  onReject,
}: ExtraChargeCardProps) {
  const { colors } = useTheme();
  const borderColor = STATUS_BORDER[charge.status] ?? "#9CA3AF";
  const showActions =
    userRole === "patient" && charge.status === "awaiting_acceptance";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderLeftWidth: 4,
        borderLeftColor: borderColor,
        padding: 16,
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
        <AppText
          style={{
            fontSize: 15,
            fontWeight: "700",
            color: colors.content,
            flex: 1,
            marginRight: 8,
          }}
        >
          {charge.title}
        </AppText>
        <PaymentStatusBadge status={charge.status} size="sm" />
      </View>

      <AppText style={{ fontSize: 13, color: colors.subtle, marginBottom: 4 }}>
        {userRole === "patient"
          ? charge.professionalName
          : charge.patientName}
      </AppText>

      <AppText
        style={{ fontSize: 13, color: colors.subtle, marginBottom: 8 }}
        numberOfLines={2}
      >
        {charge.description}
      </AppText>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <AppText
          style={{ fontSize: 18, fontWeight: "800", color: colors.content }}
        >
          {formatBRL(charge.amount)}
        </AppText>
        <AppText style={{ fontSize: 12, color: colors.subtle }}>
          Venc. {formatDate(charge.dueDate)}
        </AppText>
      </View>

      {showActions && (
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            marginTop: 12,
          }}
        >
          <TouchableOpacity
            onPress={onReject}
            activeOpacity={0.7}
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 10,
              paddingVertical: 8,
              alignItems: "center",
            }}
          >
            <AppText style={{ fontSize: 13, fontWeight: "600", color: colors.subtle }}>
              Recusar
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onAccept}
            activeOpacity={0.7}
            style={{
              flex: 1,
              backgroundColor: colors.secondary,
              borderRadius: 10,
              paddingVertical: 8,
              alignItems: "center",
            }}
          >
            <AppText style={{ fontSize: 13, fontWeight: "700", color: "#fff" }}>
              Aceitar
            </AppText>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
}
