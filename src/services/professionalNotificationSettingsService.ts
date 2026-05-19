import settingsData from "../data/fake/professionalNotificationSettings.json";

export interface ProfessionalNotificationSettings {
  newPatientRequests: boolean;
  upcomingAppointments: boolean;
  patientMessages: boolean;
  emotionalAlerts: boolean;
  paymentsAndCharges: boolean;
  professionalReports: boolean;
  wellbeingReminders: boolean;
}

const delay = (ms = 150) => new Promise<void>((r) => setTimeout(r, ms));

let settings: ProfessionalNotificationSettings = { ...settingsData };

class ProfessionalNotificationSettingsService {
  async getSettings(): Promise<ProfessionalNotificationSettings> {
    await delay();
    return { ...settings };
  }

  async updateSetting(
    key: keyof ProfessionalNotificationSettings,
    value: boolean
  ): Promise<void> {
    await delay(100);
    settings = { ...settings, [key]: value };
  }
}

export const professionalNotificationSettingsService = new ProfessionalNotificationSettingsService();
