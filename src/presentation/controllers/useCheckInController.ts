import { useState, useCallback } from "react";
import { MoodType } from "../../core/types";
import { MoodService } from "../../services/mood/MoodService";

interface UseCheckInControllerOptions {
  initialMood?: MoodType;
  onSuccess: () => void;
  onCancel: () => void;
}

export function useCheckInController({
  initialMood,
  onSuccess,
  onCancel,
}: UseCheckInControllerOptions) {
  const [mood, setMood] = useState<MoodType | null>(initialMood ?? null);
  const [stressLevel, setStressLevel] = useState(5);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!mood) {
      setError("Selecione como você está se sentindo.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await MoodService.saveEntry({
        mood,
        stressLevel,
        description: description.trim(),
        createdAt: new Date().toISOString(),
      });
      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao salvar registro. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }, [mood, stressLevel, description, onSuccess]);

  const handleCancel = useCallback(() => {
    onCancel();
  }, [onCancel]);

  return {
    mood,
    stressLevel,
    description,
    loading,
    error,
    setMood,
    setStressLevel,
    setDescription,
    handleSubmit,
    handleCancel,
  };
}
