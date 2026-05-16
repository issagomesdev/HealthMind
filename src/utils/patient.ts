import { RiskLevel, PatientStatus } from "../types/patient";

export function getInitials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return parts[0].charAt(0).toUpperCase() + parts[parts.length - 1].charAt(0).toUpperCase();
}

export type RiskConfig = {
  bg: string;
  border: string;
  text: string;
  label: string;
  icon: string;
};

export function getRiskConfig(riskLevel: RiskLevel, status: PatientStatus): RiskConfig {
  if (status === "pending") {
    return { bg: "#9CA3AF20", border: "#9CA3AF", text: "#9CA3AF", label: "Pendente", icon: "time-outline" };
  }
  switch (riskLevel) {
    case "stable":
      return { bg: "#6DBF7B20", border: "#6DBF7B", text: "#6DBF7B", label: "Estável", icon: "checkmark-circle-outline" };
    case "attention":
      return { bg: "#60A5FA20", border: "#3B82F6", text: "#3B82F6", label: "Atenção", icon: "information-circle-outline" };
    case "high_risk":
      return { bg: "#FCA5A520", border: "#EF4444", text: "#EF4444", label: "Alto Risco", icon: "warning-outline" };
    case "critical":
      return { bg: "#7C2D1220", border: "#7C2D12", text: "#7C2D12", label: "Crítico", icon: "alert-circle-outline" };
    default:
      return { bg: "#9CA3AF20", border: "#9CA3AF", text: "#9CA3AF", label: "—", icon: "help-outline" };
  }
}

export function formatLastInteraction(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  return `há ${diffDays} dias`;
}

export function formatNextAppointment(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const time = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 0) return `Hoje, ${time}`;
  if (diffDays === 1) return `Amanhã, ${time}`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" }) + `, ${time}`;
}
