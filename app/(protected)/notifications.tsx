import React from "react";
import { useRouter } from "expo-router";
import { NotificationsScreen } from "../../src/presentation/screens/notifications/NotificationsScreen";

export default function NotificationsPage() {
  const router = useRouter();
  return <NotificationsScreen onBack={() => router.back()} />;
}
