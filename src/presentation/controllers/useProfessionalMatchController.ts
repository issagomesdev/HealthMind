import { useState, useCallback } from "react";
import { Symptom, Professional } from "../../core/types";
import { ProfessionalService } from "../../services/professionals/ProfessionalService";

export function useProfessionalMatchController() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [useSmartAnalysis, setUseSmartAnalysis] = useState(false);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleSymptom = useCallback((symptom: Symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
    if (useSmartAnalysis) setUseSmartAnalysis(false);
  }, [useSmartAnalysis]);

  const toggleSmartAnalysis = useCallback(() => {
    setUseSmartAnalysis((v) => !v);
    if (!useSmartAnalysis) setSelectedSymptoms([]);
  }, [useSmartAnalysis]);

  const canContinue = selectedSymptoms.length > 0 || useSmartAnalysis;

  const loadProfessionals = useCallback(async () => {
    setLoading(true);
    try {
      const data = useSmartAnalysis
        ? await ProfessionalService.getRecommendedProfessionals()
        : await ProfessionalService.getProfessionalsBySymptoms(selectedSymptoms);
      setProfessionals(data);
    } finally {
      setLoading(false);
    }
  }, [selectedSymptoms, useSmartAnalysis]);

  return {
    selectedSymptoms,
    useSmartAnalysis,
    canContinue,
    professionals,
    loading,
    toggleSymptom,
    toggleSmartAnalysis,
    loadProfessionals,
  };
}
