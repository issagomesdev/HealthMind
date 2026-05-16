import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../ui/AppText";
import { DiaryMoodLabel } from "../../../../types/patient";

const MOOD_CONFIG: Record<
  DiaryMoodLabel,
  { color: string; icon: keyof typeof Ionicons.glyphMap }
> = {
  Feliz:      { color: "#6DBF7B", icon: "happy-outline" },
  Estável:    { color: "#60A5FA", icon: "remove-circle-outline" },
  Ansioso:    { color: "#F59E0B", icon: "alert-circle-outline" },
  Cansado:    { color: "#9CA3AF", icon: "battery-dead-outline" },
  Triste:     { color: "#6B7EF5", icon: "sad-outline" },
  Irritado:   { color: "#EF4444", icon: "flash-outline" },
  Angustiado: { color: "#DC2626", icon: "skull-outline" },
};

interface DiaryMoodBadgeProps {
  mood: DiaryMoodLabel;
  moodScore?: number;
  size?: "sm" | "md";
}

export function DiaryMoodBadge({ mood, moodScore, size = "md" }: DiaryMoodBadgeProps) {
  const cfg = MOOD_CONFIG[mood] ?? { color: "#9CA3AF", icon: "remove-circle-outline" };
  const fontSize = size === "sm" ? 11 : 12;
  const iconSize = size === "sm" ? 12 : 14;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: cfg.color + "20",
        borderRadius: 99,
        paddingHorizontal: size === "sm" ? 8 : 10,
        paddingVertical: size === "sm" ? 3 : 4,
        alignSelf: "flex-start",
      }}
    >
      <Ionicons name={cfg.icon} size={iconSize} color={cfg.color} />
      <AppText style={{ color: cfg.color, fontWeight: "700", fontSize }}>
        {mood}{moodScore !== undefined ? ` ${moodScore}/10` : ""}
      </AppText>
    </View>
  );
}

export function getMoodColor(moodScore: number): string {
  if (moodScore >= 7) return "#6DBF7B";
  if (moodScore >= 5) return "#F59E0B";
  return "#EF4444";
}
