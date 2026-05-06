import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AppText } from "../ui/AppText";
import { CategoryPill } from "./CategoryPill";

const TAGS = ["Foco", "Relaxamento"];

export function ActivityHeroCard() {
  return (
    <LinearGradient
      colors={["#e8f5f3", "#eef3fb"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="rounded-3xl p-5 gap-3"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
        elevation: 4,
      }}
    >
      <View className="gap-1.5">
        <AppText variant="heading2" className="font-bold" color="secondary">
          Atividades Diárias
        </AppText>
        <AppText variant="body" color="muted" className="leading-6">
          Dedique um momento para si mesmo. Pequenas pausas geram grandes impactos no seu
          bem-estar mental e físico.
        </AppText>
      </View>

      <View className="flex-row gap-2">
        {TAGS.map((tag) => (
          <CategoryPill key={tag} label={tag} active />
        ))}
      </View>
    </LinearGradient>
  );
}
