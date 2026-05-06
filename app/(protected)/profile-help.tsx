import React from "react";
import { useRouter } from "expo-router";
import { HelpCenterScreen } from "../../src/presentation/screens/profile/HelpCenterScreen";

export default function ProfileHelpPage() {
  const router = useRouter();
  return <HelpCenterScreen onBack={() => router.back()} />;
}
