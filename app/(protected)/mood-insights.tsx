import React from "react";
import { useRouter } from "expo-router";
import { MoodInsightsScreen } from "../../src/presentation/screens/mood/MoodInsightsScreen";

export default function MoodInsightsPage() {
  const router = useRouter();
  return <MoodInsightsScreen onBack={() => router.back()} />;
}
