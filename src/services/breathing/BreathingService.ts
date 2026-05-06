import { BreathingPreset } from "../../core/types";

export const BREATHING_PRESETS: BreathingPreset[] = [
  {
    id: "calm_anxiety",
    name: "Calm Anxiety",
    description: "Reduz a ansiedade com expiração prolongada",
    inhale: 4,
    hold: 4,
    exhale: 6,
  },
  {
    id: "anti_stress",
    name: "Anti Stress",
    description: "Alivia o estresse rapidamente",
    inhale: 4,
    hold: 2,
    exhale: 4,
  },
  {
    id: "focus_mode",
    name: "Focus Mode",
    description: "Melhora o foco e a clareza mental",
    inhale: 5,
    hold: 0,
    exhale: 5,
  },
  {
    id: "sleep_prep",
    name: "Sleep Preparation",
    description: "Prepara o corpo e a mente para dormir",
    inhale: 4,
    hold: 7,
    exhale: 8,
  },
];

export const SESSION_DURATIONS = [1, 3, 5, 10] as const;

class BreathingService {
  getPresets(): BreathingPreset[] {
    return BREATHING_PRESETS;
  }

  getDefaultPreset(): BreathingPreset {
    return BREATHING_PRESETS[0];
  }

  getPresetById(id: string): BreathingPreset {
    return BREATHING_PRESETS.find((p) => p.id === id) ?? BREATHING_PRESETS[0];
  }

  getSessionDurations(): readonly number[] {
    return SESSION_DURATIONS;
  }

  getCycleDuration(preset: BreathingPreset): number {
    return preset.inhale + preset.hold + preset.exhale;
  }

  buildPhaseSequence(preset: BreathingPreset): Array<{ type: "inhale" | "hold" | "exhale"; duration: number }> {
    const phases: Array<{ type: "inhale" | "hold" | "exhale"; duration: number }> = [
      { type: "inhale", duration: preset.inhale },
    ];
    if (preset.hold > 0) {
      phases.push({ type: "hold", duration: preset.hold });
    }
    phases.push({ type: "exhale", duration: preset.exhale });
    return phases;
  }
}

export const breathingService = new BreathingService();
