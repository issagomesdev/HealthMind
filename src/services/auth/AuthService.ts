import * as SecureStore from "expo-secure-store";
import { LoginCredentials, RegisterData, User, UserRole } from "../../core/types";
import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { API_ROUTES, ROLE_MAP } from "../../core/constants/api";

const SESSION_KEY = "healthmind_user";
const TOKEN_KEY = "healthmind_token";

// Estrutura exata retornada pela API
interface ApiUsuario {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  role: string;
  ativo: boolean;
  criadoEm: string | null;
}

interface ApiLoginResponse {
  token: string;
  tipo: string;
  usuario: ApiUsuario;
}

function parseRole(role: string): UserRole {
  if (role === "PSICOLOGO" || role === "PROFISSIONAL") return "professional";
  return "patient";
}

function buildUserFromResponse(data: ApiLoginResponse): User {
  return {
    id: data.usuario.id,
    name: data.usuario.nome,
    email: data.usuario.email,
    password: "",
    role: parseRole(data.usuario.role),
    plan: "free",
    createdAt: data.usuario.criadoEm ?? new Date().toISOString(),
  };
}

class AuthServiceImpl implements IAuthRepository {
  async login(credentials: LoginCredentials): Promise<User> {
    const body = { email: credentials.email, senha: credentials.password };

    const response = await fetch(API_ROUTES.auth.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const raw = await response.text();

    if (!response.ok) {
      const err = JSON.parse(raw || "{}");
      const message: string =
        err.mensagem ?? err.erro ?? err.error ?? "E-mail ou senha incorretos.";
      throw new Error(message);
    }

    const data: ApiLoginResponse = JSON.parse(raw);
    await SecureStore.setItemAsync(TOKEN_KEY, data.token);

    const user = buildUserFromResponse(data);
    await SecureStore.setItemAsync(SESSION_KEY, JSON.stringify(user));
    return user;
  }

  async register(data: RegisterData): Promise<User> {
    const body = {
      nome: data.name,
      email: data.email,
      senha: data.password,
      telefone: data.telefone,
      role: ROLE_MAP[data.role],
    };

    const response = await fetch(API_ROUTES.auth.register, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const raw = await response.text();

    if (!response.ok) {
      const err = JSON.parse(raw || "{}");
      const message: string =
        err.mensagem ?? err.erro ?? err.error ?? "Erro ao criar conta.";
      throw new Error(message);
    }

    return this.login({ email: data.email, password: data.password });
  }

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync(SESSION_KEY);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const stored = await SecureStore.getItemAsync(SESSION_KEY);
      if (!stored) return null;
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  }

  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(TOKEN_KEY);
  }
}

export const AuthService = new AuthServiceImpl();
