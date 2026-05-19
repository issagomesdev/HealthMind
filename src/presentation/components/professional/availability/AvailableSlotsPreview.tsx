import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../ui/AppText";
import { useTheme } from "../../../../core/theme";
import type { AvailableSlot } from "../../../../types/professionalAvailability";

interface AvailableSlotsPreviewProps {
  slots: AvailableSlot[];
  isLoading: boolean;
}

function SlotPlaceholder() {
  const { colors } = useTheme();
  return (
    <View
      style={{
        height: 40,
        borderRadius: 10,
        backgroundColor: colors.muted,
        marginBottom: 8,
      }}
    />
  );
}

export function AvailableSlotsPreview({
  slots,
  isLoading,
}: AvailableSlotsPreviewProps) {
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <View>
        {[1, 2, 3].map((i) => (
          <SlotPlaceholder key={i} />
        ))}
      </View>
    );
  }

  if (slots.length === 0) {
    return (
      <View
        style={{
          alignItems: "center",
          paddingVertical: 16,
          gap: 6,
        }}
      >
        <Ionicons name="calendar-outline" size={28} color={colors.subtle} />
        <AppText style={{ fontSize: 13, color: colors.subtle, textAlign: "center" }}>
          Nenhum horário disponível nos próximos dias.
        </AppText>
      </View>
    );
  }

  return (
    <View style={{ gap: 8 }}>
      {slots.map((slot, i) => (
        <View
          key={i}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            backgroundColor: colors.muted,
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
          }}
        >
          <Ionicons name="time-outline" size={16} color={colors.secondary} />
          <AppText
            style={{ fontSize: 13, fontWeight: "600", color: colors.content, flex: 1 }}
          >
            {slot.label}
          </AppText>
          <View
            style={{
              backgroundColor: colors.secondary + "20",
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 3,
            }}
          >
            <AppText
              style={{ fontSize: 11, fontWeight: "700", color: colors.secondary }}
            >
              Disponível
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );
}
