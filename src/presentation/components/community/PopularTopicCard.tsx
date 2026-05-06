import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { CommunityTopic } from "../../../core/types";
import { useTheme } from "../../../core/theme";

interface PopularTopicCardProps {
  topic: CommunityTopic;
  onPress?: () => void;
}

export function PopularTopicCard({ topic, onPress }: PopularTopicCardProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="bg-surface dark:bg-surface-dark rounded-2xl p-4 gap-2.5 w-44"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 3,
      }}
    >
      <View className="w-10 h-10 rounded-2xl bg-secondary/10 dark:bg-secondary-dark/15 items-center justify-center">
        <Ionicons
          name={topic.icon as keyof typeof Ionicons.glyphMap}
          size={20}
          color={colors.secondary}
        />
      </View>
      <AppText variant="bodyMedium" className="font-semibold">
        {topic.title}
      </AppText>
      <AppText variant="small" color="muted" className="leading-4" numberOfLines={2}>
        {topic.description}
      </AppText>
    </TouchableOpacity>
  );
}
