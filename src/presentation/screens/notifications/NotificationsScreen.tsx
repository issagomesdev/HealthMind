import React, { useCallback } from "react";
import { View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AppHeader } from "../../components/ui/AppHeader";
import { AppText } from "../../components/ui/AppText";
import { LoadingState } from "../../components/ui/LoadingState";
import { NotificationSection } from "../../components/notifications/NotificationSection";
import { EmptyNotificationsState } from "../../components/notifications/EmptyNotificationsState";
import { useNotificationsController } from "../../controllers/useNotificationsController";
import { useTheme } from "../../../core/theme";

interface NotificationsScreenProps {
  onBack: () => void;
}

export function NotificationsScreen({ onBack }: NotificationsScreenProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const ctrl = useNotificationsController();

  useFocusEffect(
    useCallback(() => {
      ctrl.loadAll();
    }, [])
  );

  const handleClearAll = () => {
    Alert.alert(
      "Limpar notificações",
      "Tem certeza que deseja remover todas as notificações?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Limpar", style: "destructive", onPress: ctrl.clearAll },
      ]
    );
  };

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <AppHeader title="Notificações" showBack onBackPress={onBack} />

      {/* Actions row */}
      {!ctrl.isEmpty && !ctrl.isLoading && (
        <View className="flex-row items-center justify-between px-5 pb-2">
          <AppText variant="small" color="muted">
            {ctrl.unreadCount > 0
              ? `${ctrl.unreadCount} não lida${ctrl.unreadCount > 1 ? "s" : ""}`
              : "Tudo lido"}
          </AppText>
          <View className="flex-row gap-3">
            {ctrl.unreadCount > 0 && (
              <TouchableOpacity onPress={ctrl.markAllAsRead} activeOpacity={0.7}>
                <AppText variant="small" color="secondary" className="font-semibold">
                  Marcar todas como lidas
                </AppText>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleClearAll} activeOpacity={0.7}>
              <Ionicons name="trash-outline" size={17} color={colors.error} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {ctrl.isLoading ? (
        <LoadingState message="Carregando notificações..." />
      ) : ctrl.isEmpty ? (
        <EmptyNotificationsState />
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 32, gap: 12, paddingTop: 4 }}
        >
          {/* Page subtitle */}
          <View className="px-5 pb-2">
            <AppText variant="small" color="muted" className="leading-5">
              Acompanhe lembretes, atualizações e atividades importantes.
            </AppText>
          </View>

          {ctrl.groups.map((group) => (
            <NotificationSection
              key={group.label}
              group={group}
              onPressNotification={ctrl.markAsRead}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
