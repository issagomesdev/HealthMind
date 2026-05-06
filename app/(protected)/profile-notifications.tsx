import React from "react";
import { useRouter } from "expo-router";
import { NotificationSettingsScreen } from "../../src/presentation/screens/profile/NotificationSettingsScreen";

export default function ProfileNotificationsPage() {
  const router = useRouter();
  return <NotificationSettingsScreen onBack={() => router.back()} />;
}
