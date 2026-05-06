import React from "react";
import { TextInput, View, TextInputProps } from "react-native";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";

interface AppTextAreaProps extends Omit<TextInputProps, "multiline" | "style"> {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  minHeight?: number;
  maxLength?: number;
}

export function AppTextArea({
  label,
  placeholder,
  value,
  onChangeText,
  minHeight = 110,
  maxLength,
  ...rest
}: AppTextAreaProps) {
  const { colors, isDark } = useTheme();

  return (
    <View className="gap-2">
      {label && (
        <AppText variant="bodyMedium" className="font-semibold">
          {label}
        </AppText>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.subtle}
        multiline
        textAlignVertical="top"
        maxLength={maxLength}
        style={{
          minHeight,
          borderWidth: 1.5,
          borderColor: isDark ? colors.border : "#E5E7EB",
          borderRadius: 14,
          paddingHorizontal: 14,
          paddingVertical: 12,
          fontSize: 15,
          lineHeight: 22,
          color: isDark ? colors.content : "#1F2937",
          backgroundColor: isDark ? colors.surface : "#FFFFFF",
        }}
        {...rest}
      />
    </View>
  );
}
