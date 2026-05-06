import React from "react";
import { useRouter } from "expo-router";
import { OnboardingScreen } from "../src/presentation/screens/onboarding/OnboardingScreen";

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <OnboardingScreen
      onFinish={() => router.replace("/(auth)/register")}
      onLogin={() => router.replace("/(auth)/login")}
    />
  );
}
