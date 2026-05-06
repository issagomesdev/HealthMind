import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { CheckInMoodScreen } from "../../src/presentation/screens/mood/CheckInMoodScreen";
import { MoodType } from "../../src/core/types";

const VALID_MOODS = new Set<MoodType>(["PESSIMO", "RUIM", "NEUTRO", "BEM", "OTIMO"]);

function parseInitialMood(param: string | undefined): MoodType | undefined {
  if (param && VALID_MOODS.has(param as MoodType)) return param as MoodType;
  return undefined;
}

export default function CheckInPage() {
  const router = useRouter();
  const { initialMood } = useLocalSearchParams<{ initialMood?: string }>();

  return (
    <CheckInMoodScreen
      initialMood={parseInitialMood(initialMood)}
      onBack={() => router.back()}
      onSaved={() => router.replace("/(protected)/(tabs)/home")}
    />
  );
}
