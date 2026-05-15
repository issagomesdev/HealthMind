import React from "react";
import { useRouter } from "expo-router";
import { LoginScreen } from "../../src/presentation/screens/auth/LoginScreen";
import { AuthResult } from "../../src/core/types";
import { ROUTES } from "../../src/core/constants/routes";

export default function LoginPage() {
  const router = useRouter();

  const handleLoginSuccess = (_result: AuthResult) => {
    router.replace(ROUTES.HOME);
  };

  return (
    <LoginScreen
      onLoginSuccess={handleLoginSuccess}
      onNavigateToRegister={() => router.push(ROUTES.REGISTER)}
      onForgotPassword={() => {}}
    />
  );
}
