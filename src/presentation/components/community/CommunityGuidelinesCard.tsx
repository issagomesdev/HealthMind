import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";

export function CommunityGuidelinesCard() {
  return (
    <View
      className="rounded-2xl border border-secondary/30 dark:border-secondary-dark/30 bg-secondary/5 dark:bg-secondary-dark/10 p-4 gap-3"
    >
      <View className="flex-row items-center gap-2">
        <Ionicons name="shield-checkmark" size={20} color="#2A9D8F" />
        <AppText variant="bodyMedium" color="secondary" className="font-bold">
          Espaço Seguro e Respeitoso
        </AppText>
      </View>
      <AppText variant="small" color="muted" className="leading-5">
        Lembre-se: nossa comunidade é um ambiente de apoio mútuo. Por favor, mantenha as
        interações gentis, respeitosas e evite compartilhar informações médicas sensíveis.
        Estamos todos aqui para crescer juntos.
      </AppText>
    </View>
  );
}
