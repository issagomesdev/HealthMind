import React from "react";
import { View, Switch } from "react-native";
import { AppText } from "../../ui/AppText";
import { useTheme } from "../../../../core/theme";

interface AvailabilitySwitchProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  trackColor?: { false?: string; true?: string };
}

export function AvailabilitySwitch({
  label,
  description,
  value,
  onValueChange,
  trackColor,
}: AvailabilitySwitchProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <AppText style={{ fontSize: 14, fontWeight: "600", color: colors.content }}>
          {label}
        </AppText>
        {description ? (
          <AppText style={{ fontSize: 12, color: colors.subtle, lineHeight: 17 }}>
            {description}
          </AppText>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: trackColor?.false ?? colors.border,
          true: trackColor?.true ?? colors.secondary,
        }}
        thumbColor="#fff"
        ios_backgroundColor={colors.border}
      />
    </View>
  );
}
