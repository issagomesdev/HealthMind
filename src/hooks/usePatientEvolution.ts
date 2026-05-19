import { useState, useEffect, useCallback } from "react";
import { evolutionService } from "../services/evolutionService";
import type { PatientEvolutionDetails } from "../types/evolution";

export function usePatientEvolution(patientId: string) {
  const [details, setDetails] = useState<PatientEvolutionDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  useEffect(() => {
    if (!patientId) return;
    let cancelled = false;
    setIsLoading(true);

    evolutionService
      .getPatientDetails(patientId)
      .then((data) => {
        if (!cancelled) setDetails(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [patientId, refreshKey]);

  return { details, isLoading, refresh };
}
