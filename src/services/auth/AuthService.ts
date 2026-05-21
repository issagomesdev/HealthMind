import { LoginCredentials, RegisterData, User, PatientProfile, ProfessionalProfile, AuthResult } from "../../core/types";
import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { API_ROUTES } from "../../core/constants/api";
import { TokenStorage } from "./token-storage";

interface ApiUser {
  id: string;
  name: string;
  email: string;
  username: string;
  type: string;
  avatar_url: string | null;
  profile_completed: boolean;
  is_active: boolean;
  created_at: string;
}

interface ApiAuthResponse {
  token: string;
  user: ApiUser;
  profile_completed: boolean;
}

interface ApiMeResponse {
  user: ApiUser;
  profile: PatientProfile | ProfessionalProfile | null;
  profile_completed: boolean;
}

function mapApiUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    username: apiUser.username,
    role: apiUser.type === "professional" ? "professional" : "patient",
    avatar_url: apiUser.avatar_url,
    profile_completed: apiUser.profile_completed,
    created_at: typeof apiUser.created_at === "string" ? apiUser.created_at : new Date().toISOString(),
  };
}

async function callApi<T>(url: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers as Record<string, string>) },
  });
  const raw = await response.text();
  if (!response.ok) {
    const err = JSON.parse(raw || "{}");
    throw new Error(err.message ?? err.error ?? "Erro desconhecido.");
  }
  return JSON.parse(raw) as T;
}

async function fetchMe(token: string): Promise<ApiMeResponse> {
  return callApi<ApiMeResponse>(API_ROUTES.auth.me, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

class AuthServiceImpl implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    const data = await callApi<ApiAuthResponse>(API_ROUTES.auth.login, {
      method: "POST",
      body: JSON.stringify({ email: credentials.email, password: credentials.password }),
    });

    await TokenStorage.save(data.token);
    const meData = await fetchMe(data.token);
    return { user: mapApiUser(meData.user), profile: meData.profile };
  }

  async register(registerData: RegisterData): Promise<AuthResult> {
    const data = await callApi<ApiAuthResponse>(API_ROUTES.auth.register, {
      method: "POST",
      body: JSON.stringify({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        type: registerData.role,
      }),
    });
    await TokenStorage.save(data.token);
    const meData = await fetchMe(data.token);
    return { user: mapApiUser(meData.user), profile: meData.profile };
  }

  async getCurrentUser(): Promise<AuthResult | null> {
    try {
      const token = await TokenStorage.get();
      if (!token) return null;
      const meData = await fetchMe(token);
      return { user: mapApiUser(meData.user), profile: meData.profile };
    } catch {
      await TokenStorage.remove();
      return null;
    }
  }

  async refreshUser(): Promise<AuthResult | null> {
    return this.getCurrentUser();
  }

  async logout(): Promise<void> {
    try {
      const token = await TokenStorage.get();
      if (token) {
        await fetch(API_ROUTES.auth.logout, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // best effort — clear token regardless
    } finally {
      await TokenStorage.remove();
    }
  }

  async getToken(): Promise<string | null> {
    return TokenStorage.get();
  }
}

export const AuthService = new AuthServiceImpl();
