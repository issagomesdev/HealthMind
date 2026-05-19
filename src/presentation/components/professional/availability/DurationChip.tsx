import React from "react";
import { TouchableOpacity } from "react-native";
import { AppText } from "../../ui/AppText";
import { useTheme } from "../../../../core/theme";

interface DurationChipProps {
  value: number;
  selected: boolean;
  onPress: () => void;
}

export function DurationChip({ value, selected, onPress }: DurationChipProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
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
        {value} min
      </AppText>
    </TouchableOpacity>
  );
}
