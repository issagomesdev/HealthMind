import React from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { AppText } from "../ui/AppText";
import { BreathingPreset } from "../../../core/types";
import { useTheme } from "../../../core/theme";

interface BreathingPresetSelectorProps {
  presets: BreathingPreset[];
  selectedId: string;
  onSelect: (preset: BreathingPreset) => void;
}

export function BreathingPresetSelector({
  presets,
  selectedId,
  onSelect,
}: BreathingPresetSelectorProps) {
  const { colors } = useTheme();

  return (
    <View className="gap-2">
      {presets.map((preset) => {
        const isSelected = preset.id === selectedId;
        const cycleLabel = [
          `${preset.inhale}s inspirar`,
          ...(preset.hold > 0 ? [`${preset.hold}s segurar`] : []),
          `${preset.exhale}s expirar`,
        ].join(" · ");

        return (
          <TouchableOpacity
            key={preset.id}
            onPress={() => onSelect(preset)}
            activeOpacity={0.75}
            style={{
              borderRadius: 16,
              borderWidth: 1.5,
              borderColor: isSelected ? colors.secondary : colors.border,
              backgroundColor: isSelected ? colors.secondary + "12" : "transparent",
              padding: 14,
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1 gap-0.5">
                <AppText
                  variant="bodyMedium"
                  className="font-semibold"
                  color={isSelected ? "secondary" : "default"}
                >
                  {preset.name}
                </AppText>
                <AppText variant="caption" color="muted">
                  {cycleLabel}
                </AppText>
              </View>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 1.5,
                  borderColor: isSelected ? colors.secondary : colors.border,
                  backgroundColor: isSelected ? colors.secondary : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isSelected && (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#fff",
                    }}
                  />
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
