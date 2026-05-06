import React from "react";
import { useRouter } from "expo-router";
import { AccountSettingsScreen } from "../../src/presentation/screens/profile/AccountSettingsScreen";

export default function ProfileAccountPage() {
  const router = useRouter();
  return <AccountSettingsScreen onBack={() => router.back()} />;
}
