import React from "react";
import { View, TouchableOpacity } from "react-native";
import { AppText } from "../../ui/AppText";
import { AvailabilitySwitch } from "./AvailabilitySwitch";
import { useTheme } from "../../../../core/theme";
import type { AppointmentRule } from "../../../../types/professionalAvailability";

const MIN_ADVANCE_OPTIONS = [
  { label: "2h", value: 2 },
  { label: "12h", value: 12 },
  { label: "24h", value: 24 },
  { label: "48h", value: 48 },
];

const MAX_ADVANCE_OPTIONS = [
  { label: "7 dias", value: 7 },
  { label: "15 dias", value: 15 },
  { label: "30 dias", value: 30 },
  { label: "60 dias", value: 60 },
];

interface AppointmentRulesCardProps {
  rules: AppointmentRule;
  onChange: (rules: Partial<AppointmentRule>) => void;
}

export function AppointmentRulesCard({
  rules,
  onChange,
}: AppointmentRulesCardProps) {
  const { colors } = useTheme();

  function ChipRow({
    label,
    options,
    selectedValue,
    onSelect,
  }: {
    label: string;
    options: { label: string; value: number }[];
    selectedValue: number;
    onSelect: (v: number) => void;
  }) {
    return (
      <View style={{ gap: 8 }}>
        <AppText style={{ fontSize: 13, fontWeight: "600", color: colors.content }}>
          {label}
        </AppText>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {options.map((opt) => {
            const sel = selectedValue === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => onSelect(opt.value)}
                activeOpacity={0.75}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: sel ? colors.secondary : colors.muted,
                  borderWidth: 1.5,
                  borderColor: sel ? colors.secondary : colors.border,
                }}
              >
                <AppText
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: sel ? "#fff" : colors.content,
                  }}
                >
                  {opt.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <View style={{ gap: 16 }}>
      <ChipRow
        label="Antecedência mínima para agendamento"
        options={MIN_ADVANCE_OPTIONS}
        selectedValue={rules.minAdvanceHours}
        onSelect={(v) => onChange({ minAdvanceHours: v })}
      />

      <ChipRow
        label="Antecedência máxima para agendamento"
        options={MAX_ADVANCE_OPTIONS}
        selectedValue={rules.maxAdvanceDays}
        onSelect={(v) => onChange({ maxAdvanceDays: v })}
      />

      <View
        style={{
          height: 1,
          backgroundColor: colors.border,
          marginVertical: 2,
        }}
      />

      <AvailabilitySwitch
        label="Permitir reagendamento pelo paciente"
        description={
          rules.allowPatientReschedule
            ? `Mínimo de ${rules.rescheduleMinHours}h de antecedência`
            : undefined
        }
        value={rules.allowPatientReschedule}
        onValueChange={(v) => onChange({ allowPatientReschedule: v })}
      />

      {rules.allowPatientReschedule && (
        <View style={{ gap: 8, paddingLeft: 8 }}>
          <AppText style={{ fontSize: 13, fontWeight: "600", color: colors.content }}>
            Antecedência mínima para reagendar
          </AppText>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {[6, 12, 24, 48].map((h) => {
              const sel = rules.rescheduleMinHours === h;
              return (
                <TouchableOpacity
                  key={h}
                  onPress={() => onChange({ rescheduleMinHours: h })}
                  activeOpacity={0.75}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                    borderRadius: 20,
                    backgroundColor: sel ? colors.secondary : colors.muted,
                    borderWidth: 1.5,
                    borderColor: sel ? colors.secondary : colors.border,
                  }}
                >
                  <AppText
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: sel ? "#fff" : colors.content,
                    }}
                  >
                    {h}h
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      <AvailabilitySwitch
        label="Permitir cancelamento pelo paciente"
        description={
          rules.allowPatientCancel
            ? `Mínimo de ${rules.cancelMinHours}h de antecedência`
            : undefined
        }
        value={rules.allowPatientCancel}
        onValueChange={(v) => onChange({ allowPatientCancel: v })}
      />

      {rules.allowPatientCancel && (
        <View style={{ gap: 8, paddingLeft: 8 }}>
          <AppText style={{ fontSize: 13, fontWeight: "600", color: colors.content }}>
            Antecedência mínima para cancelar
          </AppText>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {[6, 12, 24, 48].map((h) => {
              const sel = rules.cancelMinHours === h;
              return (
                <TouchableOpacity
                  key={h}
                  onPress={() => onChange({ cancelMinHours: h })}
                  activeOpacity={0.75}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                    borderRadius: 20,
                    backgroundColor: sel ? colors.secondary : colors.muted,
                    borderWidth: 1.5,
                    borderColor: sel ? colors.secondary : colors.border,
                  }}
                >
                  <AppText
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: sel ? "#fff" : colors.content,
                    }}
                  >
                    {h}h
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      <AvailabilitySwitch
        label="Confirmação manual obrigatória"
        description="Você precisa confirmar cada agendamento antes de ser efetivado."
        value={rules.requireManualConfirmation}
        onValueChange={(v) => onChange({ requireManualConfirmation: v })}
      />

      <AvailabilitySwitch
        label="Aprovação automática"
        description="Agendamentos são confirmados automaticamente após a solicitação."
        value={rules.bookingMode === "auto"}
        onValueChange={(v) =>
          onChange({ bookingMode: v ? "auto" : "manual" })
        }
      />
    </View>
  );
}
