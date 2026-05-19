import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";
import type { PaymentFilterType } from "../../../types/payment";

interface Chip {
  value: PaymentFilterType;
  label: string;
}

const PATIENT_CHIPS: Chip[] = [
  { value: "all", label: "Todos" },
  { value: "pending", label: "Pendentes" },
  { value: "paid", label: "Pagos" },
  { value: "overdue", label: "Atrasados" },
  { value: "plans", label: "Planos" },
  { value: "appointments", label: "Consultas" },
  { value: "extra_charges", label: "Cobranças extras" },
];

const PROFESSIONAL_CHIPS: Chip[] = [
  { value: "all", label: "Todos" },
  { value: "received", label: "Recebidos" },
  { value: "pending", label: "Pendentes" },
  { value: "overdue", label: "Atrasados" },
  { value: "this_month", label: "Este Mês" },
  { value: "payouts", label: "Repasses" },
  { value: "extra_charges", label: "Cobranças extras" },
];

interface PaymentFilterChipsProps {
  filter: PaymentFilterType;
  onChange: (f: PaymentFilterType) => void;
  userRole: "patient" | "professional";
}

export function PaymentFilterChips({
  filter,
  onChange,
  userRole,
}: PaymentFilterChipsProps) {
  const { colors } = useTheme();
  const chips = userRole === "patient" ? PATIENT_CHIPS : PROFESSIONAL_CHIPS;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, gap: 8 }}
    >
      {chips.map((chip) => {
        const isActive = filter === chip.value;
        return (
          <TouchableOpacity
            key={chip.value}
            onPress={() => onChange(chip.value)}
            activeOpacity={0.7}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 999,
              backgroundColor: isActive ? colors.secondary : colors.surface,
              borderWidth: isActive ? 0 : 1,
              borderColor: colors.border,
            }}
          >
            <AppText
              style={{
                fontSize: 13,
                fontWeight: isActive ? "700" : "500",
                color: isActive ? "#fff" : colors.content,
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
