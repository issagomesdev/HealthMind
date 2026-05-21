import React from "react";
import { useRouter } from "expo-router";
import { OnboardingScreen } from "../src/presentation/screens/onboarding/public/OnboardingScreen";
import { useForceLightScheme } from "../src/core/theme";

export default function OnboardingPage() {
  useForceLightScheme();
  const router = useRouter();

  return (
    <OnboardingScreen
      onFinish={() => router.replace("/(auth)/register")}
      onLogin={() => router.replace("/(auth)/login")}
    />
  );
}
