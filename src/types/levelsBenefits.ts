export interface Level {
  id: number;
  name: string;
  badge: string;
  color: string;
  xpRequired: number;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  icon: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  unlockedAt: string | null;
  locked: boolean;
}

export interface ActiveBenefit {
  id: string;
  title: string;
  icon: string;
}

export interface LevelsBenefitsData {
  currentLevel: Level;
  nextLevel: Level;
  tagline: string;
  currentXP: number;
  totalXP: number;
  xpToNextLevel: number;
  weeklyXP: number;
  streak: number;
  dailyMissions: DailyMission[];
  achievements: Achievement[];
  activeBenefits: ActiveBenefit[];
  nextLevelBenefit: string;
  levels: Level[];
}

export interface HomeProgressSummary {
  levelName: string;
  badge: string;
  color: string;
  currentXP: number;
  xpToNextLevel: number;
  nextLevelName: string;
  streak: number;
  missionsCompleted: number;
  missionsTotal: number;
}
