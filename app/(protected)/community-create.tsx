import React from "react";
import { useRouter } from "expo-router";
import { CreatePostScreen } from "../../src/presentation/screens/community/CreatePostScreen";
import { useAuth } from "../../src/core/auth/AuthContext";
import { CommunityPost } from "../../src/core/types";

export default function CommunityCreatePage() {
  const router = useRouter();
  const { user } = useAuth();

  const handlePublished = (_post: CommunityPost) => {
    router.replace("/(protected)/(tabs)/community");
  };

  return (
    <CreatePostScreen
      userName={user?.name ?? "Usuário"}
      onBack={() => router.back()}
      onPublished={handlePublished}
    />
  );
}
