import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";

interface ActionButtonProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}

export function ActionButton({ label, icon, onPress }: ActionButtonProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className="flex-1 bg-surface dark:bg-surface-dark rounded-2xl p-4 items-center gap-2.5"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <View className="w-12 h-12 rounded-full bg-secondary/10 dark:bg-secondary-dark/20 items-center justify-center">
        <Ionicons name={icon} size={24} color={colors.secondary} />
      </View>
      <AppText variant="smallMedium" className="font-medium text-center">
        {label}
      </AppText>
    </TouchableOpacity>
  );
}
