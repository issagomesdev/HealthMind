import React, { useState } from "react";
import { View, TouchableOpacity, StatusBar } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../components/ui/AppText";
import { BreathingCircle } from "../../components/breathing/BreathingCircle";
import { BreathingInstruction } from "../../components/breathing/BreathingInstruction";
import { BreathingControls } from "../../components/breathing/BreathingControls";
import { BreathingSettingsModal } from "../../components/breathing/BreathingSettingsModal";
import { BreathingSessionCompleteModal } from "../../components/breathing/BreathingSessionCompleteModal";
import { useBreathingController } from "../../controllers/useBreathingController";
import { useTheme } from "../../../core/theme";

interface BreathingSessionScreenProps {
  onBack: () => void;
}

function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function BreathingSessionScreen({ onBack }: BreathingSessionScreenProps) {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const ctrl = useBreathingController();
  const [showSettings, setShowSettings] = useState(false);

  const gradientColors: readonly [string, string, string] = isDark
    ? ["#0a1c1a", "#0d1f1d", "#101515"]
    : ["#edfaf7", "#f4fdfb", "#f8fffe"];

  const handleRepeat = () => {
    ctrl.reset();
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* Back button */}
        <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 20 }}>
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.7}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.07)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)"}
            />
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View
          style={{
            alignItems: "center",
            paddingTop: 20,
            paddingBottom: 8,
            gap: 6,
          }}
        >
          <AppText
            variant="heading2"
            color="secondary"
            className="font-bold text-center"
            style={{ letterSpacing: 0.5 }}
          >
            Relax & Breathe
          </AppText>
          <AppText variant="small" color="muted" className="text-center">
            Acompanhe o círculo para encontrar seu equilíbrio.
          </AppText>

          {/* Preset badge */}
          <View
            style={{
              marginTop: 4,
              paddingHorizontal: 12,
              paddingVertical: 5,
              borderRadius: 20,
              backgroundColor: isDark ? "rgba(42,157,143,0.18)" : "rgba(42,157,143,0.12)",
            }}
          >
            <AppText variant="caption" color="secondary" className="font-semibold">
              {ctrl.config.preset.name}
            </AppText>
          </View>
        </View>

        {/* Main breathing area — centered */}
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <BreathingCircle
            phase={ctrl.currentPhase}
            phaseDuration={ctrl.phaseDuration}
            formattedTime={formatTime(ctrl.totalSecondsRemaining)}
            isRunning={ctrl.isRunning}
          />
        </View>

        {/* Instruction */}
        <View style={{ alignItems: "center", paddingBottom: 36 }}>
          <BreathingInstruction
            phase={ctrl.currentPhase}
            isRunning={ctrl.isRunning}
          />
        </View>

        {/* Controls */}
        <View
          style={{ paddingBottom: insets.bottom + 40, paddingHorizontal: 20 }}
        >
          <BreathingControls
            isRunning={ctrl.isRunning}
            isComplete={ctrl.isComplete}
            onPlay={ctrl.play}
            onPause={ctrl.pause}
            onReset={ctrl.reset}
            onSettings={() => setShowSettings(true)}
          />
        </View>
      </LinearGradient>

      {/* Settings modal */}
      <BreathingSettingsModal
        visible={showSettings}
        config={ctrl.config}
        onClose={() => setShowSettings(false)}
        onApply={ctrl.updateConfig}
      />

      {/* Session complete modal */}
      <BreathingSessionCompleteModal
        visible={ctrl.isComplete}
        onDone={onBack}
        onRepeat={handleRepeat}
      />
    </View>
  );
}
