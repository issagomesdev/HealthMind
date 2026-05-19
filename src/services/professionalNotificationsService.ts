import notificationsData from "../data/fake/professionalNotifications.json";

export type ProfessionalNotificationType =
  | "patient_request"
  | "appointment"
  | "emotional_alert"
  | "message"
  | "payment"
  | "charge_approved"
  | "diary_shared"
  | "report"
  | "agenda_full";

export interface ProfessionalNotification {
  id: string;
  type: ProfessionalNotificationType;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
}

const delay = (ms = 200) => new Promise<void>((r) => setTimeout(r, ms));
let notifications: ProfessionalNotification[] = notificationsData.notifications as ProfessionalNotification[];

class ProfessionalNotificationsService {
  async getAll(): Promise<ProfessionalNotification[]> {
    await delay();
    return [...notifications];
  }

  async markAsRead(id: string): Promise<void> {
    await delay(100);
    notifications = notifications.map((n) => n.id === id ? { ...n, read: true } : n);
  }

  async markAllAsRead(): Promise<void> {
    await delay(150);
    notifications = notifications.map((n) => ({ ...n, read: true }));
  }

  async remove(id: string): Promise<void> {
    await delay(100);
    notifications = notifications.filter((n) => n.id !== id);
  }

  async getUnreadCount(): Promise<number> {
    await delay(50);
    return notifications.filter((n) => !n.read).length;
  }
}

export const professionalNotificationsService = new ProfessionalNotificationsService();
