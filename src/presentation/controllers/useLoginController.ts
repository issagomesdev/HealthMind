import { useState, useCallback } from "react";
import { useAuth } from "../../core/auth/AuthContext";

interface LoginErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface UseLoginControllerOptions {
  onSuccess: () => void;
}

export function useLoginController({ onSuccess }: UseLoginControllerOptions) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(async () => {
    // Valida com os valores atuais passados como parâmetro — sem stale closure
    const next: LoginErrors = {};
    if (!email.trim()) next.email = "Informe seu e-mail.";
    if (!password) next.password = "Informe sua senha.";

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await login({ email: email.trim(), password });
      onSuccess();
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : "Erro ao entrar. Tente novamente.",
      });
    } finally {
      setLoading(false);
    }
  }, [email, password, login, onSuccess]);

  return { email, password, errors, loading, setEmail, setPassword, handleLogin };
}
