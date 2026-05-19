import React from "react";
import { useRouter } from "expo-router";
import { ProfessionalHelpCenterScreen } from "../../src/presentation/screens/profile/ProfessionalHelpCenterScreen";

export default function ProfessionalHelpPage() {
  const router = useRouter();
  return <ProfessionalHelpCenterScreen onBack={() => router.back()} />;
}
