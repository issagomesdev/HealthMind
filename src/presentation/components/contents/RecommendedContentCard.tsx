import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
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

interface RecommendedContentCardProps {
  content: ContentItem;
  onPress?: () => void;
  isLast?: boolean;
}

export function RecommendedContentCard({ content, onPress, isLast }: RecommendedContentCardProps) {
  const { colors } = useTheme();
  const icon = TYPE_ICONS[content.type] ?? "document-outline";
  const typeColor = TYPE_COLORS[content.type] ?? colors.secondary;
  const typeLabel = content.type.toUpperCase();
  const durationLabel =
    content.durationMinutes > 0
      ? `${content.durationMinutes} MIN`
      : "6 AULAS";

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View className={`flex-row items-center gap-3 py-3 ${isLast ? "" : "border-b border-border dark:border-border-dark"}`}>
        <View
          className="w-12 h-12 rounded-2xl items-center justify-center flex-shrink-0"
          style={{ backgroundColor: typeColor + "22" }}
        >
          <Ionicons name={icon} size={22} color={typeColor} />
        </View>

        <View className="flex-1 gap-0.5">
          <AppText variant="bodyMedium" className="font-semibold leading-snug" numberOfLines={2}>
            {content.title}
          </AppText>
          <AppText variant="small" color="muted" numberOfLines={1}>
            {content.description}
          </AppText>
          <AppText variant="caption" color="muted" className="mt-0.5">
            {typeLabel} • {durationLabel}
          </AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
}
