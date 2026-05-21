import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import type { ColorTokens } from "../../../core/theme/colors";

interface PublicProfileActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  color?: string;
  ghost?: boolean;
  colors: ColorTokens;
}

export function PublicProfileActionButton({
  icon,
  label,
  onPress,
  color,
  ghost = false,
  colors,
}: PublicProfileActionButtonProps) {
  const resolvedColor = color ?? colors.secondary;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        paddingVertical: 13,
        paddingHorizontal: 16,
        borderRadius: 14,
        width: "100%",
        backgroundColor: ghost ? "transparent" : resolvedColor,
        borderWidth: ghost ? 1.5 : 0,
        borderColor: ghost ? resolvedColor : "transparent",
      }}
    >
      <Ionicons
        name={icon}
        size={18}
        color={ghost ? resolvedColor : colors.white}
      />
      <AppText
        style={{
          fontSize: 14,
          fontWeight: "700",
          color: ghost ? resolvedColor : colors.white,
        }}
      >
        {label}
      </AppText>
    </TouchableOpacity>
  );
}
