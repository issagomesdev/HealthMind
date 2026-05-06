import { useState } from "react";
import { ProfileService } from "../../services/profile/ProfileService";

interface UseAccountSettingsOptions {
  initialName: string;
  initialEmail: string;
  initialPhone: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function useAccountSettingsController({
  initialName,
  initialEmail,
  initialPhone,
  onSuccess,
  onCancel,
}: UseAccountSettingsOptions) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!name.trim()) { setError("O nome não pode estar vazio."); return; }
    if (!email.trim()) { setError("Informe um e-mail válido."); return; }
    if (password && password !== confirmPassword) {
      setError("As senhas não coincidem."); return;
    }
    setError(null);
    setLoading(true);
    try {
      await ProfileService.updateProfile({ name: name.trim(), email: email.trim(), phone });
      onSuccess();
    } catch {
      setError("Não foi possível salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return {
    name, email, phone, password, confirmPassword,
    loading, error,
    setName, setEmail, setPhone, setPassword, setConfirmPassword,
    handleSave,
    handleCancel: onCancel,
  };
}
