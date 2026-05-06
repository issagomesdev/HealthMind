import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";

interface FeatureListItemProps {
  label: string;
  enabled?: boolean;
  premium?: boolean;
}

export function FeatureListItem({ label, enabled = true, premium = false }: FeatureListItemProps) {
  if (!enabled) {
    return (
      <View className="flex-row items-center gap-3">
        <Ionicons name="close-circle-outline" size={20} color="#9CA3AF" />
        <AppText
          variant="body"
          color="muted"
          style={{ textDecorationLine: "line-through" }}
        >
          {label}
        </AppText>
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-3">
      <View
        className="w-5 h-5 rounded-full items-center justify-center"
        style={{ backgroundColor: premium ? "#2A9D8F" : "#6DBF7B" }}
      >
        <Ionicons name="checkmark" size={13} color="#fff" />
      </View>
      <AppText
        variant="body"
        className={premium ? "font-semibold" : ""}
      >
        {label}
      </AppText>
    </View>
  );
}
