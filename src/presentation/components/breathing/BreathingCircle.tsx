import React, { useEffect, useRef } from "react";
import { View, Animated, Easing, Text } from "react-native";
import { useTheme } from "../../../core/theme";
import { BreathingPhase } from "../../../core/types";

const BASE_SIZE = 220;
const MIN_SCALE = 1.0;
const MAX_SCALE = 1.38;

interface BreathingCircleProps {
  phase: BreathingPhase;
  phaseDuration: number;
  formattedTime: string;
  isRunning: boolean;
}

export function BreathingCircle({
  phase,
  phaseDuration,
  formattedTime,
  isRunning,
}: BreathingCircleProps) {
  const { colors, isDark } = useTheme();
  const teal = colors.secondary;

  const scaleAnim = useRef(new Animated.Value(MIN_SCALE)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    if (animRef.current) animRef.current.stop();

    const toScale = phase === "exhale" ? MIN_SCALE : MAX_SCALE;
    const easing =
      phase === "inhale"
        ? Easing.out(Easing.sin)
        : phase === "exhale"
        ? Easing.in(Easing.sin)
        : Easing.linear;

    animRef.current = Animated.timing(scaleAnim, {
      toValue: toScale,
      duration: phaseDuration * 1000,
      easing,
      useNativeDriver: true,
    });

    animRef.current.start();

    return () => animRef.current?.stop();
  }, [phase, phaseDuration]);

  // Pause/resume: stop animation when paused, restart on play
  const isRunningRef = useRef(isRunning);
  useEffect(() => {
    if (!isRunning && isRunningRef.current) {
      animRef.current?.stop();
    }
    isRunningRef.current = isRunning;
  }, [isRunning]);

  const circleColor = isDark
    ? `rgba(31, 122, 115, 0.35)`
    : `rgba(42, 157, 143, 0.18)`;
  const borderColor = isDark
    ? `rgba(42, 157, 143, 0.55)`
    : `rgba(42, 157, 143, 0.38)`;

  const containerSize = BASE_SIZE * 1.65;

  return (
    <View
      style={{
        width: containerSize,
        height: containerSize,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Static glow rings — create depth around the animated circle */}
      <View
        style={{
          position: "absolute",
          width: BASE_SIZE * 1.55,
          height: BASE_SIZE * 1.55,
          borderRadius: (BASE_SIZE * 1.55) / 2,
          backgroundColor: teal,
          opacity: 0.04,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: BASE_SIZE * 1.3,
          height: BASE_SIZE * 1.3,
          borderRadius: (BASE_SIZE * 1.3) / 2,
          backgroundColor: teal,
          opacity: 0.07,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: BASE_SIZE * 1.12,
          height: BASE_SIZE * 1.12,
          borderRadius: (BASE_SIZE * 1.12) / 2,
          backgroundColor: teal,
          opacity: 0.11,
        }}
      />

      {/* Animated main circle */}
      <Animated.View
        style={{
          width: BASE_SIZE,
          height: BASE_SIZE,
          borderRadius: BASE_SIZE / 2,
          backgroundColor: circleColor,
          borderWidth: 1.5,
          borderColor,
          alignItems: "center",
          justifyContent: "center",
          transform: [{ scale: scaleAnim }],
          shadowColor: teal,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 32,
          elevation: 18,
        }}
      >
        <Text
          style={{
            fontSize: 42,
            fontWeight: "300",
            color: isDark ? "#ffffff" : colors.primary,
            letterSpacing: 3,
          }}
        >
          {formattedTime}
        </Text>
      </Animated.View>
    </View>
  );
}
