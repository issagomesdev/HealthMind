import React from "react";
import { useRouter } from "expo-router";
import { DiaryPrivacyScreen } from "../../src/presentation/screens/profile/DiaryPrivacyScreen";

export default function ProfilePrivacyPage() {
  const router = useRouter();
  return <DiaryPrivacyScreen onBack={() => router.back()} />;
}
