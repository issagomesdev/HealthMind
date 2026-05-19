import React from "react";
import { View, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../ui/AppText";
import { TimeIntervalEditor } from "./TimeIntervalEditor";
import { useTheme } from "../../../../core/theme";
import type {
  AvailabilityDay,
  TimeInterval,
} from "../../../../types/professionalAvailability";

interface AvailabilityDayCardProps {
  dayLabel: string;
  day: AvailabilityDay;
  onToggle: () => void;
  onAddInterval: () => void;
  onRemoveInterval: (id: string) => void;
  onEditInterval: (
    id: string,
    field: "start" | "end",
    value: string
  ) => void;
}

export function AvailabilityDayCard({
  dayLabel,
  day,
  onToggle,
  onAddInterval,
  onRemoveInterval,
  onEditInterval,
}: AvailabilityDayCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 14,
        padding: 14,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      {/* Header row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: day.enabled ? 12 : 0,
        }}
      >
        <AppText
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: day.enabled ? colors.content : colors.subtle,
          }}
        >
          {dayLabel}
        </AppText>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {!day.enabled && (
            <AppText style={{ fontSize: 12, color: colors.subtle }}>
              Fechado
            </AppText>
          )}
          <Switch
            value={day.enabled}
            onValueChange={onToggle}
            trackColor={{ false: colors.border, true: colors.secondary }}
            thumbColor="#fff"
            ios_backgroundColor={colors.border}
          />
        </View>
      </View>

      {/* Intervals */}
      {day.enabled && (
        <View style={{ gap: 4 }}>
          {day.intervals.map((interval: TimeInterval) => (
            <TimeIntervalEditor
              key={interval.id}
              interval={interval}
              onEdit={(field, value) =>
                onEditInterval(interval.id, field, value)
              }
              onRemove={() => onRemoveInterval(interval.id)}
            />
          ))}

          {/* Add interval button */}
          <TouchableOpacity
            onPress={onAddInterval}
            activeOpacity={0.75}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              marginTop: 6,
              alignSelf: "flex-start",
            }}
          >
            <Ionicons
              name="add-circle-outline"
              size={18}
              color={colors.secondary}
            />
            <AppText
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: colors.secondary,
              }}
            >
              Adicionar horário
            </AppText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
