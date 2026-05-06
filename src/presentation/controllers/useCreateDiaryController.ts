import { useState } from "react";
import { FeelingTag } from "../../core/types";
import { DiaryService } from "../../services/diary/DiaryService";

interface UseCreateDiaryControllerOptions {
  onCancel: () => void;
  onSuccess: () => void;
}

export function useCreateDiaryController({
  onCancel,
  onSuccess,
}: UseCreateDiaryControllerOptions) {
  const [content, setContent] = useState("");
  const [feelings, setFeelings] = useState<FeelingTag[]>([]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleFeeling = (tag: FeelingTag) => {
    setFeelings((prev) =>
      prev.includes(tag) ? prev.filter((f) => f !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      setError("Escreva algo sobre o seu dia antes de salvar.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await DiaryService.createEntry({ content: content.trim(), feelings, imageUri });
      onSuccess();
    } catch {
      setError("Não foi possível salvar o registro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return {
    content,
    feelings,
    imageUri,
    loading,
    error,
    setContent,
    setImageUri,
    toggleFeeling,
    handleSubmit,
    handleCancel,
  };
}
