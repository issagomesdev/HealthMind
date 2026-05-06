import data from "../../data/fake/notifications.json";
import { AppNotification } from "../../core/types";

type CountListener = (count: number) => void;

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

// Module-level mutable state — survives re-renders, shared across all subscribers
let notifications: AppNotification[] = data.notifications as AppNotification[];
const listeners = new Set<CountListener>();

class NotificationsService {
  // ── Subscriptions ────────────────────────────────────────────────────────────

  /** Subscribe to unread count changes. Returns unsubscribe fn. */
  subscribe(fn: CountListener): () => void {
    listeners.add(fn);
    return () => listeners.delete(fn);
  }

  private emit() {
    const count = this.getUnreadCount();
    listeners.forEach((fn) => fn(count));
  }

  // ── Queries ──────────────────────────────────────────────────────────────────

  // GET /notifications
  async getNotifications(): Promise<AppNotification[]> {
    await delay();
    return [...notifications];
  }

  getUnreadCount(): number {
    return notifications.filter((n) => !n.read).length;
  }

  // ── Mutations ────────────────────────────────────────────────────────────────

  // POST /notifications/:id/read
  async markAsRead(id: string): Promise<void> {
    await delay(150);
    notifications = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.emit();
  }

  // POST /notifications/read-all
  async markAllAsRead(): Promise<void> {
    await delay(300);
    notifications = notifications.map((n) => ({ ...n, read: true }));
    this.emit();
  }

  // DELETE /notifications
  async clearNotifications(): Promise<void> {
    await delay(300);
    notifications = [];
    this.emit();
  }
}

export const notificationsService = new NotificationsService();
