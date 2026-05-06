import { DiaryPrivacy, NotificationSettings } from "../../core/types";

// Future: GET /settings/privacy, PUT /settings/privacy
//         GET /settings/notifications, PUT /settings/notifications

class SettingsServiceImpl {
  private privacy: DiaryPrivacy = "PRIVATE";
  private notifications: NotificationSettings = {
    dailyCheckIn: true,
    hydrationReminder: true,
    selfCareSuggestions: false,
    communityReplies: true,
    appointments: true,
    weeklyReports: false,
  };

  async getPrivacySettings(): Promise<DiaryPrivacy> {
    await new Promise((r) => setTimeout(r, 200));
    return this.privacy;
  }

  async updatePrivacySettings(value: DiaryPrivacy): Promise<void> {
    await new Promise((r) => setTimeout(r, 300));
    this.privacy = value;
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    await new Promise((r) => setTimeout(r, 200));
    return { ...this.notifications };
  }

  async updateNotificationSettings(settings: NotificationSettings): Promise<void> {
    await new Promise((r) => setTimeout(r, 300));
    this.notifications = { ...settings };
  }
}

export const SettingsService = new SettingsServiceImpl();
