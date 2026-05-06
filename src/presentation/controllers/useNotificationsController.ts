import { useState, useCallback } from "react";
import { AppNotification } from "../../core/types";
import { notificationsService } from "../../services/notifications/NotificationsService";

export interface NotificationGroup {
  label: string;
  items: AppNotification[];
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

function groupByPeriod(notifications: AppNotification[]): NotificationGroup[] {
  const today = todayStr();
  const yesterday = yesterdayStr();

  const todayItems = notifications.filter((n) => n.createdAt.startsWith(today));
  const yesterdayItems = notifications.filter((n) =>
    n.createdAt.startsWith(yesterday)
  );
  const weekItems = notifications.filter(
    (n) => !n.createdAt.startsWith(today) && !n.createdAt.startsWith(yesterday)
  );

  const groups: NotificationGroup[] = [];
  if (todayItems.length > 0) groups.push({ label: "Hoje", items: todayItems });
  if (yesterdayItems.length > 0) groups.push({ label: "Ontem", items: yesterdayItems });
  if (weekItems.length > 0) groups.push({ label: "Esta semana", items: weekItems });
  return groups;
}

export interface NotificationsController {
  isLoading: boolean;
  groups: NotificationGroup[];
  unreadCount: number;
  isEmpty: boolean;
  loadAll: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAll: () => Promise<void>;
}

export function useNotificationsController(): NotificationsController {
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const items = await notificationsService.getNotifications();
      setNotifications(items);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    await notificationsService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(async () => {
    await notificationsService.markAllAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(async () => {
    await notificationsService.clearNotifications();
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const groups = groupByPeriod(notifications);

  return {
    isLoading,
    groups,
    unreadCount,
    isEmpty: notifications.length === 0,
    loadAll,
    markAsRead,
    markAllAsRead,
    clearAll,
  };
}
