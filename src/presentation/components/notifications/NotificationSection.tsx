import React from "react";
import { View } from "react-native";
import { AppText } from "../ui/AppText";
import { NotificationCard } from "./NotificationCard";
import { NotificationGroup } from "../../controllers/useNotificationsController";

interface NotificationSectionProps {
  group: NotificationGroup;
  onPressNotification: (id: string) => void;
}

export function NotificationSection({
  group,
  onPressNotification,
}: NotificationSectionProps) {
  return (
    <View>
      {/* Section header */}
      <View className="px-5 py-2">
        <AppText variant="label" color="muted" className="uppercase tracking-widest">
          {group.label}
        </AppText>
      </View>

      {/* Cards */}
      <View className="bg-surface dark:bg-surface-dark rounded-2xl overflow-hidden mx-4"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {group.items.map((item, index) => (
          <View key={item.id}>
            {index > 0 && (
              <View className="h-px bg-border dark:bg-border-dark mx-5" />
            )}
            <NotificationCard notification={item} onPress={onPressNotification} />
          </View>
        ))}
      </View>
    </View>
  );
}
