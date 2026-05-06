import React from "react";
import { View } from "react-native";
import { AppText } from "../ui/AppText";

interface GreetingHeaderProps {
  greeting: string;
  subtitle: string;
  variant?: "patient" | "professional";
}

export function GreetingHeader({
  greeting,
  subtitle,
  variant = "patient",
}: GreetingHeaderProps) {
  return (
    <View className="gap-1 mb-6">
      <AppText
        variant="heading1"
        color={variant === "professional" ? "secondary" : "default"}
        className="font-bold leading-tight"
      >
        {greeting}
      </AppText>
      <AppText variant="body" color="muted">
        {subtitle}
      </AppText>
    </View>
  );
}
