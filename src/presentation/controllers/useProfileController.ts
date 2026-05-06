import { useState, useCallback } from "react";
import { UserProfile } from "../../core/types";
import { ProfileService } from "../../services/profile/ProfileService";

export function useProfileController() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const data = await ProfileService.getProfile();
      setProfile(data);
    } finally {
      setLoading(false);
    }
  }, []);

  return { profile, loading, loadProfile };
}
