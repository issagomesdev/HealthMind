export const API_BASE = "https://healthmind-latest.onrender.com/api/v1";

export const API_ROUTES = {
  auth: {
    login: `${API_BASE}/auth/login`,
    register: `${API_BASE}/auth/cadastro`,
  },
} as const;

// Backend role values
export const ROLE_MAP = {
  patient: "PACIENTE",
  professional: "PROFISSIONAL",
} as const;
