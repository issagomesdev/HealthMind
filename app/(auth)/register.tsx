import React from "react";
import { useRouter } from "expo-router";
import { RegisterScreen } from "../../src/presentation/screens/auth/RegisterScreen";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <RegisterScreen
      onRegisterSuccess={() => router.replace("/(protected)/home")}
      onNavigateToLogin={() => router.push("/(auth)/login")}
    />
  );
}
