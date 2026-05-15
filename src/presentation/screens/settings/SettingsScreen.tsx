import React, { useState } from "react";
import { View, Switch } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../components/ui/AppText";
import { AppCard } from "../../components/ui/AppCard";
import { AppHeader } from "../../components/ui/AppHeader";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { SettingsOptionCard } from "../../components/profile/SettingsOptionCard";
import { LogoutConfirmationModal } from "../../components/profile/LogoutConfirmationModal";
import { useTheme } from "../../../core/theme";
import { useAuth } from "../../../core/auth/AuthContext";
import { ROUTES } from "../../../core/constants/routes";

export function SettingsScreen() {
  const router = useRouter();
  const { colors, isDark, setThemeMode } = useTheme();
  const { user, logout } = useAuth();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = async () => {
    setShowLogout(false);
    await logout();
  };

  const ACCOUNT_ITEMS: Array<{
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    description: string;
    route: string;
  }> = [
    {
      icon: "person-outline",
      title: "Editar perfil",
      description: "Dados pessoais, e-mail e senha",
      route: ROUTES.PROFILE_ACCOUNT,
    },
    {
      icon: "notifications-outline",
      title: "Notificações",
      description: "Lembretes e alertas diários",
      route: ROUTES.PROFILE_NOTIFICATIONS,
    },
    {
      icon: "lock-closed-outline",
      title: "Privacidade",
      description: "Controle quem vê seus registros",
      route: ROUTES.PROFILE_PRIVACY,
    },
    {
      icon: "star-outline",
      title: "Plano atual",
      description: "Essencial · Upgrade disponível",
      route: ROUTES.PROFILE_SUBSCRIPTION,
    },
    {
      icon: "help-circle-outline",
      title: "Central de ajuda",
      description: "FAQ e suporte",
      route: ROUTES.PROFILE_HELP,
    },
  ];

  return (
    <>
      <ScreenContainer>
        <AppHeader title="Configurações" showBack />

        <View className="flex-1 px-5 pb-10 gap-6">
          {/* User card */}
          <AppCard>
            <View className="flex-row items-center gap-4">
              <View className="w-[60px] h-[60px] rounded-full items-center justify-center bg-secondary/20 dark:bg-secondary-dark/20">
                <Ionicons name="person" size={28} color={colors.secondary} />
              </View>
              <View className="flex-1 gap-1">
                <AppText variant="bodyMedium" className="font-semibold">
                  {user?.name ?? "—"}
                </AppText>
                <AppText variant="small" color="muted">
                  {user?.email ?? "—"}
                </AppText>
                <View className="self-start px-2.5 py-1 rounded-full mt-1 bg-secondary/15 dark:bg-secondary-dark/15">
                  <AppText variant="caption" color="secondary" className="font-semibold">
                    {user?.role === "patient" ? "Paciente" : "Profissional"}
                  </AppText>
                </View>
              </View>
            </View>
          </AppCard>

          {/* Appearance */}
          <View className="gap-2.5">
            <AppText variant="label" color="muted" className="px-1 uppercase tracking-widest">
              Aparência
            </AppText>
            <AppCard className="gap-3">
              <View className="flex-row items-center justify-between">
                <View className="gap-0.5">
                  <AppText variant="bodyMedium" className="font-medium">
                    {isDark ? "Modo escuro" : "Modo claro"}
                  </AppText>
                  <AppText variant="small" color="muted">
                    Alternar tema do aplicativo
                  </AppText>
                </View>
                <Switch
                  value={isDark}
                  onValueChange={(v) => setThemeMode(v ? "dark" : "light")}
                  trackColor={{ false: colors.border, true: colors.secondary + "88" }}
                  thumbColor={isDark ? colors.secondary : colors.subtle}
                  ios_backgroundColor={colors.border}
                />
              </View>
            </AppCard>
          </View>

          {/* Account */}
          <View className="gap-2.5">
            <AppText variant="label" color="muted" className="px-1 uppercase tracking-widest">
              Conta
            </AppText>
            <AppCard className="p-0">
              {ACCOUNT_ITEMS.map((item, i) => (
                <SettingsOptionCard
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  description={item.description}
                  onPress={() => router.push(item.route as any)}
                  isLast={i === ACCOUNT_ITEMS.length - 1}
                />
              ))}
            </AppCard>
          </View>

          {/* Logout */}
          <AppCard className="p-0">
            <SettingsOptionCard
              icon="log-out-outline"
              title="Sair"
              description="Desconectar desta conta"
              onPress={() => setShowLogout(true)}
              isLast
              danger
            />
          </AppCard>
        </View>
      </ScreenContainer>

      <LogoutConfirmationModal
        visible={showLogout}
        onCancel={() => setShowLogout(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
