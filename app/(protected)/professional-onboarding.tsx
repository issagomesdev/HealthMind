import React from "react";
import { Redirect, useRouter } from "expo-router";
import { ProfessionalOnboardingScreen } from "../../src/presentation/screens/onboarding/profile/ProfessionalOnboardingScreen";
import { useAuth } from "../../src/core/auth/AuthContext";
import { ROUTES } from "../../src/core/constants/routes";

export default function ProfessionalOnboardingPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (user && user.role !== "professional") {
    return <Redirect href={ROUTES.PATIENT_ONBOARDING} />;
  }

  return (
    <ProfessionalOnboardingScreen
      onComplete={() => router.replace(ROUTES.ONBOARDING_COMPLETE)}
    />
  );
}
