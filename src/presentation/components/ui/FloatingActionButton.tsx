import React from "react";
import { TouchableOpacity, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  style?: ViewStyle;
}

export function FloatingActionButton({
  onPress,
  icon = "add",
  style,
}: FloatingActionButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        {
          position: "absolute",
          bottom: 24,
          right: 20,
          borderRadius: 28,
          shadowColor: "#2A9D8F",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          elevation: 10,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={["#2A9D8F", "#4C78D9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={28} color="#fff" />
      </LinearGradient>
    </TouchableOpacity>
  );
}
