import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { AppCard } from "../ui/AppCard";
import { ContentItem } from "../../../core/types";
import { useTheme } from "../../../core/theme";

const TYPE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  trilha:   "map-outline",
  leitura:  "book-outline",
  áudio:    "headset-outline",
  prática:  "barbell-outline",
};

const TYPE_COLORS: Record<string, string> = {
  trilha:   "#4C78D9",
  leitura:  "#6366F1",
  áudio:    "#F59E0B",
  prática:  "#2A9D8F",
};

interface ContentCardProps {
  content: ContentItem;
  onPress?: () => void;
}

export function ContentCard({ content, onPress }: ContentCardProps) {
  const { colors } = useTheme();
  const icon = TYPE_ICONS[content.type] ?? "document-outline";
  const typeColor = TYPE_COLORS[content.type] ?? colors.secondary;
  const typeLabel = content.type.charAt(0).toUpperCase() + content.type.slice(1);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View
        className="bg-surface dark:bg-surface-dark rounded-2xl p-4 gap-3"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.06,
          shadowRadius: 10,
          elevation: 3,
        }}
      >
        <View className="flex-row items-start gap-3">
          <View
            className="w-11 h-11 rounded-2xl items-center justify-center"
            style={{ backgroundColor: typeColor + "22" }}
          >
            <Ionicons name={icon} size={22} color={typeColor} />
          </View>

          <View className="flex-1 gap-1">
            <AppText variant="bodyMedium" className="font-semibold leading-snug">
              {content.title}
            </AppText>
            <AppText variant="small" color="muted" className="leading-5">
              {content.description}
            </AppText>
          </View>
        </View>

        <View className="flex-row items-center gap-1.5">
          <Ionicons name={icon} size={13} color={colors.subtle} />
          <AppText variant="caption" color="muted">
            {typeLabel} • {content.durationMinutes} min
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
}
