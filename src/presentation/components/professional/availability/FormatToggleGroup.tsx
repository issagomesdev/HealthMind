import React from "react";
import { View, TouchableOpacity } from "react-native";
import { AppText } from "../../ui/AppText";
import { useTheme } from "../../../../core/theme";
import type { AppointmentFormat } from "../../../../types/professionalAvailability";

const FORMAT_LABELS: Record<AppointmentFormat, string> = {
  online: "Online",
  presencial: "Presencial",
  hibrido: "Híbrido",
};

interface FormatToggleGroupProps {
  value: AppointmentFormat[];
  onChange: (formats: AppointmentFormat[]) => void;
}

export function FormatToggleGroup({ value, onChange }: FormatToggleGroupProps) {
  const { colors } = useTheme();
  const ALL_FORMATS: AppointmentFormat[] = ["online", "presencial", "hibrido"];

  const toggle = (format: AppointmentFormat) => {
    if (value.includes(format)) {
      // Don't allow deselecting all
      if (value.length === 1) return;
      onChange(value.filter((f) => f !== format));
    } else {
      onChange([...value, format]);
    }
  };

  return (
    <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
      {ALL_FORMATS.map((format) => {
        const selected = value.includes(format);
        return (
          <TouchableOpacity
            key={format}
            onPress={() => toggle(format)}
            activeOpacity={0.75}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 9,
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
              {FORMAT_LABELS[format]}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
