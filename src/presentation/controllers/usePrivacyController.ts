import { useState, useCallback } from "react";
import { DiaryPrivacy } from "../../core/types";
import { SettingsService } from "../../services/settings/SettingsService";

export function usePrivacyController() {
  const [privacy, setPrivacyState] = useState<DiaryPrivacy>("PRIVATE");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadPrivacy = useCallback(async () => {
    setLoading(true);
    try {
      const value = await SettingsService.getPrivacySettings();
      setPrivacyState(value);
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePrivacy = useCallback(async (value: DiaryPrivacy) => {
    setPrivacyState(value);
    setSaving(true);
    try {
      await SettingsService.updatePrivacySettings(value);
    } finally {
      setSaving(false);
    }
  }, []);

  return { privacy, loading, saving, loadPrivacy, updatePrivacy };
}
