import React from "react";
import { useRouter } from "expo-router";
import { LoginScreen } from "../../src/presentation/screens/auth/LoginScreen";

export default function LoginPage() {
  const router = useRouter();

  return (
    <LoginScreen
      onLoginSuccess={() => router.replace("/(protected)/home")}
      onNavigateToRegister={() => router.push("/(auth)/register")}
      onForgotPassword={() => {}}
    />
  );
}
