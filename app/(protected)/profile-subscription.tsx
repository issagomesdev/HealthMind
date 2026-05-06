import React from "react";
import { useRouter } from "expo-router";
import { SubscriptionScreen } from "../../src/presentation/screens/profile/SubscriptionScreen";

export default function ProfileSubscriptionPage() {
  const router = useRouter();
  return <SubscriptionScreen onBack={() => router.back()} />;
}
