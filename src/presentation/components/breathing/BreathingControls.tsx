import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../core/theme";

interface BreathingControlsProps {
  isRunning: boolean;
  isComplete: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSettings: () => void;
}

export function BreathingControls({
  isRunning,
  isComplete,
  onPlay,
  onPause,
  onReset,
  onSettings,
}: BreathingControlsProps) {
  const { colors, isDark } = useTheme();

  const sideButtonBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const sideIconColor = isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.45)";

  return (
    <View className="flex-row items-center justify-center gap-8">
      {/* Reset */}
      <TouchableOpacity
        onPress={onReset}
        activeOpacity={0.7}
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: sideButtonBg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="refresh-outline" size={22} color={sideIconColor} />
      </TouchableOpacity>

      {/* Play / Pause — main CTA */}
      <TouchableOpacity
        onPress={isRunning ? onPause : onPlay}
        disabled={isComplete}
        activeOpacity={0.85}
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          backgroundColor: isComplete ? colors.subtle : colors.secondary,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: colors.secondary,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.35,
          shadowRadius: 14,
          elevation: 10,
        }}
      >
        <Ionicons
          name={isRunning ? "pause" : "play"}
          size={28}
          color="#fff"
          style={{ marginLeft: isRunning ? 0 : 3 }}
        />
      </TouchableOpacity>

      {/* Settings */}
      <TouchableOpacity
        onPress={onSettings}
        activeOpacity={0.7}
        style={{
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: sideButtonBg,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="settings-outline" size={22} color={sideIconColor} />
      </TouchableOpacity>
    </View>
  );
}
