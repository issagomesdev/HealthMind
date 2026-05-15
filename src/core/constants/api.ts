import { env } from '../../config/env'

export const API_BASE = env.API_BASE_URL

export const API_ROUTES = {
  auth: {
    login: `${API_BASE}/auth/login`,
    register: `${API_BASE}/auth/register`,
    me: `${API_BASE}/auth/me`,
    logout: `${API_BASE}/auth/logout`,
  },
  users: {
    me: `${API_BASE}/users/me`,
    password: `${API_BASE}/users/me/password`,
  },
  patients: {
    me: `${API_BASE}/patients/me`,
  },
  professionals: {
    me: `${API_BASE}/professionals/me`,
  },
} as const

export const ROLE_MAP = {
  patient: 'patient',
  professional: 'professional',
} as const
