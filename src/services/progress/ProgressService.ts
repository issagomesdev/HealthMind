import { ProgressSummary, WeeklyMetric, Achievement } from "../../core/types";
import fakeProgress from "../../data/fake/progress.json";

// Future: GET /progress/summary, GET /progress/weekly-mood, GET /progress/achievements

class ProgressServiceImpl {
  async getProgressSummary(): Promise<ProgressSummary> {
    await new Promise((r) => setTimeout(r, 400));
    return fakeProgress as unknown as ProgressSummary;
  }

  async getWeeklyMood(): Promise<WeeklyMetric[]> {
    await new Promise((r) => setTimeout(r, 250));
    return fakeProgress.weeklyMood as WeeklyMetric[];
  }

  async getAchievements(): Promise<Achievement[]> {
    await new Promise((r) => setTimeout(r, 200));
    return fakeProgress.achievements as Achievement[];
  }
}

export const ProgressService = new ProgressServiceImpl();
