import React from "react";
import { View, TouchableOpacity, ActivityIndicator } from "react-native";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";

interface TimeSlotSelectorProps {
  times: string[];
  selectedTime: string | null;
  loading: boolean;
  onSelect: (time: string) => void;
}

export function TimeSlotSelector({
  times,
  selectedTime,
  loading,
  onSelect,
}: TimeSlotSelectorProps) {
  const { colors } = useTheme();

  if (loading) {
    return (
      <View className="items-center py-6">
        <ActivityIndicator color={colors.secondary} />
      </View>
    );
  }

  if (times.length === 0) {
    return (
      <AppText variant="small" color="muted" className="text-center py-4">
        Nenhum horário disponível para esta data.
      </AppText>
    );
  }

  return (
    <View className="flex-row flex-wrap gap-2">
      {times.map((time) => {
        const isSelected = selectedTime === time;
        return (
          <TouchableOpacity
            key={time}
            onPress={() => onSelect(time)}
            activeOpacity={0.75}
          >
            <View
              className="px-5 py-2.5 rounded-2xl border-2"
              style={{
                borderColor: isSelected ? colors.secondary : colors.border,
                backgroundColor: isSelected ? colors.secondary : "transparent",
              }}
            >
              <AppText
                variant="bodyMedium"
                className="font-semibold"
                style={{ color: isSelected ? "#fff" : colors.content }}
              >
                {time}
              </AppText>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
