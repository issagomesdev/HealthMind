import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";

interface ProgressInsightCardProps {
  title: string;
  subtext: string;
}

export function ProgressInsightCard({ title, subtext }: ProgressInsightCardProps) {
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
      <View className="flex-row items-center gap-2">
        <View className="w-8 h-8 rounded-full bg-secondary/20 items-center justify-center">
          <Ionicons name="trending-up" size={17} color="#2A9D8F" />
        </View>
        <AppText variant="smallMedium" color="secondary" className="font-semibold">
          Seu progresso
        </AppText>
      </View>

      <AppText variant="heading3" className="font-bold leading-7" color="primary">
        {title}
      </AppText>

      <AppText variant="body" color="muted" className="leading-6">
        {subtext}
      </AppText>
    </LinearGradient>
  );
}
