import { useState, useRef, useCallback, useEffect } from "react";
import { Vibration } from "react-native";
import { BreathingPhase, BreathingPreset, BreathingSessionConfig } from "../../core/types";
import { breathingService } from "../../services/breathing/BreathingService";

type PhaseStep = { type: BreathingPhase; duration: number };

interface SessionRef {
  totalSeconds: number;
  phaseElapsedMs: number;
  phaseIndex: number;
  phases: PhaseStep[];
  lastTickMs: number;
}

function buildDefault(): BreathingSessionConfig {
  return {
    preset: breathingService.getDefaultPreset(),
    durationMinutes: 5,
    soundEnabled: false,
    vibrationEnabled: false,
  };
}

export interface BreathingController {
  isRunning: boolean;
  isComplete: boolean;
  currentPhase: BreathingPhase;
  phaseDuration: number;
  totalSecondsRemaining: number;
  config: BreathingSessionConfig;
  play: () => void;
  pause: () => void;
  reset: () => void;
  updateConfig: (cfg: BreathingSessionConfig) => void;
}

export function useBreathingController(): BreathingController {
  const [config, setConfig] = useState<BreathingSessionConfig>(buildDefault);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>("inhale");
  const [phaseDuration, setPhaseDuration] = useState(
    buildDefault().preset.inhale
  );
  const [totalSecondsRemaining, setTotalSecondsRemaining] = useState(
    buildDefault().durationMinutes * 60
  );

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionRef = useRef<SessionRef>(buildSessionRef(buildDefault()));
  const configRef = useRef<BreathingSessionConfig>(buildDefault());

  function buildSessionRef(cfg: BreathingSessionConfig): SessionRef {
    const phases = breathingService.buildPhaseSequence(cfg.preset);
    return {
      totalSeconds: cfg.durationMinutes * 60,
      phaseElapsedMs: 0,
      phaseIndex: 0,
      phases,
      lastTickMs: 0,
    };
  }

  const tick = useCallback(() => {
    const s = sessionRef.current;
    const cfg = configRef.current;
    const now = Date.now();
    const elapsedMs = now - s.lastTickMs;
    s.lastTickMs = now;

    s.totalSeconds -= elapsedMs / 1000;
    s.phaseElapsedMs += elapsedMs;

    const currentP = s.phases[s.phaseIndex];
    const phaseDurationMs = currentP.duration * 1000;

    if (s.phaseElapsedMs >= phaseDurationMs) {
      s.phaseElapsedMs -= phaseDurationMs;
      s.phaseIndex = (s.phaseIndex + 1) % s.phases.length;
      const next = s.phases[s.phaseIndex];
      setCurrentPhase(next.type);
      setPhaseDuration(next.duration);

      if (cfg.vibrationEnabled) {
        Vibration.vibrate(80);
      }
    }

    if (s.totalSeconds <= 0) {
      s.totalSeconds = 0;
      clearInterval(intervalRef.current!);
      intervalRef.current = null;
      setIsRunning(false);
      setIsComplete(true);
      setTotalSecondsRemaining(0);
      return;
    }

    setTotalSecondsRemaining(Math.ceil(s.totalSeconds));
  }, []);

  const play = useCallback(() => {
    if (isComplete) return;
    sessionRef.current.lastTickMs = Date.now();
    intervalRef.current = setInterval(tick, 100);
    setIsRunning(true);
  }, [isComplete, tick]);

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const cfg = configRef.current;
    const sr = buildSessionRef(cfg);
    sessionRef.current = sr;
    setIsRunning(false);
    setIsComplete(false);
    setCurrentPhase(sr.phases[0].type);
    setPhaseDuration(sr.phases[0].duration);
    setTotalSecondsRemaining(cfg.durationMinutes * 60);
  }, []);

  const updateConfig = useCallback((cfg: BreathingSessionConfig) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    configRef.current = cfg;
    const sr = buildSessionRef(cfg);
    sessionRef.current = sr;
    setConfig(cfg);
    setIsRunning(false);
    setIsComplete(false);
    setCurrentPhase(sr.phases[0].type);
    setPhaseDuration(sr.phases[0].duration);
    setTotalSecondsRemaining(cfg.durationMinutes * 60);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return {
    isRunning,
    isComplete,
    currentPhase,
    phaseDuration,
    totalSecondsRemaining,
    config,
    play,
    pause,
    reset,
    updateConfig,
  };
}
