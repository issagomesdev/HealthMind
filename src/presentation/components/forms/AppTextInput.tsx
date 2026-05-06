import React from "react";
import { View, TextInput, TextInputProps } from "react-native";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";

interface AppTextInputProps extends Omit<TextInputProps, "style"> {
  label?: string;
}

export function AppTextInput({ label, ...rest }: AppTextInputProps) {
  const { colors, isDark } = useTheme();

  return (
    <View className="gap-1.5">
      {label && (
        <AppText variant="small" className="font-semibold" color="muted">
          {label}
        </AppText>
      )}
      <TextInput
        placeholderTextColor={colors.subtle}
        style={{
          height: 52,
          borderWidth: 1.5,
          borderColor: isDark ? colors.border : "#E5E7EB",
          borderRadius: 14,
          paddingHorizontal: 16,
          fontSize: 15,
          color: isDark ? colors.content : "#1F2937",
          backgroundColor: isDark ? colors.surface : "#FFFFFF",
        }}
        {...rest}
      />
    </View>
  );
}
