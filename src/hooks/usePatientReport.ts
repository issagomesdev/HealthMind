import { useState, useEffect, useCallback } from "react";
import { reportsService } from "../services/reportsService";
import type { PatientFullReport } from "../types/reports";

export function usePatientReport(patientId: string) {
  const [report, setReport] = useState<PatientFullReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingNote, setIsSavingNote] = useState(false);

  const load = useCallback(async () => {
    if (!patientId) return;
    setIsLoading(true);
    try {
      const data = await reportsService.getPatientFullReport(patientId);
      setReport(data);
    } catch (e) {
      console.error("usePatientReport load error:", e);
    } finally {
      setIsLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    load();
  }, [load]);

  const addNote = useCallback(
    async (text: string, isPrivate: boolean) => {
      if (!patientId || !text.trim()) return;
      setIsSavingNote(true);
      try {
        await reportsService.addProfessionalNote(patientId, text.trim(), isPrivate);
        await load();
      } catch (e) {
        console.error("usePatientReport addNote error:", e);
      } finally {
        setIsSavingNote(false);
      }
    },
    [patientId, load]
  );

  return {
    report,
    isLoading,
    isSavingNote,
    addNote,
    refresh: load,
  };
}
