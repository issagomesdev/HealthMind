import { LoginCredentials, RegisterData, AuthResult } from "../../core/types";

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<AuthResult>;
  register(data: RegisterData): Promise<AuthResult>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<AuthResult | null>;
  refreshUser(): Promise<AuthResult | null>;
  getToken(): Promise<string | null>;
}
