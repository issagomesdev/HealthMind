import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";
import type { Level } from "../../../types/levelsBenefits";

interface Props {
  currentLevel: Level;
  nextLevel: Level;
  currentXP: number;
  xpToNextLevel: number;
}

export function XPProgressCard({ currentLevel, nextLevel, currentXP, xpToNextLevel }: Props) {
  const { colors } = useTheme();
  const totalForNext = currentXP + xpToNextLevel;
  const progress = Math.min(currentXP / totalForNext, 1);

  return (
    <View
      style={{
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 20,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 12,
      }}
    >
      {/* XP label + values */}
      <View style={{ flexDirection: "row", alignItems: "baseline", gap: 8, flexWrap: "wrap" }}>
        <AppText style={{ fontSize: 12, fontWeight: "600", color: colors.subtle }}>XP Atual</AppText>
        <AppText style={{ fontSize: 22, fontWeight: "800", color: colors.content }}>
          {currentXP.toLocaleString("pt-BR")}
          <AppText style={{ fontSize: 14, fontWeight: "600", color: colors.subtle }}>
            {" "}/ {totalForNext.toLocaleString("pt-BR")} XP
          </AppText>
        </AppText>
        <View
          style={{
            backgroundColor: currentLevel.color + "20",
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 20,
          }}
        >
          <AppText style={{ fontSize: 11, fontWeight: "700", color: currentLevel.color }}>
            {xpToNextLevel.toLocaleString("pt-BR")} XP para o Nível {nextLevel.id}
          </AppText>
        </View>
      </View>

      {/* Progress bar */}
      <View style={{ height: 10, borderRadius: 5, backgroundColor: colors.muted, overflow: "hidden" }}>
        <View
          style={{
            height: "100%",
            width: `${progress * 100}%`,
            borderRadius: 5,
            backgroundColor: currentLevel.color,
          }}
        />
      </View>

      {/* Motivational note */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          backgroundColor: currentLevel.color + "12",
          borderRadius: 10,
          padding: 10,
        }}
      >
        <Ionicons name="information-circle-outline" size={16} color={currentLevel.color} />
        <AppText style={{ fontSize: 12, color: colors.subtle, flex: 1, lineHeight: 17 }}>
          Seu progresso respeita seu ritmo. Pequenas ações também contam.
        </AppText>
      </View>
    </View>
  );
}
