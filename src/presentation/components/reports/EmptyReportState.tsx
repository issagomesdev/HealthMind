import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";

type EmptyType = "no_data" | "no_patients" | "no_patient_selected" | "loading";

const CONFIG: Record<EmptyType, { title: string; subtitle: string }> = {
  no_data: {
    title: "Nenhum dado disponível",
    subtitle: "Os dados do relatório ainda não foram carregados.",
  },
  no_patients: {
    title: "Nenhum paciente encontrado",
    subtitle: "Tente ajustar o filtro ou a busca para encontrar pacientes.",
  },
  no_patient_selected: {
    title: "Selecione um paciente",
    subtitle: "Escolha um paciente na lista para visualizar o relatório completo.",
  },
  loading: {
    title: "Carregando relatório...",
    subtitle: "Por favor, aguarde enquanto os dados são processados.",
  },
};

interface EmptyReportStateProps {
  type: EmptyType;
}

export function EmptyReportState({ type }: EmptyReportStateProps) {
  const { colors } = useTheme();
  const cfg = CONFIG[type];

  return (
    <View style={{ alignItems: "center", padding: 32, gap: 12 }}>
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.muted,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="stats-chart-outline" size={26} color={colors.subtle} />
      </View>
      <AppText style={{ fontSize: 15, fontWeight: "700", color: colors.content, textAlign: "center" }}>
        {cfg.title}
      </AppText>
      <AppText style={{ fontSize: 13, color: colors.subtle, textAlign: "center", lineHeight: 18 }}>
        {cfg.subtitle}
      </AppText>
    </View>
  );
}
