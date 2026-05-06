import { Activity } from "../../core/types";
import fakeActivities from "../../data/fake/activities.json";

// Future: GET /activities, GET /activities/recommended

class ActivitiesServiceImpl {
  async getActivities(): Promise<Activity[]> {
    await new Promise((r) => setTimeout(r, 350));
    return fakeActivities as Activity[];
  }

  async getRecommendedActivities(): Promise<Activity[]> {
    await new Promise((r) => setTimeout(r, 200));
    return (fakeActivities as Activity[]).filter((a) => a.recommended);
  }
}

export const ActivitiesService = new ActivitiesServiceImpl();
