import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";

interface CheckInStreakCardProps {
  streak: number;
}

export function CheckInStreakCard({ streak }: CheckInStreakCardProps) {
  return (
    <LinearGradient
      colors={["#2A9D8F", "#1F7A73"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="rounded-3xl p-6 items-center gap-2"
      style={{
        shadowColor: "#2A9D8F",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 16,
        elevation: 8,
      }}
    >
      {/* Decorative circle top-right */}
      <View
        className="absolute top-0 right-0 w-28 h-28 rounded-full opacity-20"
        style={{ backgroundColor: "#ffffff", transform: [{ translateX: 30 }, { translateY: -30 }] }}
      />

      <View className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center">
        <Ionicons name="checkmark-done" size={26} color="#fff" />
      </View>

      <AppText variant="body" className="text-white/80 font-semibold">
        Check-ins Realizados
      </AppText>

      <AppText
        variant="heading1"
        className="font-bold"
        style={{ color: "#fff", fontSize: 48, lineHeight: 56 }}
      >
        {streak}
      </AppText>

      <AppText variant="small" className="text-white/70">
        Dias seguidos!
      </AppText>
    </LinearGradient>
  );
}
