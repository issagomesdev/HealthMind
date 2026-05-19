import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../ui/AppText";
import { useTheme } from "../../../../core/theme";
import type { TimeInterval } from "../../../../types/professionalAvailability";

interface TimeIntervalEditorProps {
  interval: TimeInterval;
  onEdit: (field: "start" | "end", value: string) => void;
  onRemove: () => void;
}

function applyTimeMask(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

export function TimeIntervalEditor({
  interval,
  onEdit,
  onRemove,
}: TimeIntervalEditorProps) {
  const { colors } = useTheme();

  const inputStyle = {
    width: 64,
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
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingVertical: 4,
      }}
    >
      <TextInput
        value={interval.start}
        onChangeText={(t) => onEdit("start", applyTimeMask(t))}
        placeholder="08:00"
        placeholderTextColor={colors.subtle}
        keyboardType="numeric"
        maxLength={5}
        style={inputStyle}
      />
      <AppText style={{ fontSize: 13, color: colors.subtle }}>até</AppText>
      <TextInput
        value={interval.end}
        onChangeText={(t) => onEdit("end", applyTimeMask(t))}
        placeholder="12:00"
        placeholderTextColor={colors.subtle}
        keyboardType="numeric"
        maxLength={5}
        style={inputStyle}
      />
      <TouchableOpacity
        onPress={onRemove}
        activeOpacity={0.7}
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: colors.error + "18",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 4,
        }}
      >
        <Ionicons name="close" size={15} color={colors.error} />
      </TouchableOpacity>
    </View>
  );
}
