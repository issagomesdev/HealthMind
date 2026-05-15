import React from "react";
import { useRouter } from "expo-router";
import { RegisterScreen } from "../../src/presentation/screens/auth/RegisterScreen";
import { AuthResult } from "../../src/core/types";
import { ROUTES } from "../../src/core/constants/routes";

export default function RegisterPage() {
  const router = useRouter();

  const handleRegisterSuccess = (result: AuthResult) => {
    if (!result.user.profile_completed) {
      router.replace(
        result.user.role === "patient"
          ? ROUTES.PATIENT_ONBOARDING
          : ROUTES.PROFESSIONAL_ONBOARDING
      );
    } else {
      router.replace(ROUTES.HOME);
    }
  };

  return (
    <RegisterScreen
      onRegisterSuccess={handleRegisterSuccess}
      onNavigateToLogin={() => router.push(ROUTES.LOGIN)}
    />
  );
}
