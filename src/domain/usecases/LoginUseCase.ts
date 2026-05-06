import { IAuthRepository } from "../repositories/IAuthRepository";
import { LoginCredentials, User } from "../../core/types";

export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(credentials: LoginCredentials): Promise<User> {
    if (!credentials.email || !credentials.password) {
      throw new Error("E-mail e senha são obrigatórios.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(credentials.email)) {
      throw new Error("E-mail inválido.");
    }

    return this.authRepository.login(credentials);
  }
}
