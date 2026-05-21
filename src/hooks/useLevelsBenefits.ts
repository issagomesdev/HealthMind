import { useState, useEffect, useCallback } from "react";
import { levelsBenefitsService } from "../services/levelsBenefitsService";
import type { LevelsBenefitsData } from "../types/levelsBenefits";

export function useLevelsBenefits(role: "patient" | "professional") {
  const [data, setData] = useState<LevelsBenefitsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result =
        role === "professional"
          ? await levelsBenefitsService.getProfessionalData()
          : await levelsBenefitsService.getPatientData();
      setData(result);
    } catch {
      setError("Não foi possível carregar os dados.");
    } finally {
      setIsLoading(false);
    }
  }, [role]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, isLoading, error, refresh: load };
}
