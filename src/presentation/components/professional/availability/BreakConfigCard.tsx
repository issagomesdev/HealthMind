import React from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import { AppText } from "../../ui/AppText";
import { useTheme } from "../../../../core/theme";
import type { BreakConfig } from "../../../../types/professionalAvailability";

const BREAK_OPTIONS = [
  { label: "Sem pausa", value: 0 },
  { label: "10 min", value: 10 },
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
];

interface BreakConfigCardProps {
  config: BreakConfig;
  onChange: (config: Partial<BreakConfig>) => void;
}

function applyTimeMask(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

export function BreakConfigCard({ config, onChange }: BreakConfigCardProps) {
  const { colors } = useTheme();

  const inputStyle = {
    width: 72,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.muted,
    color: colors.content,
    fontSize: 14,
    fontWeight: "600" as const,
    textAlign: "center" as const,
    paddingHorizontal: 6,
  };

  return (
    <View style={{ gap: 16 }}>
      {/* Break between sessions */}
      <View style={{ gap: 8 }}>
        <AppText style={{ fontSize: 13, fontWeight: "600", color: colors.content }}>
          Intervalo entre consultas
        </AppText>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {BREAK_OPTIONS.map((opt) => {
            const selected = config.breakBetweenMinutes === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => onChange({ breakBetweenMinutes: opt.value })}
                activeOpacity={0.75}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: selected ? colors.secondary : colors.muted,
                  borderWidth: 1.5,
                  borderColor: selected ? colors.secondary : colors.border,
                }}
              >
                <AppText
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: selected ? "#fff" : colors.content,
                  }}
                >
                  {opt.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Lunch break */}
      <View style={{ gap: 8 }}>
        <AppText style={{ fontSize: 13, fontWeight: "600", color: colors.content }}>
          Pausa para almoço
        </AppText>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <TextInput
            value={config.lunchStart ?? ""}
            onChangeText={(t) => onChange({ lunchStart: applyTimeMask(t) })}
            placeholder="12:00"
            placeholderTextColor={colors.subtle}
            keyboardType="numeric"
            maxLength={5}
            style={inputStyle}
          />
          <AppText style={{ fontSize: 13, color: colors.subtle }}>até</AppText>
          <TextInput
            value={config.lunchEnd ?? ""}
            onChangeText={(t) => onChange({ lunchEnd: applyTimeMask(t) })}
            placeholder="14:00"
            placeholderTextColor={colors.subtle}
            keyboardType="numeric"
            maxLength={5}
            style={inputStyle}
          />
        </View>
      </View>

      {/* Limits */}
      <View style={{ flexDirection: "row", gap: 20 }}>
        <View style={{ flex: 1, gap: 6 }}>
          <AppText style={{ fontSize: 13, fontWeight: "600", color: colors.content }}>
            Máx. por dia
          </AppText>
          <View style={{ flexDirection: "row", gap: 6 }}>
            {[4, 5, 6, 7, 8].map((n) => {
              const sel = config.maxPerDay === n;
              return (
                <TouchableOpacity
                  key={n}
                  onPress={() => onChange({ maxPerDay: n })}
                  activeOpacity={0.75}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: sel ? colors.secondary : colors.muted,
                    borderWidth: 1.5,
                    borderColor: sel ? colors.secondary : colors.border,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AppText
                    style={{
                      fontSize: 13,
                      fontWeight: "700",
                      color: sel ? "#fff" : colors.content,
                    }}
                  >
                    {n}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{ flex: 1, gap: 6 }}>
          <AppText style={{ fontSize: 13, fontWeight: "600", color: colors.content }}>
            Máx. seguidas
          </AppText>
          <View style={{ flexDirection: "row", gap: 6 }}>
            {[2, 3, 4, 5].map((n) => {
              const sel = config.maxConsecutive === n;
              return (
                <TouchableOpacity
                  key={n}
                  onPress={() => onChange({ maxConsecutive: n })}
                  activeOpacity={0.75}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: sel ? colors.secondary : colors.muted,
                    borderWidth: 1.5,
                    borderColor: sel ? colors.secondary : colors.border,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <AppText
                    style={{
                      fontSize: 13,
                      fontWeight: "700",
                      color: sel ? "#fff" : colors.content,
                    }}
                  >
                    {n}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}
