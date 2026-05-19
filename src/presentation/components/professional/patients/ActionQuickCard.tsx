import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../ui/AppText";

export type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

interface ActionQuickCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  color: string;
  onPress: () => void;
  badgeLabel?: string;
  badgeTone?: BadgeTone;
}

export function ActionQuickCard({
  icon,
  title,
  color,
  onPress,
  badgeLabel,
}: ActionQuickCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.78}
      style={{
        width: "47%",
        minHeight: 90,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: color + "35",
        backgroundColor: color + "0C",
        padding: 14,
        justifyContent: "space-between",
      }}
    >
      {/* Top row: icon + badge */}
      <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
        {/* Icon circle */}
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: color + "22",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name={icon} size={18} color={color} />
        </View>

        {/* Badge pill — mesma paleta do card */}
        {badgeLabel ? (
          <View
            style={{
              backgroundColor: color + "20",
              borderRadius: 99,
              borderWidth: 1,
              borderColor: color + "40",
              paddingHorizontal: 7,
              paddingVertical: 3,
              maxWidth: 88,
            }}
          >
            <AppText
              numberOfLines={1}
              style={{ fontSize: 10, fontWeight: "700", color, letterSpacing: 0.1 }}
            >
              {badgeLabel}
            </AppText>
          </View>
        ) : (
          <View style={{ width: 0 }} />
        )}
      </View>

      {/* Title */}
      <AppText
        numberOfLines={1}
        style={{ fontSize: 13, fontWeight: "700", color, marginTop: 10 }}
      >
        {title}
      </AppText>
    </TouchableOpacity>
  );
}
