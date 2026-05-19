import { useState, useEffect, useCallback } from "react";
import { evolutionService } from "../services/evolutionService";
import type {
  DashboardSummary,
  PatientEvolutionSummary,
  EmotionalInsight,
  EmotionalAlert,
  MoodDataPoint,
  PeriodFilter,
  SortFilter,
  RiskFilter,
} from "../types/evolution";

export function useEvolutionDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [moodHistory, setMoodHistory] = useState<MoodDataPoint[]>([]);
  const [weeklyHistory, setWeeklyHistory] = useState<MoodDataPoint[]>([]);
  const [insights, setInsights] = useState<EmotionalInsight[]>([]);
  const [alerts, setAlerts] = useState<EmotionalAlert[]>([]);
  const [patients, setPatients] = useState<PatientEvolutionSummary[]>([]);

  const [period, setPeriod] = useState<PeriodFilter>("30d");
  const [sort, setSort] = useState<SortFilter>("in_alert");
  const [risk, setRisk] = useState<RiskFilter>("all");
  const [search, setSearch] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  // Load base data (summary, weekly history, insights, alerts) on mount and refresh
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    Promise.all([
      evolutionService.getDashboardSummary(),
      evolutionService.getWeeklyMoodHistory(),
      evolutionService.getInsights(),
      evolutionService.getAlerts(),
    ])
      .then(([sum, weekly, ins, alts]) => {
        if (cancelled) return;
        setSummary(sum);
        setWeeklyHistory(weekly);
        setInsights(ins);
        setAlerts(alts);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  // Load mood history when period changes
  useEffect(() => {
    let cancelled = false;
    evolutionService.getGlobalMoodHistory(period).then((data) => {
      if (!cancelled) setMoodHistory(data);
    }).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [period, refreshKey]);

  // Load patients when filters/sort change
  useEffect(() => {
    let cancelled = false;
    evolutionService.getPatientList(sort, risk, search).then((list) => {
      if (!cancelled) setPatients(list);
    }).catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [sort, risk, search, refreshKey]);

  const dismissAlert = useCallback(async (alertId: string) => {
    await evolutionService.markAlertRead(alertId);
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, isRead: true } : a)));
  }, []);

  return {
    summary,
    moodHistory,
    weeklyHistory,
    insights,
    alerts,
    patients,
    period,
    setPeriod,
    sort,
    setSort,
    risk,
    setRisk,
    search,
    setSearch,
    isLoading,
    refresh,
    dismissAlert,
  };
}
