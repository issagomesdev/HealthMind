import React from "react";
import { Redirect, useRouter } from "expo-router";
import { PatientOnboardingScreen } from "../../src/presentation/screens/onboarding/profile/PatientOnboardingScreen";
import { useAuth } from "../../src/core/auth/AuthContext";
import { ROUTES } from "../../src/core/constants/routes";
import { useForceLightScheme } from "../../src/core/theme";

export default function PatientOnboardingPage() {
  useForceLightScheme();
  const { user } = useAuth();
  const router = useRouter();

  if (user && user.role !== "patient") {
    return <Redirect href={ROUTES.PROFESSIONAL_ONBOARDING} />;
  }

  return (
    <PatientOnboardingScreen
      onComplete={() => router.replace(ROUTES.ONBOARDING_COMPLETE)}
    />
  );
}
