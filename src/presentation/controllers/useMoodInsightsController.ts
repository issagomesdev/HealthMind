import { useState, useCallback } from "react";
import {
  MoodSummaryData,
  EmotionTrend,
  MoodInsightItem,
  MoodRecommendation,
  MoodTrendWeek,
} from "../../core/types";
import { moodInsightsService } from "../../services/mood/MoodInsightsService";

export interface MoodInsightsState {
  summary: MoodSummaryData | null;
  emotions: EmotionTrend[];
  positiveInsights: MoodInsightItem[];
  recommendations: MoodRecommendation[];
  weeklyTrend: MoodTrendWeek[];
}

export interface MoodInsightsController {
  isLoading: boolean;
  data: MoodInsightsState;
  loadAll: () => Promise<void>;
}

const EMPTY: MoodInsightsState = {
  summary: null,
  emotions: [],
  positiveInsights: [],
  recommendations: [],
  weeklyTrend: [],
};

export function useMoodInsightsController(): MoodInsightsController {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<MoodInsightsState>(EMPTY);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [summary, emotions, positiveInsights, recommendations, weeklyTrend] =
        await Promise.all([
          moodInsightsService.getMoodSummary(),
          moodInsightsService.getFrequentEmotions(),
          moodInsightsService.getPositiveInsights(),
          moodInsightsService.getRecommendations(),
          moodInsightsService.getMoodTrend(),
        ]);
      setData({ summary, emotions, positiveInsights, recommendations, weeklyTrend });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, data, loadAll };
}
