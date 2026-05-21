import React, { useState, useEffect } from "react";
import { View, ScrollView, Switch, TouchableOpacity } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "../../components/ui/AppText";
import { AppCard } from "../../components/ui/AppCard";
import { Ionicons } from "@expo/vector-icons";
import { ProfileHeroCard } from "../../components/profile/ProfileHeroCard";
import { ProfessionalBadge } from "../../components/profile/ProfessionalBadge";
import { StatsMiniCard } from "../../components/profile/StatsMiniCard";
import { SettingsOptionCard } from "../../components/profile/SettingsOptionCard";
import { LogoutConfirmationModal } from "../../components/profile/LogoutConfirmationModal";
import { useProfileController } from "../../controllers/useProfileController";
import { useAuth } from "../../../core/auth/AuthContext";
import { useTheme } from "../../../core/theme";
import { ProfessionalProfile } from "../../../core/types";
import { useRefreshAuthenticatedUser } from "../../../hooks/useRefreshAuthenticatedUser";
import { professionalProfileService, ProfessionalStats } from "../../../services/professionalProfileService";

export function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { user, logout, profile: authProfile } = useAuth();
  const { colors, setThemeMode, isDark } = useTheme();
  const { profile, loadProfile } = useProfileController();
  const { refresh } = useRefreshAuthenticatedUser();
  const [showLogout, setShowLogout] = useState(false);
  const [stats, setStats] = useState<ProfessionalStats | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const isProfessional = user?.role === "professional";

  useFocusEffect(
    React.useCallback(() => {
      loadProfile();
      refresh();
    }, [loadProfile, refresh])
  );

  useEffect(() => {
    if (isProfessional) {
      professionalProfileService.getStats().then(setStats);
    }
  }, [isProfessional]);

  const handleLogout = async () => {
    setShowLogout(false);
    await logout();
  };

  const displayProfile = {
    ...(profile ?? { badge: "Mindful", level: 1, plan: "ESSENTIAL" as const }),
    name: user?.name ?? profile?.name ?? "Usuário",
    email: user?.email ?? profile?.email ?? "",
  };

  const professionalProfile = isProfessional ? (authProfile as ProfessionalProfile | null) : null;

  const PATIENT_SETTINGS = [
    {
      icon: "person-outline" as const,
      title: "Configurações de conta",
      description: "Dados pessoais, e-mail e senha",
      onPress: () => router.push("/(protected)/profile-account"),
    },
    {
      icon: "clipboard-outline" as const,
      title: "Minha ficha",
      description: "Dados pessoais e preferências de cuidado",
      onPress: () => router.push("/(protected)/profile-form"),
    },
    {
      icon: "trophy-outline" as const,
      title: "Níveis e Benefícios",
      description: "Seu progresso, missões e conquistas",
      onPress: () => router.push("/(protected)/levels-benefits"),
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
        `${displayProfile.plan === "ESSENTIAL" ? "Essencial" : "Premium"} • Gerencie sua assinatura`,
      onPress: () => router.push("/(protected)/profile-subscription"),
    },
    {
      icon: "help-circle-outline" as const,
      title: "Central de ajuda",
      description: "FAQ e suporte",
      onPress: () => router.push("/(protected)/profile-help"),
    },
  ];

  const PROFESSIONAL_SETTINGS = [
    {
      icon: "person-outline" as const,
      title: "Configurações de conta",
      description: "Dados pessoais, e-mail e senha",
      onPress: () => router.push("/(protected)/profile-account"),
    },
    {
      icon: "clipboard-outline" as const,
      title: "Minha ficha",
      description: "Dados profissionais e modalidade de atendimento",
      onPress: () => router.push("/(protected)/profile-form"),
    },
    {
      icon: "trophy-outline" as const,
      title: "Níveis e Benefícios",
      description: "Seu progresso, missões e conquistas",
      onPress: () => router.push("/(protected)/levels-benefits"),
    },
    {
      icon: "calendar-outline" as const,
      title: "Disponibilidade",
      description: "Horários, pausas e regras de agendamento",
      onPress: () => router.push("/(protected)/availability"),
    },
    {
      icon: "notifications-outline" as const,
      title: "Notificações",
      description: "Preferências de alertas e avisos",
      onPress: () => router.push("/(protected)/profile-notifications"),
    },
    {
      icon: "star-outline" as const,
      title: "Plano atual",
      description: `${stats?.plan} • Gerencie sua assinatura`,
      onPress: () => router.push("/(protected)/professional-subscription"),
    },
    {
      icon: "help-circle-outline" as const,
      title: "Central de ajuda",
      description: "FAQ e suporte para profissionais",
      onPress: () => router.push("/(protected)/professional-help"),
    },
  ];

  const SETTINGS = isProfessional ? PROFESSIONAL_SETTINGS : PATIENT_SETTINGS;

  return (
    <>
      <ScrollView
        className="flex-1 bg-background dark:bg-background-dark"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        <View style={{ paddingTop: insets.top + 8 }} className="px-5 gap-6">
          {isProfessional ? (
            <View className="items-center gap-4 pt-4 pb-2">
              <View>
                <View
                  className="rounded-full bg-secondary/20 dark:bg-secondary-dark/20 items-center justify-center overflow-hidden"
                  style={{ width: 96, height: 96 }}
                >
                  <AppText style={{ fontSize: 34, fontWeight: "700", color: colors.secondary, lineHeight: 25 }}>
                    {(user?.name ?? "P")
                      .split(" ")
                      .slice(0, 2)
                      .map((w: string) => w[0]?.toUpperCase() ?? "")
                      .join("")}
                  </AppText>
                </View>
              </View>
              <View className="items-center gap-2">
                <AppText variant="heading2" className="font-bold text-center">
                  {user?.name ?? "Profissional"}
                </AppText>
                <ProfessionalBadge
                  specialty={professionalProfile?.specialty}
                  registerType={professionalProfile?.register_type}
                  registerNumber={professionalProfile?.professional_register}
                  registerState={professionalProfile?.register_state}
                />
              </View>

              {stats && (
                <View style={{ flexDirection: "row", gap: 8, width: "100%" }}>
                  <StatsMiniCard value={stats.activePatients} label="Pacientes ativos" />
                  <StatsMiniCard value={stats.appointmentsThisMonth} label="Consultas/mês" />
                  <StatsMiniCard value={`${stats.averageRating}`} label="Avaliação" highlight />
                </View>
              )}
            </View>
          ) : (
            <ProfileHeroCard
              profile={displayProfile as any}
              onEditAvatar={() => {}}
            />
          )}

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

          {/* Preferências do App */}
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            {/* Section header */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <Ionicons name="options-outline" size={18} color={colors.secondary} />
              <AppText style={{ fontSize: 15, fontWeight: "700", color: colors.content }}>
                Preferências do App
              </AppText>
            </View>

            {/* Modo Escuro */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: colors.border,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.muted,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="moon-outline" size={20} color={colors.content} />
                </View>
                <View style={{ gap: 2 }}>
                  <AppText style={{ fontSize: 15, fontWeight: "600", color: colors.content }}>
                    Modo Escuro
                  </AppText>
                  <AppText style={{ fontSize: 12, color: colors.subtle }}>
                    Tema atual: {isDark ? "Escuro" : "Claro"}
                  </AppText>
                </View>
              </View>
              <Switch
                value={isDark}
                onValueChange={(v) => setThemeMode(v ? "dark" : "light")}
                trackColor={{ false: colors.border, true: colors.secondary }}
                thumbColor="#fff"
                ios_backgroundColor={colors.border}
              />
            </View>

            {/* Notificações */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() =>
                router.push(
                  isProfessional
                    ? "/(protected)/profile-notifications"
                    : "/(protected)/profile-notifications"
                )
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 16,
                paddingVertical: 14,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.muted,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="notifications-outline" size={20} color={colors.content} />
                </View>
                <View style={{ gap: 2 }}>
                  <AppText style={{ fontSize: 15, fontWeight: "600", color: colors.content }}>
                    Notificações
                  </AppText>
                  <AppText style={{ fontSize: 12, color: colors.subtle }}>
                    Alertas e lembretes
                  </AppText>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colors.border, true: colors.secondary }}
                thumbColor="#fff"
                ios_backgroundColor={colors.border}
                onTouchStart={(e) => e.stopPropagation()}
              />
            </TouchableOpacity>
          </View>

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
