import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { AppButton } from "../ui/AppButton";
import { Professional } from "../../../core/types";
import { useTheme } from "../../../core/theme";

interface ProfessionalCardProps {
  professional: Professional;
  onSchedule: (id: string) => void;
}

const AVATAR_COLORS = ["#2A9D8F", "#4C78D9", "#6366F1", "#F59E0B", "#EC4899"];

function AvatarCircle({ name, size = 56 }: { name: string; size?: number }) {
  const initials = name
    .replace(/Dr[a]?\.\s*/i, "")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  const color = AVATAR_COLORS[name.charCodeAt(4) % AVATAR_COLORS.length];

  return (
    <View
      className="rounded-full items-center justify-center"
      style={{ width: size, height: size, backgroundColor: color + "22" }}
    >
      <AppText style={{ fontSize: size * 0.33, fontWeight: "700", color }}>
        {initials}
      </AppText>
    </View>
  );
}

export function ProfessionalCard({ professional, onSchedule }: ProfessionalCardProps) {
  const { colors } = useTheme();

  return (
    <View
      className="bg-surface dark:bg-surface-dark rounded-3xl p-5 gap-4"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 14,
        elevation: 4,
      }}
    >
      {/* Header */}
      <View className="flex-row items-center gap-3">
        <AvatarCircle name={professional.name} />
        <View className="flex-1">
          <AppText variant="bodyMedium" className="font-bold">
            {professional.name}
          </AppText>
          <AppText variant="small" color="secondary" className="font-medium">
            {professional.specialty}
          </AppText>
          <View className="flex-row items-center gap-1 mt-1">
            <Ionicons name="star" size={12} color="#F59E0B" />
            <AppText variant="caption" color="muted">
              {professional.rating.toFixed(1)} · {professional.appointmentsCount} consultas
            </AppText>
          </View>
        </View>
      </View>

      {/* Description */}
      <AppText variant="small" color="muted" className="leading-5">
        {professional.description}
      </AppText>

      {/* Tags */}
      <View className="flex-row flex-wrap gap-1.5">
        {professional.tags.map((tag) => (
          <View
            key={tag}
            className="px-2.5 py-1 rounded-full bg-secondary/10 dark:bg-secondary-dark/15"
          >
            <AppText variant="caption" color="secondary" className="font-medium">
              {tag}
            </AppText>
          </View>
        ))}
      </View>

      {/* CTA */}
      <AppButton
        label="Ver horários disponíveis"
        onPress={() => onSchedule(professional.id)}
        variant="gradient"
        size="md"
      />
    </View>
  );
}
