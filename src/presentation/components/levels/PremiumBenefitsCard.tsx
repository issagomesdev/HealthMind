import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";

interface Props {
  role: "patient" | "professional";
  onPress?: () => void;
}

export function PremiumBenefitsCard({ role, onPress }: Props) {
  const isProfessional = role === "professional";

  return (
    <View
      style={{
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 24,
        backgroundColor: isProfessional ? "#EEF2FF" : "#ECFDF5",
        alignItems: "center",
        gap: 12,
      }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: isProfessional ? "#6366F1" : "#10B981",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons
          name={isProfessional ? "ribbon-outline" : "diamond-outline"}
          size={26}
          color="#fff"
        />
      </View>

      <View style={{ alignItems: "center", gap: 6 }}>
        <AppText
          style={{
            fontSize: 17,
            fontWeight: "800",
            color: isProfessional ? "#3730A3" : "#065F46",
            textAlign: "center",
          }}
        >
          {isProfessional ? "Selo Premium Profissional" : "Premium impulsiona sua evolução"}
        </AppText>
        <AppText
          style={{
            fontSize: 13,
            color: isProfessional ? "#4F46E5" : "#047857",
            textAlign: "center",
            lineHeight: 19,
          }}
        >
          {isProfessional
            ? "Premium amplia suas ferramentas, não substitui sua jornada."
            : "Premium desbloqueia ferramentas avançadas, mas sua evolução continua sendo construída pelas suas interações na plataforma."}
        </AppText>
      </View>

      {isProfessional && (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.85}
          style={{
            backgroundColor: "#6366F1",
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 24,
          }}
        >
          <AppText style={{ fontSize: 14, fontWeight: "700", color: "#fff" }}>
            Conhecer Premium
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );
}
