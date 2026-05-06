import React from "react";
import { View, ActivityIndicator } from "react-native";
import { AppText } from "./AppText";
import { useTheme } from "../../../core/theme";

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({ message = "Carregando...", fullScreen = false }: LoadingStateProps) {
  const { colors } = useTheme();

  return (
    <View
      className={`items-center justify-center p-8 gap-3 ${
        fullScreen ? "flex-1 bg-background dark:bg-background-dark" : ""
      }`}
    >
      <ActivityIndicator size="large" color={colors.secondary} />
      {message && (
        <AppText variant="small" color="muted" className="text-center">
          {message}
        </AppText>
      )}
    </View>
  );
}
