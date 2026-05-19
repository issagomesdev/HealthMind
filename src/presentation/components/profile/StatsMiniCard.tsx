import React from "react";
import { View } from "react-native";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";

interface StatsMiniCardProps {
  value: string | number;
  label: string;
  highlight?: boolean;
}

export function StatsMiniCard({ value, label, highlight }: StatsMiniCardProps) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 8,
        backgroundColor: highlight ? colors.secondary + "12" : colors.surface,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: highlight ? colors.secondary + "30" : colors.border,
        gap: 2,
      }}
    >
      <AppText
        style={{
          fontSize: 20,
          fontWeight: "800",
          color: highlight ? colors.secondary : colors.content,
        }}
      >
        {value}
      </AppText>
      <AppText style={{ fontSize: 11, fontWeight: "500", color: colors.subtle, textAlign: "center" }}>
        {label}
      </AppText>
    </View>
  );
}
