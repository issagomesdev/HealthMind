import React from "react";
import { View, TouchableOpacity } from "react-native";
import { AppText } from "../ui/AppText";

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function SectionHeader({
  title,
  actionLabel,
  onAction,
  className,
}: SectionHeaderProps) {
  return (
    <View className={`flex-row items-center justify-between mb-3 ${className ?? ""}`}>
      <AppText variant="heading3" color="secondary" className="font-bold">
        {title}
      </AppText>
      {actionLabel && onAction && (
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <AppText variant="smallMedium" color="secondary">
            {actionLabel}
          </AppText>
        </TouchableOpacity>
      )}
    </View>
  );
}
