import React, { useState } from "react";
import { Redirect } from "expo-router";
import { SplashScreen } from "../src/presentation/screens/splash/SplashScreen";
import { useAuth } from "../src/core/auth/AuthContext";

export default function IndexPage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [splashDone, setSplashDone] = useState(false);

  if (!splashDone || isLoading) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />;
  }

  if (isAuthenticated && user) {
    return <Redirect href="/(protected)/(tabs)/home" />;
  }

  return <Redirect href="/onboarding" />;
}
