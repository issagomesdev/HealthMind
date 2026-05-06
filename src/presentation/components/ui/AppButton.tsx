import React from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { AppText } from "./AppText";
import { useTheme } from "../../../core/theme";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "gradient";
type Size = "sm" | "md" | "lg";

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  className?: string; // For Tailwind CSS users, optional
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export function AppButton({
  label,
  onPress,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  style,
  className,
  textStyle,
  icon,
  fullWidth = true,
}: AppButtonProps) {
  const { colors, isDark } = useTheme();
  const isDisabled = disabled || loading;

  const sizeStyles: Record<Size, { height: number; px: number; fontSize: number }> = {
    sm: { height: 40, px: 16, fontSize: 14 },
    md: { height: 52, px: 20, fontSize: 16 },
    lg: { height: 58, px: 24, fontSize: 18 },
  };

  const { height, px, fontSize } = sizeStyles[size];

  const containerBase: ViewStyle = {
    height,
    borderRadius: height / 2,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: px,
    opacity: isDisabled ? 0.6 : 1,
    alignSelf: fullWidth ? "stretch" : "flex-start",
  };

  if (variant === "gradient") {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.85}
        style={[{ alignSelf: fullWidth ? "stretch" : "flex-start" }, style]}
      >
        <LinearGradient
          colors={["#2A9D8F", "#4C78D9"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[containerBase, { alignSelf: "stretch", opacity: isDisabled ? 0.6 : 1 }]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              {icon}
              <AppText
                variant="bodyMedium"
                color="white"
                style={[{ fontSize, fontWeight: "600" }, textStyle]}
              >
                {label}
              </AppText>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  const variantStyles: Record<Exclude<Variant, "gradient">, ViewStyle> = {
    primary: {
      backgroundColor: colors.secondary,
    },
    secondary: {
      backgroundColor: colors.primary,
    },
    outline: {
      backgroundColor: "transparent",
      borderWidth: 1.5,
      borderColor: colors.secondary,
    },
    ghost: {
      backgroundColor: "transparent",
    },
  };

  const variantTextColor: Record<Exclude<Variant, "gradient">, string> = {
    primary: "#fff",
    secondary: "#fff",
    outline: colors.secondary,
    ghost: colors.secondary,
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      style={[containerBase, variantStyles[variant as Exclude<Variant, "gradient">], style]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "outline" || variant === "ghost" ? colors.secondary : "#fff"}
          size="small"
        />
      ) : (
        <>
          {icon}
          <AppText
            variant="bodyMedium"
            style={[
              {
                fontSize,
                fontWeight: "600",
                color: variantTextColor[variant as Exclude<Variant, "gradient">],
              },
              textStyle,
            ]}
          >
            {label}
          </AppText>
        </>
      )}
    </TouchableOpacity>
  );
}
