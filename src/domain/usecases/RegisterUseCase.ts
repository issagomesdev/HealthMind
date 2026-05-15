import { IAuthRepository } from "../repositories/IAuthRepository";
import { RegisterData, AuthResult } from "../../core/types";

export class RegisterUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(data: RegisterData): Promise<AuthResult> {
    if (!data.name?.trim()) throw new Error("Informe seu nome.");
    if (!data.email?.trim()) throw new Error("Informe seu e-mail.");
    if (!data.password) throw new Error("Informe uma senha.");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) throw new Error("E-mail inválido.");

    if (data.password.length < 8) {
      throw new Error("A senha deve ter no mínimo 8 caracteres.");
    }

    if (!["patient", "professional"].includes(data.role)) {
      throw new Error("Tipo de usuário inválido.");
    }

    return this.authRepository.register(data);
  }
}
