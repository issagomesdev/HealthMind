import React from "react";
import { View } from "react-native";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";

interface UnreadBadgeProps {
  count: number;
}

export function UnreadBadge({ count }: UnreadBadgeProps) {
  const { colors } = useTheme();
  if (count <= 0) return null;

  const label = count > 9 ? "9+" : String(count);

  return (
    <View
      style={{
        backgroundColor: colors.secondary,
        minWidth: 18,
        height: 18,
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 4,
      }}
    >
      <AppText
        style={{
          fontSize: 10,
          fontWeight: "800",
          color: "#fff",
          lineHeight: 13,
        }}
      >
        {label}
      </AppText>
    </View>
  );
}
