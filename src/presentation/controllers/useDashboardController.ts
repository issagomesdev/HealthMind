import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../core/auth/AuthContext";
import { DashboardService } from "../../services/dashboard/DashboardService";
import {
  PatientDashboardData,
  ProfessionalDashboardData,
  MoodValue,
} from "../../core/types";

type DashboardState =
  | { role: "patient"; data: PatientDashboardData }
  | { role: "professional"; data: ProfessionalDashboardData };

export function useDashboardController() {
  const { user } = useAuth();
  const [state, setState] = useState<DashboardState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      if (user.role === "professional") {
        const data = await DashboardService.getProfessionalDashboard();
        setState({ role: "professional", data });
      } else {
        const data = await DashboardService.getPatientDashboard();
        setState({ role: "patient", data });
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar dashboard."
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const selectMood = useCallback((mood: MoodValue) => {
    setState((prev) => {
      if (prev?.role === "patient") {
        return { ...prev, data: { ...prev.data, selectedMood: mood } };
      }
      return prev;
    });
  }, []);

  return { state, loading, error, user, reload: load, selectMood };
}
