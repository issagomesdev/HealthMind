import React, { useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "../../src/core/auth/AuthContext";

export default function ProtectedLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/(auth)/login");
    }
  }, [isAuthenticated, isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ animation: "none" }} />
      <Stack.Screen name="settings" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="checkin" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="diary-create" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="community-create" options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="profile-account"       options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="profile-privacy"       options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="profile-notifications" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="profile-subscription"  options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="profile-help"          options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="find-professional"    options={{ animation: "slide_from_bottom" }} />
      <Stack.Screen name="appointments"          options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="breathing"             options={{ animation: "fade" }} />
      <Stack.Screen name="notifications"         options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="mood-insights"         options={{ animation: "slide_from_right" }} />
    </Stack>
  );
}
