import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";

export function PremiumHeroBanner() {
  return (
    <LinearGradient
      colors={["#1a2744", "#1a4a42"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="rounded-3xl overflow-hidden"
      style={{ minHeight: 160 }}
    >
      {/* Decorative circles */}
      <View
        className="absolute w-48 h-48 rounded-full opacity-10"
        style={{ backgroundColor: "#2A9D8F", top: -40, right: -40 }}
      />
      <View
        className="absolute w-32 h-32 rounded-full opacity-10"
        style={{ backgroundColor: "#4C78D9", bottom: -20, left: 20 }}
      />

      <View className="p-6 gap-3">
        <View className="flex-row items-center gap-2">
          <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center">
            <Ionicons name="sparkles" size={16} color="#fff" />
          </View>
          <AppText variant="caption" style={{ color: "#2A9D8F" }} className="font-semibold">
            HealthMind Premium
          </AppText>
        </View>

        <AppText
          variant="heading2"
          className="font-bold"
          style={{ color: "#fff", fontSize: 26 }}
        >
          Eleve sua jornada
        </AppText>

        <AppText variant="body" style={{ color: "#c8d8e8" }} className="leading-6">
          Desbloqueie ferramentas avançadas para um cuidado mais profundo e contínuo da sua saúde mental.
        </AppText>
      </View>
    </LinearGradient>
  );
}
