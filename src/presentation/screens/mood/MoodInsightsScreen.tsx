import React, { useCallback } from "react";
import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { AppHeader } from "../../components/ui/AppHeader";
import { AppText } from "../../components/ui/AppText";
import { AppCard } from "../../components/ui/AppCard";
import { LoadingState } from "../../components/ui/LoadingState";
import { MoodSummaryCard } from "../../components/mood/MoodSummaryCard";
import { EmotionTrendChips } from "../../components/mood/EmotionTrendChips";
import { PositiveInsightCard } from "../../components/mood/PositiveInsightCard";
import { MoodRecommendationCard } from "../../components/mood/MoodRecommendationCard";
import { MoodConclusionCard } from "../../components/mood/MoodConclusionCard";
import { MoodTrendChart } from "../../components/mood/MoodTrendChart";
import { useMoodInsightsController } from "../../controllers/useMoodInsightsController";

interface MoodInsightsScreenProps {
  onBack: () => void;
}

function SectionLabel({ title }: { title: string }) {
  return (
    <AppText variant="heading3" className="font-bold">
      {title}
    </AppText>
  );
}

export function MoodInsightsScreen({ onBack }: MoodInsightsScreenProps) {
  const insets = useSafeAreaInsets();
  const ctrl = useMoodInsightsController();

  useFocusEffect(
    useCallback(() => {
      ctrl.loadAll();
    }, [])
  );

  if (ctrl.isLoading) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        <AppHeader title="Seu Humor" showBack onBackPress={onBack} />
        <LoadingState message="Analisando seus dados emocionais..." />
      </View>
    );
  }

  const { summary, emotions, positiveInsights, recommendations, weeklyTrend } = ctrl.data;

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <AppHeader title="Seu Humor" showBack onBackPress={onBack} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32, gap: 24, paddingTop: 4 }}
      >
        {/* Page header */}
        <View className="px-5 gap-1">
          <AppText variant="body" color="muted" className="leading-6">
            Uma visão da sua jornada emocional nos últimos 30 dias.
          </AppText>
        </View>

        {/* Summary */}
        {summary && (
          <View className="px-5">
            <MoodSummaryCard summary={summary.summary} />
          </View>
        )}

        {/* Trend chart */}
        {weeklyTrend.length > 0 && (
          <View className="px-5">
            <MoodTrendChart data={weeklyTrend} />
          </View>
        )}

        {/* Frequent emotions */}
        {emotions.length > 0 && (
          <View className="px-5 gap-3">
            <SectionLabel title="Emoções mais frequentes" />
            <AppCard>
              <EmotionTrendChips emotions={emotions} />
            </AppCard>
          </View>
        )}

        {/* Positive insights */}
        {positiveInsights.length > 0 && (
          <View className="px-5 gap-3">
            <SectionLabel title="Pontos positivos" />
            <View className="gap-2">
              {positiveInsights.map((insight, i) => (
                <PositiveInsightCard key={i} insight={insight} />
              ))}
            </View>
          </View>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <View className="px-5 gap-3">
            <SectionLabel title="Dicas personalizadas" />
            <View className="gap-2">
              {recommendations.map((rec) => (
                <MoodRecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </View>
          </View>
        )}

        {/* Conclusion */}
        {summary?.conclusion && (
          <View className="px-5">
            <MoodConclusionCard conclusion={summary.conclusion} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
