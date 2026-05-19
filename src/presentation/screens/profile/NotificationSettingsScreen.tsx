import React, { useState, useCallback } from "react";
import { View, ActivityIndicator } from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppHeader } from "../../components/ui/AppHeader";
import { AppCard } from "../../components/ui/AppCard";
import { NotificationToggleCard } from "../../components/profile/NotificationToggleCard";
import { useNotificationSettingsController } from "../../controllers/useNotificationSettingsController";
import { NotificationSettings } from "../../../core/types";
import { useTheme } from "../../../core/theme";
import { useAuth } from "../../../core/auth/AuthContext";
import {
  professionalNotificationSettingsService,
  ProfessionalNotificationSettings,
} from "../../../services/professionalNotificationSettingsService";

interface NotificationSettingsScreenProps {
  onBack: () => void;
}

const PATIENT_ITEMS: {
  key: keyof NotificationSettings;
  icon: "alarm-outline" | "water-outline" | "leaf-outline" | "chatbubble-outline" | "calendar-outline" | "stats-chart-outline";
  title: string;
  description: string;
}[] = [
  { key: "dailyCheckIn",        icon: "alarm-outline",       title: "Lembrete de check-in diário",       description: "Receba um aviso para registrar como você está." },
  { key: "hydrationReminder",   icon: "water-outline",       title: "Lembretes de hidratação",           description: "Avisos periódicos para beber água." },
  { key: "selfCareSuggestions", icon: "leaf-outline",        title: "Sugestões de autocuidado",          description: "Dicas e atividades para o seu bem-estar." },
  { key: "communityReplies",    icon: "chatbubble-outline",  title: "Respostas da comunidade",           description: "Notificações quando alguém interagir com você." },
  { key: "appointments",        icon: "calendar-outline",    title: "Próximas consultas",                description: "Alertas sobre suas consultas agendadas." },
  { key: "weeklyReports",       icon: "stats-chart-outline", title: "Relatórios semanais",               description: "Resumo do seu progresso emocional semanal." },
];

const PROFESSIONAL_ITEMS: {
  key: keyof ProfessionalNotificationSettings;
  icon: "person-add-outline" | "calendar-outline" | "chatbubble-outline" | "warning-outline" | "cash-outline" | "bar-chart-outline" | "heart-outline";
  title: string;
  description: string;
}[] = [
  { key: "newPatientRequests",   icon: "person-add-outline",  title: "Novas solicitações de pacientes",   description: "Alertas quando um paciente aceitar ou solicitar contrato." },
  { key: "upcomingAppointments", icon: "calendar-outline",    title: "Próximas consultas",                description: "Lembretes de sessões agendadas." },
  { key: "patientMessages",      icon: "chatbubble-outline",  title: "Mensagens de pacientes",            description: "Notificações de novas mensagens recebidas." },
  { key: "emotionalAlerts",      icon: "warning-outline",     title: "Alertas emocionais",                description: "Avisos sobre variações de humor dos pacientes." },
  { key: "paymentsAndCharges",   icon: "cash-outline",        title: "Pagamentos e cobranças",            description: "Confirmações de pagamentos e cobranças extras." },
  { key: "professionalReports",  icon: "bar-chart-outline",   title: "Relatórios profissionais",          description: "Resumo semanal de atendimentos e insights." },
  { key: "wellbeingReminders",   icon: "heart-outline",       title: "Lembretes de bem-estar",            description: "Lembretes para pausas e autocuidado." },
];

export function NotificationSettingsScreen({ onBack }: NotificationSettingsScreenProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const isProfessional = user?.role === "professional";

  const patientCtrl = useNotificationSettingsController();

  const [profSettings, setProfSettings] = useState<ProfessionalNotificationSettings | null>(null);
  const [profLoading, setProfLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (isProfessional) {
        setProfLoading(true);
        professionalNotificationSettingsService
          .getSettings()
          .then(setProfSettings)
          .finally(() => setProfLoading(false));
      } else {
        patientCtrl.loadSettings();
      }
    }, [isProfessional])
  );

  const toggleProfSetting = async (key: keyof ProfessionalNotificationSettings) => {
    if (!profSettings) return;
    const newValue = !profSettings[key];
    setProfSettings((prev) => prev ? { ...prev, [key]: newValue } : prev);
    await professionalNotificationSettingsService.updateSetting(key, newValue);
  };

  const isLoading = isProfessional ? profLoading : patientCtrl.loading;

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <AppHeader title="Notificações" showBack onBackPress={onBack} />

      <View className="flex-1 px-5 pt-2" style={{ paddingBottom: insets.bottom + 24 }}>
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={colors.secondary} />
          </View>
        ) : isProfessional && profSettings ? (
          <AppCard className="p-0">
            {PROFESSIONAL_ITEMS.map((item, i) => (
              <NotificationToggleCard
                key={item.key}
                icon={item.icon}
                title={item.title}
                description={item.description}
                value={profSettings[item.key]}
                onChange={() => toggleProfSetting(item.key)}
                isLast={i === PROFESSIONAL_ITEMS.length - 1}
              />
            ))}
          </AppCard>
        ) : !isProfessional ? (
          <AppCard className="p-0">
            {PATIENT_ITEMS.map((item, i) => (
              <NotificationToggleCard
                key={item.key}
                icon={item.icon}
                title={item.title}
                description={item.description}
                value={patientCtrl.settings[item.key]}
                onChange={() => patientCtrl.toggleSetting(item.key)}
                isLast={i === PATIENT_ITEMS.length - 1}
              />
            ))}
          </AppCard>
        ) : null}
      </View>
    </View>
  );
}
