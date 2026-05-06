import { useState, useCallback } from "react";
import { ProgressSummary } from "../../core/types";
import { ProgressService } from "../../services/progress/ProgressService";

interface UseProgressController {
  progress: ProgressSummary | null;
  loading: boolean;
  loadProgress: () => Promise<void>;
}

export function useProgressController(): UseProgressController {
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [loading, setLoading] = useState(false);

  const loadProgress = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ProgressService.getProgressSummary();
      setProgress(data);
    } finally {
      setLoading(false);
    }
  }, []);

  return { progress, loading, loadProgress };
}
