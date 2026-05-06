import React from "react";
import { TouchableOpacity } from "react-native";
import { AppText } from "../ui/AppText";

interface CategoryPillProps {
  label: string;
  active?: boolean;
  onPress?: () => void;
}

export function CategoryPill({ label, active = false, onPress }: CategoryPillProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className={`px-4 py-1.5 rounded-full border ${
        active
          ? "bg-secondary dark:bg-secondary-dark border-secondary dark:border-secondary-dark"
          : "bg-surface dark:bg-surface-dark border-border dark:border-border-dark"
      }`}
    >
      <AppText
        variant="caption"
        className="font-semibold"
        color={active ? "white" : "muted"}
      >
        {label}
      </AppText>
    </TouchableOpacity>
  );
}
