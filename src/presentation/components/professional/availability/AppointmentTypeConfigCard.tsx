import React, { useState } from "react";
import { View, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../ui/AppText";
import { useTheme } from "../../../../core/theme";
import type {
  AppointmentTypeConfig,
  AppointmentFormat,
} from "../../../../types/professionalAvailability";

const FORMAT_LABELS: Record<AppointmentFormat, string> = {
  online: "Online",
  presencial: "Presencial",
  hibrido: "Híbrido",
};

interface AppointmentTypeConfigCardProps {
  config: AppointmentTypeConfig;
  onChange: (updated: AppointmentTypeConfig) => void;
}

const DURATION_OPTIONS = [30, 45, 50, 60, 90];
const FORMAT_OPTIONS: AppointmentFormat[] = ["online", "presencial", "hibrido"];

function formatBRL(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function AppointmentTypeConfigCard({
  config,
  onChange,
}: AppointmentTypeConfigCardProps) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const toggleFormat = (format: AppointmentFormat) => {
    const has = config.formats.includes(format);
    if (has && config.formats.length === 1) return;
    const newFormats = has
      ? config.formats.filter((f) => f !== format)
      : [...config.formats, format];
    onChange({ ...config, formats: newFormats });
  };

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 14,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
      }}
    >
      {/* Left color bar + header */}
      <TouchableOpacity
        onPress={() => setExpanded((v) => !v)}
        activeOpacity={0.8}
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <View
          style={{ width: 4, alignSelf: "stretch", backgroundColor: config.color }}
        />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 14,
            paddingVertical: 12,
            gap: 10,
          }}
        >
          <View style={{ flex: 1, gap: 2 }}>
            <AppText style={{ fontSize: 14, fontWeight: "700", color: colors.content }}>
              {config.label}
            </AppText>
            <AppText style={{ fontSize: 12, color: colors.subtle }}>
              {config.durationMinutes} min · {formatBRL(config.valueFake)}
            </AppText>
          </View>
          {/* Format chips */}
          <View style={{ flexDirection: "row", gap: 4 }}>
            {config.formats.map((f) => (
              <View
                key={f}
                style={{
                  paddingHorizontal: 7,
                  paddingVertical: 3,
                  borderRadius: 8,
                  backgroundColor: config.color + "22",
                }}
              >
                <AppText
                  style={{
                    fontSize: 10,
                    fontWeight: "700",
                    color: config.color,
                  }}
                >
                  {FORMAT_LABELS[f]}
                </AppText>
              </View>
            ))}
          </View>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={16}
            color={colors.subtle}
          />
        </View>
      </TouchableOpacity>

      {/* Expanded edit area */}
      {expanded && (
        <View
          style={{
            paddingHorizontal: 14,
            paddingBottom: 14,
            gap: 14,
            borderTopWidth: 1,
            borderTopColor: colors.border,
          }}
        >
          {/* Duration */}
          <View style={{ gap: 8, paddingTop: 10 }}>
            <AppText style={{ fontSize: 13, fontWeight: "600", color: colors.content }}>
              Duração
            </AppText>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {DURATION_OPTIONS.map((d) => {
                const sel = config.durationMinutes === d;
                return (
                  <TouchableOpacity
                    key={d}
                    onPress={() => onChange({ ...config, durationMinutes: d })}
                    activeOpacity={0.75}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 7,
                      borderRadius: 20,
                      backgroundColor: sel ? config.color : colors.muted,
                      borderWidth: 1.5,
                      borderColor: sel ? config.color : colors.border,
                    }}
                  >
                    <AppText
                      style={{
                        fontSize: 13,
                        fontWeight: "600",
                        color: sel ? "#fff" : colors.content,
                      }}
                    >
                      {d} min
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Value */}
          <View style={{ gap: 8 }}>
            <AppText style={{ fontSize: 13, fontWeight: "600", color: colors.content }}>
              Valor (R$)
            </AppText>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.muted,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: 12,
                height: 40,
                gap: 6,
              }}
            >
              <AppText style={{ fontSize: 14, color: colors.subtle }}>R$</AppText>
              <TextInput
                value={(config.valueFake / 100).toFixed(2).replace(".", ",")}
                onChangeText={(t) => {
                  const numeric = parseFloat(t.replace(",", ".").replace(/[^0-9.]/g, "")) || 0;
                  onChange({ ...config, valueFake: Math.round(numeric * 100) });
                }}
                keyboardType="decimal-pad"
                style={{
                  flex: 1,
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.content,
                }}
                placeholderTextColor={colors.subtle}
              />
            </View>
          </View>

          {/* Formats */}
          <View style={{ gap: 8 }}>
            <AppText style={{ fontSize: 13, fontWeight: "600", color: colors.content }}>
              Formatos disponíveis
            </AppText>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {FORMAT_OPTIONS.map((format) => {
                const sel = config.formats.includes(format);
                return (
                  <TouchableOpacity
                    key={format}
                    onPress={() => toggleFormat(format)}
                    activeOpacity={0.75}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 7,
                      borderRadius: 20,
                      backgroundColor: sel ? config.color : colors.muted,
                      borderWidth: 1.5,
                      borderColor: sel ? config.color : colors.border,
                    }}
                  >
                    <AppText
                      style={{
                        fontSize: 13,
                        fontWeight: "600",
                        color: sel ? "#fff" : colors.content,
                      }}
                    >
                      {FORMAT_LABELS[format]}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
