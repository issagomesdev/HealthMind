import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../ui/AppText";
import { useTheme } from "../../../../core/theme";
import type {
  UnavailablePeriod,
  UnavailableReason,
} from "../../../../types/professionalAvailability";

const REASON_LABELS: Record<UnavailableReason, string> = {
  viagem: "Viagem",
  evento: "Evento",
  ferias: "Férias",
  compromisso_pessoal: "Compromisso pessoal",
  outro: "Outro",
};

const REASON_COLORS: Record<UnavailableReason, string> = {
  viagem: "#60A5FA",
  evento: "#F59E0B",
  ferias: "#6DBF7B",
  compromisso_pessoal: "#C084FC",
  outro: "#94A3B8",
};

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
}

interface UnavailablePeriodCardProps {
  period: UnavailablePeriod;
  onRemove: () => void;
}

export function UnavailablePeriodCard({
  period,
  onRemove,
}: UnavailablePeriodCardProps) {
  const { colors } = useTheme();
  const badgeColor = REASON_COLORS[period.reason];
  const isPartialDay = period.startTime || period.endTime;

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 14,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: colors.border,
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      {/* Left bar */}
      <View
        style={{
          width: 3,
          borderRadius: 2,
          backgroundColor: badgeColor,
          alignSelf: "stretch",
        }}
      />

      {/* Content */}
      <View style={{ flex: 1, gap: 4 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 8,
              backgroundColor: badgeColor + "22",
            }}
          >
            <AppText
              style={{ fontSize: 11, fontWeight: "700", color: badgeColor }}
            >
              {REASON_LABELS[period.reason]}
            </AppText>
          </View>
        </View>

        <AppText style={{ fontSize: 13, fontWeight: "600", color: colors.content }}>
          {formatDate(period.startDate)}
          {period.startDate !== period.endDate
            ? ` até ${formatDate(period.endDate)}`
            : ""}
        </AppText>

        {isPartialDay && (
          <AppText style={{ fontSize: 12, color: colors.subtle }}>
            {period.startTime ?? ""}{" "}
            {period.endTime ? `até ${period.endTime}` : ""}
          </AppText>
        )}

        {period.note ? (
          <AppText style={{ fontSize: 12, color: colors.subtle }}>
            {period.note}
          </AppText>
        ) : null}
      </View>

      {/* Remove button */}
      <TouchableOpacity
        onPress={onRemove}
        activeOpacity={0.7}
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: colors.error + "18",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="trash-outline" size={15} color={colors.error} />
      </TouchableOpacity>
    </View>
  );
}
