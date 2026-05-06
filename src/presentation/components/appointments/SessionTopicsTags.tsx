import React from "react";
import { View } from "react-native";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";

interface SessionTopicsTagsProps {
  topics: string[];
}

export function SessionTopicsTags({ topics }: SessionTopicsTagsProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-row flex-wrap gap-2">
      {topics.map((topic) => (
        <View
          key={topic}
          className="px-3 py-1.5 rounded-full"
          style={{ backgroundColor: colors.secondary + "14" }}
        >
          <AppText variant="caption" color="secondary" className="font-semibold">
            {topic}
          </AppText>
        </View>
      ))}
    </View>
  );
}
