import data from "../data/fake/levelsBenefits.json";
import type { LevelsBenefitsData, HomeProgressSummary } from "../types/levelsBenefits";

const delay = (ms = 350) => new Promise<void>((r) => setTimeout(r, ms));

class LevelsBenefitsService {
  async getPatientData(): Promise<LevelsBenefitsData> {
    await delay();
    return data.patient as unknown as LevelsBenefitsData;
  }

  async getProfessionalData(): Promise<LevelsBenefitsData> {
    await delay();
    return data.professional as unknown as LevelsBenefitsData;
  }

  async getHomeProgressSummary(role: "patient" | "professional"): Promise<HomeProgressSummary> {
    await delay(200);
    const d = role === "professional" ? data.professional : data.patient;
    return {
      levelName: d.currentLevel.name,
      badge: d.currentLevel.badge,
      color: d.currentLevel.color,
      currentXP: d.currentXP,
      xpToNextLevel: d.xpToNextLevel,
      nextLevelName: d.nextLevel.name,
      streak: d.streak,
      missionsCompleted: d.dailyMissions.filter((m) => m.completed).length,
      missionsTotal: d.dailyMissions.length,
    };
  }
}

export const levelsBenefitsService = new LevelsBenefitsService();
