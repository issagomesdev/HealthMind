import { useState } from "react";
import { CommunityCategory, CommunityPost } from "../../core/types";
import { CommunityService } from "../../services/community/CommunityService";

interface UseCreatePostControllerOptions {
  userName: string;
  onCancel: () => void;
  onSuccess: (post: CommunityPost) => void;
}

export function useCreatePostController({
  userName,
  onCancel,
  onSuccess,
}: UseCreatePostControllerOptions) {
  const [topic, setTopic] = useState("");
  const [content, setContent] = useState("");
  const [categories, setCategories] = useState<CommunityCategory[]>([]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleCategory = (cat: CommunityCategory) => {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async () => {
    if (!topic) {
      setError("Selecione um tópico para a publicação.");
      return;
    }
    if (!content.trim()) {
      setError("Escreva algo antes de publicar.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const post = await CommunityService.createPost(
        { topic, categories, content: content.trim(), image: imageUri },
        userName
      );
      onSuccess(post);
    } catch {
      setError("Não foi possível publicar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return {
    topic,
    content,
    categories,
    imageUri,
    loading,
    error,
    setTopic,
    setContent,
    setImageUri,
    toggleCategory,
    handleSubmit,
    handleCancel: onCancel,
  };
}
