import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../ui/AppText";
import { PatientObservation } from "../../../../types/patient";
import { ObservationPriorityBadge } from "./ObservationPriorityBadge";
import { useTheme } from "../../../../core/theme";

const CATEGORY_COLORS: Record<string, string> = {
  Evolução:          "#6DBF7B",
  Sessão:            "#60A5FA",
  Alerta:            "#EF4444",
  "Plano terapêutico": "#6B7EF5",
  Comportamento:     "#F59E0B",
  Pagamento:         "#9CA3AF",
  Geral:             "#C084FC",
};

interface ObservationCardProps {
  observation: PatientObservation;
  onPress: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function ObservationCard({ observation: obs, onPress }: ObservationCardProps) {
  const { colors } = useTheme();
  const catColor = CATEGORY_COLORS[obs.category] ?? colors.secondary;
  const isUrgent = obs.priority === "Urgente";

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
        borderWidth: isUrgent ? 1.5 : 0,
        borderColor: isUrgent ? "#EF444460" : "transparent",
        gap: 10,
      }}
    >
      {/* Pinned indicator */}
      {obs.isPinned && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Ionicons name="pin-outline" size={13} color={colors.secondary} />
          <AppText style={{ fontSize: 11, color: colors.secondary, fontWeight: "600" }}>Fixada</AppText>
        </View>
      )}

      {/* Header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <AppText
          style={{ fontSize: 14, fontWeight: "700", color: colors.content, flex: 1 }}
          numberOfLines={2}
        >
          {obs.title}
        </AppText>
        <Ionicons name="chevron-forward-outline" size={16} color={colors.subtle} />
      </View>

      {/* Badges row */}
      <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            backgroundColor: catColor + "18",
            borderRadius: 99,
            paddingHorizontal: 9,
            paddingVertical: 3,
          }}
        >
          <AppText style={{ fontSize: 11, color: catColor, fontWeight: "600" }}>{obs.category}</AppText>
        </View>
        <ObservationPriorityBadge priority={obs.priority} size="sm" />
        {obs.isPrivate && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              backgroundColor: colors.muted + "40",
              borderRadius: 99,
              paddingHorizontal: 9,
              paddingVertical: 3,
            }}
          >
            <Ionicons name="lock-closed-outline" size={11} color={colors.subtle} />
            <AppText style={{ fontSize: 11, color: colors.subtle, fontWeight: "600" }}>Privada</AppText>
          </View>
        )}
      </View>

      {/* Summary */}
      <AppText style={{ fontSize: 13, color: colors.subtle, lineHeight: 18 }} numberOfLines={2}>
        {obs.summary}
      </AppText>

      {/* Footer */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <AppText style={{ fontSize: 11, color: colors.subtle }}>{formatDate(obs.createdAt)}</AppText>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
          {obs.tags.slice(0, 2).map((tag) => (
            <AppText key={tag} style={{ fontSize: 11, color: colors.subtle }}>#{tag}</AppText>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}
