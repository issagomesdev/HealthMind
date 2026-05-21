import React, { useEffect, useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { AppText } from "../../components/ui/AppText";
import { AppCard } from "../../components/ui/AppCard";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { HomeProgressShortcut } from "../../components/levels/HomeProgressShortcut";
import { useTheme } from "../../../core/theme";
import { useAuth } from "../../../core/auth/AuthContext";
import { levelsBenefitsService } from "../../../services/levelsBenefitsService";
import type { HomeProgressSummary } from "../../../types/levelsBenefits";

interface HomeScreenProps {
  onNavigateToSettings: () => void;
}

export function HomeScreen({ onNavigateToSettings }: HomeScreenProps) {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [progressSummary, setProgressSummary] = useState<HomeProgressSummary | null>(null);
  const [progressLoading, setProgressLoading] = useState(true);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  };

  const firstName = user?.name?.split(" ")[0] ?? "Usuário";
  const role = user?.role === "professional" ? "professional" : "patient";

  useEffect(() => {
    levelsBenefitsService
      .getHomeProgressSummary(role)
      .then(setProgressSummary)
      .finally(() => setProgressLoading(false));
  }, [role]);

  return (
    <ScreenContainer edges={["top", "bottom"]}>
      <View className="flex-1 px-6 pt-4 gap-7">
        <View className="flex-row items-center justify-between">
          <View className="w-12 h-12 rounded-full items-center justify-center bg-secondary/20 dark:bg-secondary-dark/20">
            <Ionicons name="person" size={22} color={colors.secondary} />
          </View>

          <TouchableOpacity
            onPress={onNavigateToSettings}
            className="w-11 h-11 rounded-full items-center justify-center bg-muted dark:bg-muted-dark"
          >
            <Ionicons name="settings-outline" size={22} color={colors.content} />
          </TouchableOpacity>
        </View>

        <View className="gap-1.5">
          <AppText variant="heading2" className="font-bold leading-9">
            {greeting()},{"\n"}
            <AppText variant="heading2" color="secondary" className="font-bold">
              {firstName}! 👋
            </AppText>
          </AppText>
          <AppText variant="body" color="muted">
            Como você está se sentindo hoje?
          </AppText>
        </View>

        {/* Progress shortcut */}
        <HomeProgressShortcut
          summary={progressSummary}
          isLoading={progressLoading}
          onPress={() => router.push("/(protected)/levels-benefits")}
        />

        <AppCard className="items-center">
          <View className="items-center gap-3 py-4">
            <View className="w-16 h-16 rounded-full items-center justify-center bg-secondary/15 dark:bg-secondary-dark/15">
              <Ionicons name="construct-outline" size={28} color={colors.secondary} />
            </View>
            <AppText variant="heading3" className="text-center">Em construção</AppText>
            <AppText variant="body" color="muted" className="text-center">
              O dashboard completo estará disponível em breve.
            </AppText>
          </View>
        </AppCard>

        <View className="gap-3">
          <AppText variant="label" color="muted">ACESSO RÁPIDO</AppText>
          <View className="flex-row gap-3">
            {[
              { icon: "settings-outline" as const, label: "Configurações", action: onNavigateToSettings },
              { icon: "log-out-outline" as const,   label: "Sair",          action: logout },
            ].map((item) => (
              <TouchableOpacity
                key={item.label}
                onPress={item.action}
                activeOpacity={0.8}
                className="flex-1 rounded-2xl p-5 items-center gap-2.5 bg-surface dark:bg-surface-dark"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <Ionicons name={item.icon} size={24} color={colors.secondary} />
                <AppText variant="smallMedium">{item.label}</AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
