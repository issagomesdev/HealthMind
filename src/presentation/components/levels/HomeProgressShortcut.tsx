import React from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";
import type { HomeProgressSummary } from "../../../types/levelsBenefits";

interface Props {
  summary: HomeProgressSummary | null;
  isLoading: boolean;
  onPress: () => void;
}

export function HomeProgressShortcut({ summary, isLoading, onPress }: Props) {
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <View
        style={{
          marginHorizontal: 20,
          borderRadius: 16,
          padding: 16,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          alignItems: "center",
          justifyContent: "center",
          height: 80,
        }}
      >
        <ActivityIndicator size="small" color={colors.secondary} />
      </View>
    );
  }

  if (!summary) return null;

  const progress = Math.min(
    summary.currentXP / (summary.currentXP + summary.xpToNextLevel),
    1
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        marginHorizontal: 20,
        borderRadius: 16,
        padding: 16,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 10,
      }}
    >
      {/* Header row */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <AppText style={{ fontSize: 16 }}>{summary.badge}</AppText>
          <View style={{ gap: 1 }}>
            <AppText style={{ fontSize: 13, fontWeight: "700", color: colors.content }}>
              Seu progresso
            </AppText>
            <AppText style={{ fontSize: 11, color: colors.subtle }}>
              {summary.levelName}
            </AppText>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <AppText style={{ fontSize: 12, fontWeight: "600", color: summary.color }}>
            Ver benefícios
          </AppText>
          <Ionicons name="chevron-forward" size={14} color={summary.color} />
        </View>
      </View>

      {/* Progress bar */}
      <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.muted, overflow: "hidden" }}>
        <View
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            borderRadius: 3,
            backgroundColor: summary.color,
          }}
        />
      </View>

      {/* Stats row */}
      <View style={{ flexDirection: "row", gap: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Ionicons name="flame-outline" size={13} color="#F59E0B" />
          <AppText style={{ fontSize: 11, color: colors.subtle }}>
            {summary.streak} dias
          </AppText>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Ionicons name="checkmark-circle-outline" size={13} color={summary.color} />
          <AppText style={{ fontSize: 11, color: colors.subtle }}>
            {summary.missionsCompleted}/{summary.missionsTotal} missões
          </AppText>
        </View>
        <AppText style={{ fontSize: 11, color: colors.subtle }}>
          {summary.currentXP.toLocaleString("pt-BR")} XP
        </AppText>
      </View>
    </TouchableOpacity>
  );
}
