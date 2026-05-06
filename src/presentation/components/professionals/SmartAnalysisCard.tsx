import React from "react";
import { View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { AppButton } from "../ui/AppButton";

interface SmartAnalysisCardProps {
  active: boolean;
  onToggle: () => void;
}

export function SmartAnalysisCard({ active, onToggle }: SmartAnalysisCardProps) {
  return (
    <LinearGradient
      colors={active ? ["#1a4a42", "#1a2744"] : ["#1e2a3a", "#1a2744"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="rounded-3xl overflow-hidden"
      style={{
        borderWidth: active ? 2 : 0,
        borderColor: active ? "#2A9D8F" : "transparent",
        shadowColor: active ? "#2A9D8F" : "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: active ? 0.3 : 0.12,
        shadowRadius: 14,
        elevation: active ? 8 : 4,
      }}
    >
      {/* Decorative circle */}
      <View
        className="absolute w-32 h-32 rounded-full opacity-15"
        style={{ backgroundColor: "#2A9D8F", top: -20, right: -20 }}
      />

      <View className="p-5 gap-3">
        <View className="flex-row items-center gap-2">
          <View className="w-9 h-9 rounded-full bg-white/15 items-center justify-center">
            <Ionicons name="sparkles" size={18} color="#2A9D8F" />
          </View>
          <AppText variant="bodyMedium" style={{ color: "#fff" }} className="font-bold">
            Analisar meus dados do app
          </AppText>
          {active && (
            <View className="ml-auto">
              <Ionicons name="checkmark-circle" size={20} color="#2A9D8F" />
            </View>
          )}
        </View>

        <AppText variant="small" style={{ color: "#c8d8e8" }} className="leading-5">
          Permita que o HealthMind sugira profissionais com base nos seus registros
          emocionais, hábitos e evolução.
        </AppText>

        <TouchableOpacity
          onPress={onToggle}
          activeOpacity={0.85}
        >
          <View
            className="rounded-full py-2.5 items-center"
            style={{
              backgroundColor: active ? "#2A9D8F" : "rgba(255,255,255,0.12)",
              borderWidth: active ? 0 : 1,
              borderColor: "rgba(255,255,255,0.2)",
            }}
          >
            <AppText
              variant="small"
              className="font-semibold"
              style={{ color: active ? "#fff" : "#c8d8e8" }}
            >
              {active ? "✓ Análise inteligente ativada" : "Usar análise inteligente"}
            </AppText>
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
