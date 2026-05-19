import { useState, useEffect, useCallback } from "react";
import { reportsService } from "../services/reportsService";
import type {
  ReportsDashboardSummary,
  MoodChartPoint,
  ActivityAdherencePoint,
  DiaryFrequencyPoint,
  EmotionDistribution,
  PatientReportRow,
  ReportPeriod,
  PatientReportStatus,
} from "../types/reports";

const DEFAULT_SUMMARY: ReportsDashboardSummary = {
  activePatients: 0,
  consultationsCompleted: 0,
  consultationsScheduled: 0,
  averageMood: 0,
  recentAlerts: 0,
  activitiesCompleted: 0,
  diaryEntries: 0,
  moodTrend: 0,
  activityAdherencePct: 0,
};

export function useReports() {
  const [summary, setSummary] = useState<ReportsDashboardSummary>(DEFAULT_SUMMARY);
  const [moodHistory, setMoodHistory] = useState<MoodChartPoint[]>([]);
  const [activityAdherence, setActivityAdherence] = useState<ActivityAdherencePoint[]>([]);
  const [diaryFrequency, setDiaryFrequency] = useState<DiaryFrequencyPoint[]>([]);
  const [emotionDist, setEmotionDist] = useState<EmotionDistribution[]>([]);
  const [patientRows, setPatientRows] = useState<PatientReportRow[]>([]);

  const [period, setPeriod] = useState<ReportPeriod>("30d");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PatientReportStatus | "all">("all");
  const [isLoading, setIsLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [sum, mood, activity, diary, emotions, rows] = await Promise.all([
        reportsService.getDashboardSummary(),
        reportsService.getMoodHistory(period),
        reportsService.getActivityAdherence(),
        reportsService.getDiaryFrequency(),
        reportsService.getEmotionDistribution(),
        reportsService.getPatientRows(),
      ]);
      setSummary(sum);
      setMoodHistory(mood);
      setActivityAdherence(activity);
      setDiaryFrequency(diary);
      setEmotionDist(emotions);
      setPatientRows(rows);
    } catch (e) {
      console.error("useReports loadAll error:", e);
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const filteredPatients = patientRows.filter((p) => {
    const matchesSearch =
      search.trim().length === 0 || p.name.toLowerCase().includes(search.toLowerCase().trim());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const refresh = useCallback(() => {
    loadAll();
  }, [loadAll]);

  return {
    summary,
    moodHistory,
    activityAdherence,
    diaryFrequency,
    emotionDist,
    filteredPatients,
    period,
    setPeriod,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    isLoading,
    refresh,
  };
}
