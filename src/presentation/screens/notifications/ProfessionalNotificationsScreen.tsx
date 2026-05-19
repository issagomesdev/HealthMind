import React, { useState, useCallback } from "react";
import { View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppHeader } from "../../components/ui/AppHeader";
import { AppText } from "../../components/ui/AppText";
import { AppCard } from "../../components/ui/AppCard";
import { LoadingState } from "../../components/ui/LoadingState";
import { useTheme } from "../../../core/theme";
import {
  professionalNotificationsService,
  ProfessionalNotification,
  ProfessionalNotificationType,
} from "../../../services/professionalNotificationsService";

interface ProfessionalNotificationsScreenProps {
  onBack: () => void;
}

const TYPE_CONFIG: Record<
  ProfessionalNotificationType,
  { icon: keyof typeof Ionicons.glyphMap; color: string }
> = {
  patient_request:  { icon: "person-add",         color: "#2A9D8F" },
  appointment:      { icon: "calendar",            color: "#3B82F6" },
  emotional_alert:  { icon: "warning",             color: "#EF4444" },
  message:          { icon: "chatbubble",          color: "#6B7EF5" },
  payment:          { icon: "cash",                color: "#F59E0B" },
  charge_approved:  { icon: "checkmark-circle",    color: "#6DBF7B" },
  diary_shared:     { icon: "book",                color: "#C084FC" },
  report:           { icon: "bar-chart",           color: "#60A5FA" },
  agenda_full:      { icon: "alert-circle",        color: "#F97316" },
};

function groupByDate(notifications: ProfessionalNotification[]): Array<{ label: string; items: ProfessionalNotification[] }> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const groups: { [key: string]: ProfessionalNotification[] } = {
    "Hoje": [],
    "Ontem": [],
    "Esta semana": [],
  };

  for (const n of notifications) {
    const date = new Date(n.createdAt);
    date.setHours(0, 0, 0, 0);

    if (date.getTime() === today.getTime()) {
      groups["Hoje"].push(n);
    } else if (date.getTime() === yesterday.getTime()) {
      groups["Ontem"].push(n);
    } else if (date >= weekAgo) {
      groups["Esta semana"].push(n);
    } else {
      groups["Esta semana"].push(n);
    }
  }

  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({ label, items }));
}

function NotificationRow({
  notification,
  onMarkRead,
  onRemove,
  isLast,
}: {
  notification: ProfessionalNotification;
  onMarkRead: (id: string) => void;
  onRemove: (id: string) => void;
  isLast?: boolean;
}) {
  const { colors } = useTheme();
  const config = TYPE_CONFIG[notification.type];

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onMarkRead(notification.id)}
      className="flex-row items-start gap-3 px-4 py-4"
      style={{
        backgroundColor: notification.read ? "transparent" : colors.secondary + "08",
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: colors.border,
      }}
    >
      <View
        className="w-10 h-10 rounded-2xl items-center justify-center flex-shrink-0"
        style={{ backgroundColor: config.color + "18" }}
      >
        <Ionicons name={config.icon} size={20} color={config.color} />
      </View>

      <View className="flex-1 gap-0.5">
        <View className="flex-row items-center gap-2">
          <AppText variant="bodyMedium" className="font-semibold flex-1">
            {notification.title}
          </AppText>
          {!notification.read && (
            <View
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: colors.secondary }}
            />
          )}
        </View>
        <AppText variant="small" color="muted" className="leading-5">
          {notification.description}
        </AppText>
      </View>

      <TouchableOpacity
        onPress={() => onRemove(notification.id)}
        activeOpacity={0.7}
        className="w-8 h-8 items-center justify-center flex-shrink-0"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="close" size={16} color={colors.subtle} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export function ProfessionalNotificationsScreen({ onBack }: ProfessionalNotificationsScreenProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [notifications, setNotifications] = useState<ProfessionalNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const data = await professionalNotificationsService.getAll();
      setNotifications(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAll();
    }, [loadAll])
  );

  const unreadCount = notifications.filter((n) => !n.read).length;
  const isEmpty = notifications.length === 0;
  const groups = groupByDate(notifications);

  const handleMarkRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    await professionalNotificationsService.markAsRead(id);
  };

  const handleMarkAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await professionalNotificationsService.markAllAsRead();
  };

  const handleRemove = (id: string) => {
    Alert.alert(
      "Remover notificação",
      "Tem certeza que deseja remover esta notificação?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
            await professionalNotificationsService.remove(id);
          },
        },
      ]
    );
  };

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <AppHeader title="Notificações" showBack onBackPress={onBack} />

      {!isEmpty && !loading && (
        <View className="flex-row items-center justify-between px-5 pb-2">
          <AppText variant="small" color="muted">
            {unreadCount > 0
              ? `${unreadCount} não lida${unreadCount > 1 ? "s" : ""}`
              : "Tudo lido"}
          </AppText>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.7}>
              <AppText variant="small" color="secondary" className="font-semibold">
                Marcar todas como lidas
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      )}

      {loading ? (
        <LoadingState message="Carregando notificações..." />
      ) : isEmpty ? (
        <View className="flex-1 items-center justify-center gap-3 px-8">
          <View
            className="w-16 h-16 rounded-full items-center justify-center"
            style={{ backgroundColor: colors.secondary + "18" }}
          >
            <Ionicons name="notifications-off-outline" size={32} color={colors.secondary} />
          </View>
          <AppText variant="heading3" className="font-bold text-center">
            Nenhuma notificação
          </AppText>
          <AppText variant="body" color="muted" className="text-center leading-6">
            Você está em dia. Novas notificações aparecerão aqui.
          </AppText>
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 32, gap: 16, paddingTop: 4 }}
        >
          <View className="px-5 pb-1">
            <AppText variant="small" color="muted" className="leading-5">
              Acompanhe solicitações, alertas e atualizações dos seus pacientes.
            </AppText>
          </View>

          {groups.map((group) => (
            <View key={group.label} className="px-5 gap-2">
              <AppText variant="small" className="font-semibold" color="muted">
                {group.label.toUpperCase()}
              </AppText>
              <AppCard className="p-0 overflow-hidden">
                {group.items.map((notification, i) => (
                  <NotificationRow
                    key={notification.id}
                    notification={notification}
                    onMarkRead={handleMarkRead}
                    onRemove={handleRemove}
                    isLast={i === group.items.length - 1}
                  />
                ))}
              </AppCard>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
