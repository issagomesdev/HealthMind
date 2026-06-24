import React from "react";
import { View, ScrollView, ActivityIndicator, StatusBar } from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "../../components/ui/AppText";
import { WeeklyMoodChart } from "../../components/progress/WeeklyMoodChart";
import { CheckInStreakCard } from "../../components/progress/CheckInStreakCard";
import { FrequentEmotionChips } from "../../components/progress/FrequentEmotionChips";
import { AchievementCard } from "../../components/progress/AchievementCard";
import { ProgressInsightCard } from "../../components/progress/ProgressInsightCard";
import { useProgressController } from "../../controllers/useProgressController";
import { useTheme } from "../../../core/theme";

export function ProgressScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { progress, loading, loadProgress } = useProgressController();

  useFocusEffect(
    React.useCallback(() => {
      loadProgress();
    }, [loadProgress])
  );

  const statusBar = (
    <StatusBar
      barStyle={isDark ? "light-content" : "dark-content"}
      backgroundColor={colors.background}
    />
  );

  if (loading && !progress) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        {statusBar}
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.secondary} size="large" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      {statusBar}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <View className="px-5 pt-4 gap-5">
          {/* Heading */}
          <View className="gap-1">
            <AppText variant="heading2" className="font-bold" color="secondary">
              Seu Progresso
            </AppText>
            <AppText variant="body" color="muted">
              Acompanhe sua jornada emocional e celebre suas conquistas.
            </AppText>
          </View>

          {progress && (
            <>
              <WeeklyMoodChart
                data={progress.weeklyMood}
                onViewHistory={() => {}}
              />

              <CheckInStreakCard streak={progress.checkInStreak} />

              <FrequentEmotionChips emotions={progress.frequentEmotions} />

              <AchievementCard achievements={progress.achievements} />

              <ProgressInsightCard
                title={progress.insight}
                subtext={progress.insightSubtext}
              />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
