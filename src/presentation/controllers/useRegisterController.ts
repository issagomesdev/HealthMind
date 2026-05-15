import { useState, useCallback } from "react";
import { useAuth } from "../../core/auth/AuthContext";
import { AuthResult, UserRole } from "../../core/types";

interface RegisterErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

interface UseRegisterControllerOptions {
  onSuccess: (result: AuthResult) => void;
}

export function useRegisterController({ onSuccess }: UseRegisterControllerOptions) {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("patient");
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [loading, setLoading] = useState(false);

  const validate = (n: string, e: string, p: string, cp: string): RegisterErrors => {
    const next: RegisterErrors = {};
    if (!n.trim()) next.name = "Informe seu nome.";
    if (!e.trim()) next.email = "Informe seu e-mail.";
    if (!p) next.password = "Informe uma senha.";
    else if (p.length < 8) next.password = "A senha deve ter no mínimo 8 caracteres.";
    if (p !== cp) next.confirmPassword = "As senhas não coincidem.";
    return next;
  };

  const handleRegister = useCallback(async () => {
    const currentErrors = validate(name, email, password, confirmPassword);
    if (Object.keys(currentErrors).length > 0) {
      setErrors(currentErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      });
      onSuccess(result);
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : "Erro ao cadastrar. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }, [name, email, password, confirmPassword, role, register, onSuccess]);

  return {
    name, email, password, confirmPassword, role,
    errors, loading,
    setName, setEmail, setPassword, setConfirmPassword, setRole,
    handleRegister,
  };
}
