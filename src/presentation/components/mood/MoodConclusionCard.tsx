import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";

interface MoodConclusionCardProps {
  conclusion: string;
}

export function MoodConclusionCard({ conclusion }: MoodConclusionCardProps) {
  return (
    <LinearGradient
      colors={["#1a6b5c", "#2A9D8F", "#3db8a8"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: 24, overflow: "hidden" }}
    >
      <View className="p-5 gap-3">
        {/* Decorative circle */}
        <View
          className="absolute top-0 right-0 w-28 h-28 rounded-full opacity-10"
          style={{ backgroundColor: "#fff", transform: [{ translateX: 14 }, { translateY: -14 }] }}
          pointerEvents="none"
        />
        <View className="flex-row items-center gap-2">
          <Ionicons name="heart-outline" size={18} color="rgba(255,255,255,0.9)" />
          <AppText variant="smallMedium" color="white" className="font-bold opacity-90 uppercase tracking-widest">
            Conclusão emocional
          </AppText>
        </View>
        <AppText variant="body" color="white" className="leading-7 opacity-95">
          {conclusion}
        </AppText>
      </View>
    </LinearGradient>
  );
}
