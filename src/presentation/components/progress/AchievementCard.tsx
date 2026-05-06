import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { AppCard } from "../ui/AppCard";
import { Achievement } from "../../../core/types";
import { useTheme } from "../../../core/theme";

interface AchievementCardProps {
  achievements: Achievement[];
}

export function AchievementCard({ achievements }: AchievementCardProps) {
  const { colors } = useTheme();

  return (
    <AppCard className="gap-4">
      <AppText variant="bodyMedium" className="font-semibold">
        Conquistas de Autocuidado
      </AppText>

      <View className="flex-row justify-around">
        {achievements.map((item) => (
          <View key={item.id} className="items-center gap-2">
            <View
              className="w-14 h-14 rounded-full items-center justify-center"
              style={{
                backgroundColor: item.completed
                  ? colors.secondary
                  : colors.muted,
              }}
            >
              <Ionicons
                name={item.icon as keyof typeof Ionicons.glyphMap}
                size={24}
                color={item.completed ? "#fff" : colors.subtle}
              />
            </View>
            <AppText
              variant="caption"
              color={item.completed ? "default" : "muted"}
              className="text-center font-medium"
            >
              {item.title}
            </AppText>
          </View>
        ))}
      </View>
    </AppCard>
  );
}
