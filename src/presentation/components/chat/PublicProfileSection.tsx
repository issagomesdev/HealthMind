import React from "react";
import { View } from "react-native";
import { AppText } from "../ui/AppText";
import type { ColorTokens } from "../../../core/theme/colors";

interface PublicProfileSectionProps {
  title: string;
  children: React.ReactNode;
  colors: ColorTokens;
}

export function PublicProfileSection({ title, children, colors }: PublicProfileSectionProps) {
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <AppText
        style={{
          fontSize: 13,
          fontWeight: "700",
          color: colors.subtle,
          textTransform: "uppercase",
          letterSpacing: 0.8,
          marginBottom: 12,
        }}
      >
        {title}
      </AppText>
      {children}
    </View>
  );
}
