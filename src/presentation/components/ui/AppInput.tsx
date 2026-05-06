import React, { useState } from "react";
import { View, TextInput, TextInputProps, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "./AppText";
import { useTheme } from "../../../core/theme";

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  containerClass?: string;
  isPassword?: boolean;
}

export function AppInput({
  label,
  error,
  icon,
  containerClass,
  isPassword = false,
  ...props
}: AppInputProps) {
  const { colors, isDark } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`gap-1.5 ${containerClass ?? ""}`}>
      {label && (
        <AppText variant="label" color="muted" className="uppercase tracking-[0.8px]">
          {label}
        </AppText>
      )}

      <View
        className={`flex-row items-center rounded-xl border min-h-[52px] px-3.5 bg-surface dark:bg-surface-dark ${
          error
            ? "border-error dark:border-error-dark"
            : "border-border dark:border-border-dark"
        }`}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={colors.subtle}
            style={{ marginRight: 10 }}
          />
        )}

        <TextInput
          className="flex-1 text-[15px] py-3.5 text-content dark:text-content-dark"
          placeholderTextColor={colors.subtle}
          secureTextEntry={isPassword && !showPassword}
          autoCapitalize="none"
          {...props}
        />

        {isPassword && (
          <TouchableOpacity
            onPress={() => setShowPassword((v) => !v)}
            className="ml-2"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.subtle}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <AppText variant="caption" color="error" className="mt-0.5">
          {error}
        </AppText>
      )}
    </View>
  );
}
