import { LoginCredentials, RegisterData, User } from "../../core/types";

export interface IAuthRepository {
  login(credentials: LoginCredentials): Promise<User>;
  register(data: RegisterData): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}
