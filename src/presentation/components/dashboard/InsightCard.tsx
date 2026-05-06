import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";

interface InsightCardProps {
  title: string;
  body: string;
  variant?: "professional" | "patient";
}

export function InsightCard({
  title,
  body,
  variant = "professional",
}: InsightCardProps) {
  return (
    <LinearGradient
      colors={
        variant === "professional"
          ? ["#1B3A4B", "#0F2D3D"]
          : ["#1a5276", "#1F7A73"]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="rounded-2xl p-5 gap-3"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 14,
        elevation: 6,
      }}
    >
      <View className="flex-row items-center gap-2">
        <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
          <Ionicons name="bulb-outline" size={17} color="#fff" />
        </View>
        <AppText variant="smallMedium" className="text-white/80 font-semibold tracking-wide">
          {title}
        </AppText>
      </View>

      <AppText variant="body" className="text-white leading-6">
        {body}
      </AppText>
    </LinearGradient>
  );
}
