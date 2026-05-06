import React from "react";
import { View, ViewProps, ViewStyle } from "react-native";

interface AppCardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle;
}

export function AppCard({ children, className, style, ...props }: AppCardProps) {
  return (
    <View
      className={`rounded-2xl bg-surface dark:bg-surface-dark p-5 shadow-sm ${className ?? ""}`}
      style={[
        {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          elevation: 4,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
