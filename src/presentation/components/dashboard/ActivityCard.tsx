import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { AppCard } from "../ui/AppCard";
import { AppButton } from "../ui/AppButton";
import { useTheme } from "../../../core/theme";
import { ActivityInfo } from "../../../core/types";

interface ActivityCardProps {
  activity: ActivityInfo;
  onStart?: () => void;
}

export function ActivityCard({ activity, onStart }: ActivityCardProps) {
  const { colors } = useTheme();

  return (
    <AppCard className="gap-3">
      <View className="flex-row items-center justify-between">
        <AppText variant="smallMedium" color="muted">
          Atividade recomendada
        </AppText>
        <View className="flex-row gap-1">
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              className={`h-1.5 rounded-full ${i === 0 ? "w-4 bg-secondary dark:bg-secondary-dark" : "w-1.5 bg-muted dark:bg-muted-dark"}`}
            />
          ))}
        </View>
      </View>

      <AppText variant="bodyMedium" className="font-semibold leading-snug">
        {activity.title}
      </AppText>

      <View className="flex-row items-center gap-1.5">
        <Ionicons name="time-outline" size={15} color={colors.subtle} />
        <AppText variant="small" color="muted">
          {activity.durationLabel}
        </AppText>
      </View>

      <AppButton
        label="▶  Começar"
        onPress={onStart ?? (() => {})}
        variant="primary"
        size="md"
      />
    </AppCard>
  );
}
