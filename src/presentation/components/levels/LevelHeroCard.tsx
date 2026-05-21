import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";
import type { Level } from "../../../types/levelsBenefits";

interface Props {
  currentLevel: Level;
  tagline: string;
  userName: string;
  role: "patient" | "professional";
}

export function LevelHeroCard({ currentLevel, tagline, userName, role }: Props) {
  const { colors } = useTheme();

  const initials = userName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <View
      style={{
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 24,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        gap: 12,
      }}
    >
      {/* Avatar */}
      <View style={{ position: "relative" }}>
        <View
          style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            backgroundColor: currentLevel.color + "22",
            borderWidth: 3,
            borderColor: currentLevel.color + "60",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AppText style={{ fontSize: 30, fontWeight: "700", color: currentLevel.color }}>
            {initials || "U"}
          </AppText>
        </View>
        {/* Level badge */}
        {role === "professional" ? (
          <View
            style={{
              position: "absolute",
              bottom: 0,
              right: -2,
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: "#6366F1",
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 2,
              borderColor: colors.background,
            }}
          >
            <AppText style={{ fontSize: 12, fontWeight: "800", color: "#fff" }}>
              {currentLevel.id}
            </AppText>
          </View>
        ) : (
          <View
            style={{
              position: "absolute",
              bottom: -4,
              left: "50%",
              transform: [{ translateX: -44 }],
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              backgroundColor: currentLevel.color,
              paddingHorizontal: 10,
              paddingVertical: 3,
              borderRadius: 20,
            }}
          >
            <Ionicons name="star" size={10} color="#fff" />
            <AppText style={{ fontSize: 11, fontWeight: "700", color: "#fff" }}>
              Nível {currentLevel.id}
            </AppText>
          </View>
        )}
      </View>

      {/* Name + tagline */}
      <View style={{ alignItems: "center", gap: 4, marginTop: role === "patient" ? 8 : 0 }}>
        <AppText
          style={{ fontSize: 20, fontWeight: "800", color: currentLevel.color, textAlign: "center" }}
        >
          {currentLevel.name}
        </AppText>
        <AppText
          style={{ fontSize: 13, color: colors.subtle, textAlign: "center", lineHeight: 19 }}
        >
          {role === "professional" ? `"${tagline}"` : tagline}
        </AppText>
      </View>
    </View>
  );
}
