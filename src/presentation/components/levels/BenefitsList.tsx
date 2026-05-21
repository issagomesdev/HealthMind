import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";
import type { ActiveBenefit } from "../../../types/levelsBenefits";

interface Props {
  activeBenefits: ActiveBenefit[];
  nextLevelBenefit: string;
  nextLevelId: number;
  accentColor: string;
}

export function BenefitsList({ activeBenefits, nextLevelBenefit, nextLevelId, accentColor }: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        marginHorizontal: 20,
        borderRadius: 20,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
        padding: 16,
        gap: 12,
      }}
    >
      <AppText style={{ fontSize: 16, fontWeight: "700", color: colors.content }}>
        Benefícios Desbloqueados
      </AppText>

      {/* Active benefit chips */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        {activeBenefits.map((b) => (
          <View
            key={b.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingHorizontal: 12,
              paddingVertical: 7,
              borderRadius: 20,
              borderWidth: 1.5,
              borderColor: accentColor + "50",
              backgroundColor: accentColor + "10",
            }}
          >
            <Ionicons name={b.icon as any} size={13} color={accentColor} />
            <AppText style={{ fontSize: 13, fontWeight: "600", color: accentColor }}>
              {b.title}
            </AppText>
          </View>
        ))}
      </View>

      {/* Next level locked benefit */}
      <View
        style={{
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingTop: 12,
          gap: 4,
        }}
      >
        <AppText style={{ fontSize: 11, fontWeight: "600", color: colors.subtle }}>
          Próximo Nível ({nextLevelId}):
        </AppText>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Ionicons name="lock-closed-outline" size={14} color={colors.subtle} />
          <AppText style={{ fontSize: 14, color: colors.subtle }}>
            {nextLevelBenefit}
          </AppText>
        </View>
      </View>
    </View>
  );
}
