import React from "react";
import { Stack } from "expo-router";
import { useForceLightScheme } from "../../src/core/theme";

export default function AuthLayout() {
  useForceLightScheme();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" options={{ animation: "fade" }} />
      <Stack.Screen name="register" options={{ animation: "slide_from_right" }} />
    </Stack>
  );
}
