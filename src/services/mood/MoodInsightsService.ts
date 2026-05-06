import data from "../../data/fake/mood-insights.json";
import {
  MoodSummaryData,
  EmotionTrend,
  MoodInsightItem,
  MoodRecommendation,
  MoodTrendWeek,
} from "../../core/types";

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

class MoodInsightsService {
  // GET /mood/summary
  async getMoodSummary(): Promise<MoodSummaryData> {
    await delay();
    return data.summary as MoodSummaryData;
  }

  // GET /mood/trends
  async getFrequentEmotions(): Promise<EmotionTrend[]> {
    await delay(200);
    return data.emotions as EmotionTrend[];
  }

  // GET /mood/insights/positive
  async getPositiveInsights(): Promise<MoodInsightItem[]> {
    await delay(200);
    return data.positiveInsights as MoodInsightItem[];
  }

  // GET /mood/recommendations
  async getRecommendations(): Promise<MoodRecommendation[]> {
    await delay(200);
    return data.recommendations as MoodRecommendation[];
  }

  // GET /mood/trend/weekly
  async getMoodTrend(): Promise<MoodTrendWeek[]> {
    await delay(200);
    return data.weeklyTrend as MoodTrendWeek[];
  }
}

export const moodInsightsService = new MoodInsightsService();
