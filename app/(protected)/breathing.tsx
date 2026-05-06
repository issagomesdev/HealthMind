import React from "react";
import { useRouter } from "expo-router";
import { BreathingSessionScreen } from "../../src/presentation/screens/breathing/BreathingSessionScreen";

export default function BreathingPage() {
  const router = useRouter();
  return <BreathingSessionScreen onBack={() => router.back()} />;
}
