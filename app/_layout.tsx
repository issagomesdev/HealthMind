import "../global.css";
import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "../src/core/theme/ThemeContext";
import { AuthProvider } from "../src/core/auth/AuthContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
          <Stack.Screen name="index" options={{ animation: "none" }} />
          <Stack.Screen name="onboarding" options={{ animation: "fade" }} />
          <Stack.Screen name="(auth)" options={{ animation: "slide_from_right" }} />
          <Stack.Screen name="(protected)" options={{ animation: "slide_from_right" }} />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}
