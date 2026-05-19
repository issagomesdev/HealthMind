import React from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../../src/core/auth/AuthContext";
import { NotificationsScreen } from "../../src/presentation/screens/notifications/NotificationsScreen";
import { ProfessionalNotificationsScreen } from "../../src/presentation/screens/notifications/ProfessionalNotificationsScreen";

export default function NotificationsPage() {
  const router = useRouter();
  const { user } = useAuth();

  if (user?.role === "professional") {
    return <ProfessionalNotificationsScreen onBack={() => router.back()} />;
  }

  return <NotificationsScreen onBack={() => router.back()} />;
}
