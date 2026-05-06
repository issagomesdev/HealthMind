import React from "react";
import { Text, TextProps } from "react-native";

type Variant =
  | "heading1"
  | "heading2"
  | "heading3"
  | "body"
  | "bodyMedium"
  | "small"
  | "smallMedium"
  | "caption"
  | "label";

type ColorVariant =
  | "default"
  | "muted"
  | "primary"
  | "secondary"
  | "accent"
  | "error"
  | "white";

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: ColorVariant;
  children: React.ReactNode;
}

const variantClass: Record<Variant, string> = {
  heading1:   "text-[32px] font-bold leading-10",
  heading2:   "text-2xl font-bold leading-8",
  heading3:   "text-xl font-semibold leading-7",
  body:       "text-base font-normal leading-6",
  bodyMedium: "text-base font-medium leading-6",
  small:      "text-sm font-normal leading-5",
  smallMedium:"text-sm font-medium leading-5",
  caption:    "text-xs font-normal leading-4",
  label:      "text-[13px] font-semibold tracking-wide",
};

const colorClass: Record<ColorVariant, string> = {
  default:   "text-content dark:text-content-dark",
  muted:     "text-subtle dark:text-subtle-dark",
  primary:   "text-primary dark:text-primary-dark",
  secondary: "text-secondary dark:text-secondary-dark",
  accent:    "text-accent dark:text-accent-dark",
  error:     "text-error dark:text-error-dark",
  white:     "text-white",
};

export function AppText({
  variant = "body",
  color = "default",
  className,
  children,
  ...props
}: AppTextProps & { className?: string }) {
  return (
    <Text
      className={`${variantClass[variant]} ${colorClass[color]} ${className ?? ""}`}
      {...props}
    >
      {children}
    </Text>
  );
}
