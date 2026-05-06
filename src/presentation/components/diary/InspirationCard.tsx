import React, { useMemo } from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";

const QUOTES = [
  {
    text: "Cuidar de si mesmo não é egoísmo — é a base de tudo.",
    author: "Psicologia Positiva",
  },
  {
    text: "Cada sentimento merece ser reconhecido, não julgado.",
    author: "Terapia Centrada na Pessoa",
  },
  {
    text: "Registrar suas emoções é o primeiro passo para entendê-las.",
    author: "Mindfulness",
  },
  {
    text: "A vulnerabilidade é a força de quem se permite sentir.",
    author: "Brené Brown",
  },
  {
    text: "Pequenos avanços todos os dias constroem grandes mudanças.",
    author: "Psicologia Comportamental",
  },
];

export function InspirationCard() {
  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], []);

  return (
    <LinearGradient
      colors={["#1a2744", "#1e3a5f"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="rounded-2xl p-5 gap-3"
    >
      <View className="flex-row items-center gap-2">
        <Ionicons name="sparkles" size={16} color="#4C78D9" />
        <AppText variant="caption" style={{ color: "#4C78D9" }} className="font-semibold">
          Inspiração do momento
        </AppText>
      </View>
      <AppText variant="body" style={{ color: "#e8edf5" }} className="leading-6 italic">
        "{quote.text}"
      </AppText>
      <AppText variant="caption" style={{ color: "#8899bb" }}>
        — {quote.author}
      </AppText>
    </LinearGradient>
  );
}
