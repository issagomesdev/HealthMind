import { useState, useCallback } from "react";
import { NotificationSettings } from "../../core/types";
import { SettingsService } from "../../services/settings/SettingsService";

export function useNotificationSettingsController() {
  const [settings, setSettings] = useState<NotificationSettings>({
    dailyCheckIn: true,
    hydrationReminder: true,
    selfCareSuggestions: false,
    communityReplies: true,
    appointments: true,
    weeklyReports: false,
  });
  const [loading, setLoading] = useState(false);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await SettingsService.getNotificationSettings();
      setSettings(data);
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleSetting = useCallback(async (key: keyof NotificationSettings) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    await SettingsService.updateNotificationSettings(updated);
  }, [settings]);

  return { settings, loading, loadSettings, toggleSetting };
}
