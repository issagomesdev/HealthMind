import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { AppHeader } from "../../components/ui/AppHeader";
import { AppCard } from "../../components/ui/AppCard";
import { NotificationToggleCard } from "../../components/profile/NotificationToggleCard";
import { useNotificationSettingsController } from "../../controllers/useNotificationSettingsController";
import { NotificationSettings } from "../../../core/types";
import { useTheme } from "../../../core/theme";

interface NotificationSettingsScreenProps {
  onBack: () => void;
}

const ITEMS: {
  key: keyof NotificationSettings;
  icon: "alarm-outline" | "water-outline" | "leaf-outline" | "chatbubble-outline" | "calendar-outline" | "stats-chart-outline";
  title: string;
  description: string;
}[] = [
  { key: "dailyCheckIn",         icon: "alarm-outline",       title: "Lembrete de check-in diário",       description: "Receba um aviso para registrar como você está." },
  { key: "hydrationReminder",    icon: "water-outline",       title: "Lembretes de hidratação",           description: "Avisos periódicos para beber água." },
  { key: "selfCareSuggestions",  icon: "leaf-outline",        title: "Sugestões de autocuidado",          description: "Dicas e atividades para o seu bem-estar." },
  { key: "communityReplies",     icon: "chatbubble-outline",  title: "Respostas da comunidade",           description: "Notificações quando alguém interagir com você." },
  { key: "appointments",         icon: "calendar-outline",    title: "Próximas consultas",                description: "Alertas sobre suas consultas agendadas." },
  { key: "weeklyReports",        icon: "stats-chart-outline", title: "Relatórios semanais",               description: "Resumo do seu progresso emocional semanal." },
];

export function NotificationSettingsScreen({ onBack }: NotificationSettingsScreenProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { settings, loading, loadSettings, toggleSetting } = useNotificationSettingsController();

  useFocusEffect(
    React.useCallback(() => {
      loadSettings();
    }, [loadSettings])
  );

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <AppHeader title="Notificações" showBack onBackPress={onBack} />

      <View className="flex-1 px-5 pt-2" style={{ paddingBottom: insets.bottom + 24 }}>
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color={colors.secondary} />
          </View>
        ) : (
          <AppCard className="p-0">
            {ITEMS.map((item, i) => (
              <NotificationToggleCard
                key={item.key}
                icon={item.icon}
                title={item.title}
                description={item.description}
                value={settings[item.key]}
                onChange={() => toggleSetting(item.key)}
                isLast={i === ITEMS.length - 1}
              />
            ))}
          </AppCard>
        )}
      </View>
    </View>
  );
}
