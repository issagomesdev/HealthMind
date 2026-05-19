import React from "react";
import { View } from "react-native";
import { AppText } from "../../ui/AppText";
import { useTheme } from "../../../../core/theme";

interface Props {
  title: string;
  subtitle?: string;
  rightAction?: React.ReactNode;
  children: React.ReactNode;
}

export function DashboardSection({ title, subtitle, rightAction, children }: Props) {
  const { colors } = useTheme();

  return (
    <View className="px-5 mb-6">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1">
          <AppText
            style={{ fontSize: 18, fontWeight: "800", color: colors.content }}
          >
            {title}
          </AppText>
          {subtitle ? (
            <AppText variant="caption" style={{ color: colors.subtle, marginTop: 2 }}>
              {subtitle}
            </AppText>
          ) : null}
        </View>
        {rightAction ? <View>{rightAction}</View> : null}
      </View>
      {children}
    </View>
  );
}
