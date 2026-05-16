import { useState, useCallback, useMemo } from "react";
import { ProfessionalPatient, RiskLevel, PatientStatus } from "../../types/patient";
import { patientsService } from "../../services/patients/PatientsService";

export type PatientFilter =
  | "all"
  | "high_risk"
  | "critical"
  | "recent"
  | "premium"
  | "free"
  | "active"
  | "pending"
  | "stable"
  | "attention";

export type PatientSort =
  | "name_asc"
  | "name_desc"
  | "last_interaction"
  | "risk_level"
  | "next_appointment";

export interface PatientsController {
  isLoading: boolean;
  allPatients: ProfessionalPatient[];
  filteredPatients: ProfessionalPatient[];
  searchQuery: string;
  activeFilter: PatientFilter;
  activeSorting: PatientSort;
  totalCount: number;
  criticalCount: number;
  pendingCount: number;
  todayAppointmentsCount: number;
  loadPatients: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setFilter: (filter: PatientFilter) => void;
  setSorting: (sort: PatientSort) => void;
}

const RISK_ORDER: Record<RiskLevel, number> = {
  critical: 0,
  high_risk: 1,
  attention: 2,
  stable: 3,
};

function todayString() {
  return new Date().toISOString().split("T")[0];
}

export function usePatientsController(): PatientsController {
  const [isLoading, setIsLoading] = useState(false);
  const [allPatients, setAllPatients] = useState<ProfessionalPatient[]>([]);
  const [searchQuery, setSearchQueryState] = useState("");
  const [activeFilter, setActiveFilter] = useState<PatientFilter>("all");
  const [activeSorting, setActiveSorting] = useState<PatientSort>("risk_level");

  const loadPatients = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await patientsService.getProfessionalPatients();
      setAllPatients(data);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setSearchQuery = useCallback((query: string) => {
    setSearchQueryState(query);
  }, []);

  const setFilter = useCallback((filter: PatientFilter) => {
    setActiveFilter(filter);
  }, []);

  const setSorting = useCallback((sort: PatientSort) => {
    setActiveSorting(sort);
  }, []);

  const filteredPatients = useMemo(() => {
    const today = todayString();
    let result = [...allPatients];

    // Apply search
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.email.toLowerCase().includes(q) ||
          p.username.toLowerCase().includes(q) ||
          p.mainComplaint.toLowerCase().includes(q)
      );
    }

    // Apply filter
    switch (activeFilter) {
      case "high_risk":
        result = result.filter((p) => p.riskLevel === "high_risk");
        break;
      case "critical":
        result = result.filter((p) => p.riskLevel === "critical");
        break;
      case "recent": {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 7);
        const cutoffStr = cutoff.toISOString().split("T")[0];
        result = result.filter((p) => p.lastInteraction >= cutoffStr);
        break;
      }
      case "premium":
        result = result.filter((p) => p.planTags.includes("premium"));
        break;
      case "free":
        result = result.filter((p) => p.planTags.includes("free"));
        break;
      case "active":
        result = result.filter(
          (p) => p.status === "active" || p.status === "stable"
        );
        break;
      case "pending":
        result = result.filter((p) => p.status === "pending");
        break;
      case "stable":
        result = result.filter((p) => p.riskLevel === "stable");
        break;
      case "attention":
        result = result.filter((p) => p.riskLevel === "attention");
        break;
      default:
        break;
    }

    // Apply sorting
    switch (activeSorting) {
      case "name_asc":
        result.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
        break;
      case "name_desc":
        result.sort((a, b) => b.name.localeCompare(a.name, "pt-BR"));
        break;
      case "last_interaction":
        result.sort((a, b) =>
          b.lastInteraction.localeCompare(a.lastInteraction)
        );
        break;
      case "risk_level":
        result.sort(
          (a, b) =>
            (RISK_ORDER[a.riskLevel] ?? 99) - (RISK_ORDER[b.riskLevel] ?? 99)
        );
        break;
      case "next_appointment":
        result.sort((a, b) => {
          if (!a.nextAppointment && !b.nextAppointment) return 0;
          if (!a.nextAppointment) return 1;
          if (!b.nextAppointment) return -1;
          return a.nextAppointment.localeCompare(b.nextAppointment);
        });
        break;
    }

    return result;
  }, [allPatients, searchQuery, activeFilter, activeSorting]);

  const totalCount = allPatients.length;

  const criticalCount = useMemo(
    () =>
      allPatients.filter(
        (p) => p.riskLevel === "critical" || p.riskLevel === "high_risk"
      ).length,
    [allPatients]
  );

  const pendingCount = useMemo(
    () => allPatients.filter((p) => p.status === "pending").length,
    [allPatients]
  );

  const todayAppointmentsCount = useMemo(() => {
    const today = todayString();
    return allPatients.filter(
      (p) => p.nextAppointment && p.nextAppointment.startsWith(today)
    ).length;
  }, [allPatients]);

  return {
    isLoading,
    allPatients,
    filteredPatients,
    searchQuery,
    activeFilter,
    activeSorting,
    totalCount,
    criticalCount,
    pendingCount,
    todayAppointmentsCount,
    loadPatients,
    setSearchQuery,
    setFilter,
    setSorting,
  };
}
