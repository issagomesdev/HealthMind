import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../ui/AppText";
import { useTheme } from "../../../../core/theme";

interface DaySummaryChip {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  count: number;
}

interface DaySummaryRowProps {
  appointmentsCount: number;
  tasksCount: number;
  importantReminders: number;
}

export function DaySummaryRow({
  appointmentsCount,
  tasksCount,
  importantReminders,
}: DaySummaryRowProps) {
  const { colors } = useTheme();

  const chips: DaySummaryChip[] = [
    {
      icon: "calendar-outline",
      label: appointmentsCount === 1 ? "consulta" : "consultas",
      color: "#2A9D8F",
      count: appointmentsCount,
    },
    {
      icon: "checkmark-circle-outline",
      label: tasksCount === 1 ? "atividade" : "atividades",
      color: "#4C78D9",
      count: tasksCount,
    },
    {
      icon: "alert-circle-outline",
      label: importantReminders === 1 ? "alerta" : "alertas",
      color: "#EF4444",
      count: importantReminders,
    },
  ];

  return (
    <View style={{ flexDirection: "row", gap: 8, paddingVertical: 4 }}>
      {chips.map((chip) => (
        <View
          key={chip.label}
          style={{
            flex: 1,
            backgroundColor: chip.color + "15",
            borderRadius: 12,
            paddingVertical: 10,
            paddingHorizontal: 8,
            alignItems: "center",
            gap: 4,
          }}
        >
          <Ionicons name={chip.icon} size={18} color={chip.color} />
          <AppText style={{ fontSize: 18, fontWeight: "800", color: chip.color }}>
            {chip.count}
          </AppText>
          <AppText style={{ fontSize: 10, fontWeight: "500", color: chip.color }}>
            {chip.label}
          </AppText>
        </View>
      ))}
    </View>
  );
}
