import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { AppText } from "../ui/AppText";
import { BreathingPhase } from "../../../core/types";

interface BreathingInstructionProps {
  phase: BreathingPhase;
  isRunning: boolean;
}

const PHASE_LABEL: Record<BreathingPhase, string> = {
  inhale: "Inspire...",
  hold: "Segure...",
  exhale: "Expire...",
};

export function BreathingInstruction({ phase, isRunning }: BreathingInstructionProps) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const prevPhase = useRef<BreathingPhase>(phase);

  useEffect(() => {
    if (prevPhase.current === phase) return;
    prevPhase.current = phase;

    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [phase]);

  const label = isRunning ? PHASE_LABEL[phase] : "Toque play para iniciar";

  return (
    <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
      <AppText
        variant="heading3"
        color="secondary"
        className="text-center tracking-wide"
        style={{ fontWeight: "300", letterSpacing: 2 }}
      >
        {label}
      </AppText>
    </Animated.View>
  );
}
