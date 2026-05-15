import React, { useState } from "react";
import { View, ScrollView, Switch } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "../../components/ui/AppText";
import { AppCard } from "../../components/ui/AppCard";
import { ProfileHeroCard } from "../../components/profile/ProfileHeroCard";
import { SettingsOptionCard } from "../../components/profile/SettingsOptionCard";
import { LogoutConfirmationModal } from "../../components/profile/LogoutConfirmationModal";
import { useProfileController } from "../../controllers/useProfileController";
import { useAuth } from "../../../core/auth/AuthContext";
import { useTheme } from "../../../core/theme";

export function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { colors, themeMode, setThemeMode, isDark } = useTheme();
  const { profile, loading, loadProfile } = useProfileController();
  const [showLogout, setShowLogout] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  const handleLogout = async () => {
    setShowLogout(false);
    await logout();
  };

  const displayProfile = profile ?? {
    name: user?.name ?? "Usuário",
    email: user?.email ?? "",
    badge: "Mindful",
    level: 1,
    plan: "ESSENTIAL" as const,
  };

  const SETTINGS = [
    {
      icon: "person-outline" as const,
      title: "Configurações de conta",
      description: "Dados pessoais, e-mail e senha",
      onPress: () => router.push("/(protected)/profile-account"),
    },
    {
      icon: "lock-closed-outline" as const,
      title: "Privacidade do diário",
      description: "Controle quem vê seus registros",
      onPress: () => router.push("/(protected)/profile-privacy"),
    },
    {
      icon: "notifications-outline" as const,
      title: "Notificações",
      description: "Lembretes e alertas diários",
      onPress: () => router.push("/(protected)/profile-notifications"),
    },
    {
      icon: "star-outline" as const,
      title: "Plano atual",
      description:
        displayProfile.plan === "PREMIUM"
          ? "Premium • Renova em 15 dias"
          : "Essencial • Upgrade disponível",
      onPress: () => router.push("/(protected)/profile-subscription"),
    },
    {
      icon: "help-circle-outline" as const,
      title: "Central de ajuda",
      description: "FAQ e suporte",
      onPress: () => router.push("/(protected)/profile-help"),
    },
  ];

  return (
    <>
      <ScrollView
        className="flex-1 bg-background dark:bg-background-dark"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        <View style={{ paddingTop: insets.top + 8 }} className="px-5 gap-6">
          {/* Hero */}
          <ProfileHeroCard
            profile={displayProfile as any}
            onEditAvatar={() => {}}
          />

          {/* Settings list */}
          <AppCard className="p-0">
            {SETTINGS.map((item, i) => (
              <SettingsOptionCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                description={item.description}
                onPress={item.onPress}
                isLast={i === SETTINGS.length - 1}
              />
            ))}
          </AppCard>

          {/* Theme toggle */}
          <AppCard className="gap-3">
            <AppText variant="bodyMedium" className="font-semibold">
              Aparência
            </AppText>
            <View className="flex-row items-center justify-between">
              <View className="gap-0.5">
                <AppText variant="body">
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
      </ScrollView>

      <LogoutConfirmationModal
        visible={showLogout}
        onCancel={() => setShowLogout(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
