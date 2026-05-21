import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";
import type { Achievement } from "../../../types/levelsBenefits";

interface Props {
  achievements: Achievement[];
}

export function AchievementsGrid({ achievements }: Props) {
  const { colors } = useTheme();
  const unlocked = achievements.filter((a) => !a.locked);

  if (unlocked.length === 0) return null;

  return (
    <View style={{ marginHorizontal: 20, gap: 12 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <View style={{ width: 3, height: 18, borderRadius: 2, backgroundColor: colors.secondary }} />
        <AppText style={{ fontSize: 16, fontWeight: "700", color: colors.content }}>
          Conquistas Recentes
        </AppText>
      </View>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        {unlocked.map((achievement) => (
          <View
            key={achievement.id}
            style={{
              width: "47%",
              backgroundColor: colors.surface,
              borderRadius: 16,
              padding: 16,
              alignItems: "center",
              gap: 10,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <View
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                backgroundColor: achievement.color + "20",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name={achievement.icon as any} size={24} color={achievement.color} />
            </View>
            <AppText
              style={{ fontSize: 12, fontWeight: "600", color: colors.content, textAlign: "center" }}
            >
              {achievement.title}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
}
