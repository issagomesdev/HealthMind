import React from "react";
import { View } from "react-native";
import { useTheme } from "../../../core/theme";

interface ReportSkeletonCardProps {
  height?: number;
  width?: string | number;
  borderRadius?: number;
}

export function ReportSkeletonCard({
  height = 80,
  width = "100%",
  borderRadius = 12,
}: ReportSkeletonCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        height,
        width: width as any,
        borderRadius,
        backgroundColor: colors.muted,
        opacity: 0.5,
      }}
    />
  );
}
