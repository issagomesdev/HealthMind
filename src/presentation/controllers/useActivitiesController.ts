import { useState, useCallback } from "react";
import { Activity } from "../../core/types";
import { ActivitiesService } from "../../services/activities/ActivitiesService";

interface UseActivitiesController {
  activities: Activity[];
  loading: boolean;
  loadActivities: () => Promise<void>;
}

export function useActivitiesController(): UseActivitiesController {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);

  const loadActivities = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ActivitiesService.getActivities();
      setActivities(data);
    } finally {
      setLoading(false);
    }
  }, []);

  return { activities, loading, loadActivities };
}
