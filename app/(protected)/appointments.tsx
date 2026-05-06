import React from "react";
import { useRouter } from "expo-router";
import { AppointmentsScreen } from "../../src/presentation/screens/appointments/AppointmentsScreen";

export default function AppointmentsPage() {
  const router = useRouter();
  return (
    <AppointmentsScreen
      onNavigateToProfessionals={() => router.push("/(protected)/find-professional")}
    />
  );
}
