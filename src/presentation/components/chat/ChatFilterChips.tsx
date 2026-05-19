import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";
import type { ChatFilterType } from "../../../types/chat";

interface FilterChipDef {
  value: ChatFilterType;
  label: string;
}

const PATIENT_CHIPS: FilterChipDef[] = [
  { value: "all", label: "Todos" },
  { value: "unread", label: "Não lidas" },
  { value: "professionals", label: "Profissionais" },
  { value: "community", label: "Comunidade" },
  { value: "support", label: "Suporte" },
  { value: "online", label: "Online" },
];

const PROFESSIONAL_CHIPS: FilterChipDef[] = [
  { value: "all", label: "Todos" },
  { value: "unread", label: "Não lidas" },
  { value: "patients", label: "Pacientes" },
  { value: "support", label: "Suporte" },
  { value: "online", label: "Online" },
];

interface ChatFilterChipsProps {
  filter: ChatFilterType;
  onChange: (f: ChatFilterType) => void;
  userRole: "patient" | "professional";
}

export function ChatFilterChips({ filter, onChange, userRole }: ChatFilterChipsProps) {
  const { colors } = useTheme();
  const chips = userRole === "patient" ? PATIENT_CHIPS : PROFESSIONAL_CHIPS;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 16,
        paddingBottom: 8,
        gap: 8,
        flexDirection: "row",
      }}
    >
      {chips.map((chip) => {
        const isActive = filter === chip.value;
        return (
          <TouchableOpacity
            key={chip.value}
            onPress={() => onChange(chip.value)}
            activeOpacity={0.75}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 7,
              borderRadius: 20,
              backgroundColor: isActive ? colors.secondary : "transparent",
              borderWidth: 1.5,
              borderColor: isActive ? colors.secondary : colors.border,
            }}
          >
            <AppText
              style={{
                fontSize: 13,
                fontWeight: isActive ? "700" : "500",
                color: isActive ? "#fff" : colors.subtle,
              }}
            >
              {chip.label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
