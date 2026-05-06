import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "./AppText";
import { AppButton } from "./AppButton";
import { useTheme } from "../../../core/theme";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  icon = "folder-open-outline",
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const { colors } = useTheme();

  return (
    <View className="items-center justify-center p-10 gap-3">
      <View className="w-20 h-20 rounded-full items-center justify-center bg-muted dark:bg-muted-dark mb-2">
        <Ionicons name={icon} size={40} color={colors.secondary} />
      </View>

      <AppText variant="heading3" className="text-center">
        {title}
      </AppText>

      {description && (
        <AppText variant="body" color="muted" className="text-center max-w-[280px]">
          {description}
        </AppText>
      )}

      {actionLabel && onAction && (
        <AppButton
          label={actionLabel}
          onPress={onAction}
          variant="outline"
          fullWidth={false}
          className="mt-2"
        />
      )}
    </View>
  );
}
