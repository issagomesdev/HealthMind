import React from "react";
import { useRouter } from "expo-router";
import { OnboardingCompleteScreen } from "../../src/presentation/screens/onboarding/profile/OnboardingCompleteScreen";
import { ROUTES } from "../../src/core/constants/routes";

export default function OnboardingCompletePage() {
  const router = useRouter();

  return (
    <OnboardingCompleteScreen
      onStart={() => router.replace(ROUTES.HOME)}
    />
  );
}
