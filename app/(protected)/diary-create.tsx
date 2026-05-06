import React from "react";
import { useRouter } from "expo-router";
import { CreateDiaryEntryScreen } from "../../src/presentation/screens/diary/CreateDiaryEntryScreen";

export default function DiaryCreatePage() {
  const router = useRouter();

  return (
    <CreateDiaryEntryScreen
      onBack={() => router.back()}
      onSaved={() => router.replace("/(protected)/(tabs)/diary")}
    />
  );
}
