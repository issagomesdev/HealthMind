import React from "react";
import { View } from "react-native";
import { AppText } from "../../ui/AppText";
import { useTheme } from "../../../../core/theme";

interface CalendarSectionHeaderProps {
  title: string;
  right?: React.ReactNode;
}

export function CalendarSectionHeader({ title, right }: CalendarSectionHeaderProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
      }}
    >
      <AppText style={{ fontSize: 16, fontWeight: "800", color: colors.content }}>
        {title}
      </AppText>
      {right}
    </View>
  );
}
