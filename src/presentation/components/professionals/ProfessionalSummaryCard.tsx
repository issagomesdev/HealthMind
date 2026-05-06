import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { AppCard } from "../ui/AppCard";
import { Professional } from "../../../core/types";

const AVATAR_COLORS = ["#2A9D8F", "#4C78D9", "#6366F1", "#F59E0B", "#EC4899"];

function AvatarCircle({ name }: { name: string }) {
  const initials = name
    .replace(/Dr[a]?\.\s*/i, "")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  const color = AVATAR_COLORS[name.charCodeAt(4) % AVATAR_COLORS.length];

  return (
    <View
      className="w-14 h-14 rounded-full items-center justify-center"
      style={{ backgroundColor: color + "22" }}
    >
      <AppText style={{ fontSize: 19, fontWeight: "700", color }}>
        {initials}
      </AppText>
    </View>
  );
}

interface ProfessionalSummaryCardProps {
  professional: Professional;
}

export function ProfessionalSummaryCard({ professional }: ProfessionalSummaryCardProps) {
  return (
    <AppCard>
      <View className="flex-row items-center gap-4">
        <AvatarCircle name={professional.name} />
        <View className="flex-1 gap-0.5">
          <AppText variant="bodyMedium" className="font-bold">
            {professional.name}
          </AppText>
          <AppText variant="small" color="secondary" className="font-medium">
            {professional.specialty}
          </AppText>
          <View className="flex-row items-center gap-1 mt-0.5">
            <Ionicons name="star" size={12} color="#F59E0B" />
            <AppText variant="caption" color="muted">
              {professional.rating.toFixed(1)} · {professional.appointmentsCount} consultas
            </AppText>
          </View>
        </View>
      </View>
    </AppCard>
  );
}
