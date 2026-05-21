import React from "react";
import { View, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../components/ui/AppText";
import { TopBar } from "../../components/navigation/TopBar";
import { LevelHeroCard } from "../../components/levels/LevelHeroCard";
import { XPProgressCard } from "../../components/levels/XPProgressCard";
import { DailyMissionList } from "../../components/levels/DailyMissionList";
import { BenefitsList } from "../../components/levels/BenefitsList";
import { AchievementsGrid } from "../../components/levels/AchievementsGrid";
import { PremiumBenefitsCard } from "../../components/levels/PremiumBenefitsCard";
import { useLevelsBenefits } from "../../../hooks/useLevelsBenefits";
import { useTheme } from "../../../core/theme";
import { useAuth } from "../../../core/auth/AuthContext";

export function LevelsBenefitsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { user } = useAuth();
  const role = user?.role === "professional" ? "professional" : "patient";
  const { data, isLoading, error, refresh } = useLevelsBenefits(role);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <TopBar title="Níveis e Benefícios" onBackPress={() => router.back()} showMenu={false} />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color={colors.secondary} />
        </View>
      </View>
    );
  }

  if (error || !data) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <TopBar title="Níveis e Benefícios" onBackPress={() => router.back()} showMenu={false} />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 32 }}>
          <Ionicons name="cloud-offline-outline" size={48} color={colors.subtle} />
          <AppText style={{ fontSize: 15, color: colors.subtle, textAlign: "center" }}>
            Não foi possível carregar os dados.
          </AppText>
          <TouchableOpacity
            onPress={refresh}
            style={{
              paddingHorizontal: 24,
              paddingVertical: 10,
              borderRadius: 20,
              backgroundColor: colors.secondary,
            }}
          >
            <AppText style={{ color: "#fff", fontWeight: "700" }}>Tentar novamente</AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const accentColor = data.currentLevel.color;
  const userName = user?.name ?? "Usuário";

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar title="Níveis e Benefícios" onBackPress={() => router.back()} showMenu={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32, gap: 16, paddingTop: 4 }}
      >
        {/* Page header */}
        <View style={{ paddingHorizontal: 20, gap: 4 }}>
          <AppText style={{ fontSize: 26, fontWeight: "800", color: colors.content }}>
            Níveis e Benefícios
          </AppText>
          <AppText style={{ fontSize: 14, color: colors.subtle, lineHeight: 20 }}>
            Evolua na plataforma e desbloqueie recursos especiais.
          </AppText>
        </View>

        {/* Hero card */}
        <LevelHeroCard
          currentLevel={data.currentLevel}
          tagline={data.tagline}
          userName={userName}
          role={role}
        />

        {/* XP Progress */}
        <XPProgressCard
          currentLevel={data.currentLevel}
          nextLevel={data.nextLevel}
          currentXP={data.currentXP}
          xpToNextLevel={data.xpToNextLevel}
        />

        {/* Premium card — professional sees it right after XP */}
        {role === "professional" && (
          <PremiumBenefitsCard role={role} onPress={() => router.push("/(protected)/professional-subscription" as any)} />
        )}

        {/* Daily missions */}
        <DailyMissionList
          missions={data.dailyMissions}
          accentColor={accentColor}
          role={role}
        />

        {/* Benefits */}
        <BenefitsList
          activeBenefits={data.activeBenefits}
          nextLevelBenefit={data.nextLevelBenefit}
          nextLevelId={data.nextLevel.id}
          accentColor={accentColor}
        />

        {/* Achievements */}
        <AchievementsGrid achievements={data.achievements} />

        {/* Premium card — patient sees it at the bottom */}
        {role === "patient" && <PremiumBenefitsCard role={role} />}
      </ScrollView>
    </View>
  );
}
