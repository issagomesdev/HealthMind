import { useState, useCallback } from "react";
import { useAuth } from "../../core/auth/AuthContext";
import { API_ROUTES } from "../../core/constants/api";
import { AuthService } from "../../services/auth/AuthService";

interface AccountSettingsErrors {
  name?: string;
  email?: string;
  username?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
  general?: string;
  passwordGeneral?: string;
}

interface UseAccountSettingsOptions {
  onSuccess: () => void;
  onCancel: () => void;
}

async function patchUser(token: string, body: Record<string, unknown>) {
  const response = await fetch(API_ROUTES.users.me, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  const raw = await response.text();
  if (!response.ok) {
    const err = JSON.parse(raw || "{}");
    throw new Error(err.message ?? "Erro ao atualizar dados.");
  }
  return JSON.parse(raw);
}

async function patchPassword(token: string, current_password: string, new_password: string) {
  const response = await fetch(API_ROUTES.users.password, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ current_password, new_password }),
  });
  const raw = await response.text();
  if (!response.ok) {
    const err = JSON.parse(raw || "{}");
    throw new Error(err.message ?? "Erro ao alterar senha.");
  }
  return JSON.parse(raw);
}

export function useAccountSettingsController({ onSuccess, onCancel }: UseAccountSettingsOptions) {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [username, setUsername] = useState(user?.username ?? "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [errors, setErrors] = useState<AccountSettingsErrors>({});

  const handleSaveProfile = useCallback(async () => {
    const next: AccountSettingsErrors = {};
    if (!name.trim()) next.name = "O nome não pode estar vazio.";
    if (!email.trim()) next.email = "Informe um e-mail válido.";
    if (username && username.includes(" ")) next.username = "Username não pode ter espaços.";
    if (Object.keys(next).length > 0) { setErrors(next); return; }

    setErrors({});
    setLoadingProfile(true);
    try {
      const token = await AuthService.getToken();
      if (!token) throw new Error("Sessão expirada.");

      const body: Record<string, unknown> = {};
      if (name.trim() !== user?.name) body.name = name.trim();
      if (email.trim().toLowerCase() !== user?.email) body.email = email.trim().toLowerCase();
      if (username.trim().toLowerCase() !== user?.username) body.username = username.trim().toLowerCase();

      if (Object.keys(body).length > 0) {
        await patchUser(token, body);
        await refreshUser();
      }

      onSuccess();
    } catch (err) {
      setErrors({ general: err instanceof Error ? err.message : "Não foi possível salvar." });
    } finally {
      setLoadingProfile(false);
    }
  }, [name, email, username, user, refreshUser, onSuccess]);

  const handleChangePassword = useCallback(async () => {
    const next: AccountSettingsErrors = {};
    if (!currentPassword) next.currentPassword = "Informe a senha atual.";
    if (!newPassword) next.newPassword = "Informe a nova senha.";
    else if (newPassword.length < 8) next.newPassword = "A nova senha deve ter no mínimo 8 caracteres.";
    if (newPassword !== confirmNewPassword) next.confirmNewPassword = "As senhas não coincidem.";
    if (Object.keys(next).length > 0) { setErrors(next); return; }

    setErrors({});
    setLoadingPassword(true);
    try {
      const token = await AuthService.getToken();
      if (!token) throw new Error("Sessão expirada.");
      await patchPassword(token, currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      onSuccess();
    } catch (err) {
      setErrors({ passwordGeneral: err instanceof Error ? err.message : "Erro ao alterar senha." });
    } finally {
      setLoadingPassword(false);
    }
  }, [currentPassword, newPassword, confirmNewPassword, onSuccess]);

  return {
    name, email, username,
    currentPassword, newPassword, confirmNewPassword,
    loadingProfile, loadingPassword,
    errors,
    setName, setEmail, setUsername,
    setCurrentPassword, setNewPassword, setConfirmNewPassword,
    handleSaveProfile,
    handleChangePassword,
    handleCancel: onCancel,
  };
}
