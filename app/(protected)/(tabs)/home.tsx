import React from "react";
import { useRouter } from "expo-router";
import { DashboardScreen } from "../../../src/presentation/screens/dashboard/DashboardScreen";

export default function HomePage() {
  const router = useRouter();

  return (
    <DashboardScreen
      onNavigateToSettings={() => router.push("/(protected)/settings")}
    />
  );
}
