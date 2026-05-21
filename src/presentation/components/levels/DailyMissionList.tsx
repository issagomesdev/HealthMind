import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";
import type { DailyMission } from "../../../types/levelsBenefits";

interface Props {
  missions: DailyMission[];
  accentColor: string;
  role: "patient" | "professional";
}

export function DailyMissionList({ missions, accentColor, role }: Props) {
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
      }}
    >
      {/* Section header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Ionicons
          name={role === "professional" ? "checkmark-circle-outline" : "flag-outline"}
          size={18}
          color={accentColor}
        />
        <AppText style={{ fontSize: 16, fontWeight: "700", color: colors.content }}>
          Missões Diárias
        </AppText>
      </View>

      {missions.map((mission, i) => (
        <View
          key={mission.id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 14,
            gap: 12,
            borderBottomWidth: i < missions.length - 1 ? 1 : 0,
            borderBottomColor: colors.border,
            opacity: mission.completed ? 0.65 : 1,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: mission.completed ? accentColor + "20" : colors.muted,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name={mission.icon as any}
              size={18}
              color={mission.completed ? accentColor : colors.subtle}
            />
          </View>
          <AppText
            style={{
              flex: 1,
              fontSize: 14,
              fontWeight: "500",
              color: colors.content,
              textDecorationLine: mission.completed ? "line-through" : "none",
            }}
          >
            {mission.title}
          </AppText>
          <View
            style={{
              backgroundColor: mission.completed ? accentColor + "20" : accentColor + "15",
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 20,
            }}
          >
            <AppText
              style={{ fontSize: 12, fontWeight: "700", color: accentColor }}
            >
              +{mission.xpReward} XP
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );
}
