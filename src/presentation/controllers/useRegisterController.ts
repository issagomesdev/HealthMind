import { useState, useCallback } from "react";
import { useAuth } from "../../core/auth/AuthContext";
import { UserRole } from "../../core/types";

interface RegisterErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

interface UseRegisterControllerOptions {
  onSuccess: () => void;
}

export function useRegisterController({ onSuccess }: UseRegisterControllerOptions) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("patient");
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);

  // Recebe os valores atuais como parâmetros para evitar stale closure
  const validate = (
    n: string, e: string, t: string, p: string, cp: string
  ): RegisterErrors => {
    const next: RegisterErrors = {};
    if (!n.trim()) next.name = "Informe seu nome.";
    if (!e.trim()) next.email = "Informe seu e-mail.";
    if (!t.trim()) next.phone = "Informe seu telefone.";
    if (!p) next.password = "Informe uma senha.";
    else if (p.length < 8) next.password = "A senha deve ter no mínimo 8 caracteres.";
    if (p !== cp) next.confirmPassword = "As senhas não coincidem.";
    return next;
  };

  const handleRegister = useCallback(async () => {
    const currentErrors = validate(name, email, telefone, password, confirmPassword);
    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      // Chama apenas o context.register — ele já aciona o AuthService
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        telefone: telefone.trim(),
      });
      onSuccess();
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : "Erro ao cadastrar. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }, [name, email, telefone, password, confirmPassword, role, register, onSuccess]);

  return {
    name, email, telefone, password, confirmPassword, role,
    errors, loading,
    setName, setEmail, setTelefone, setPassword, setConfirmPassword, setRole,
    handleRegister,
  };
}
