import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";

export function EmptyNotificationsState() {
  const { colors } = useTheme();

  return (
    <View className="flex-1 items-center justify-center gap-4 px-8">
      <View
        className="w-20 h-20 rounded-full items-center justify-center"
        style={{ backgroundColor: colors.secondary + "14" }}
      >
        <Ionicons name="notifications-off-outline" size={36} color={colors.secondary} />
      </View>
      <View className="items-center gap-2">
        <AppText variant="heading3" className="font-bold text-center">
          Tudo em dia!
        </AppText>
        <AppText variant="body" color="muted" className="text-center leading-7">
          Você não tem notificações no momento. Elas aparecerão aqui quando chegarem.
        </AppText>
      </View>
    </View>
  );
}
