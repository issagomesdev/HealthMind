import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { AppCard } from "../ui/AppCard";
import { DiaryEntry } from "../../../core/types";
import { useTheme } from "../../../core/theme";

const TAG_EMOJI: Record<string, string> = {
  alegria:   "😊",
  tristeza:  "😢",
  ansiedade: "😰",
  estresse:  "😤",
  raiva:     "😠",
  gratidão:  "🙏",
};

function formatDate(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const date = d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  return { date, time };
}

interface DiaryEntryCardProps {
  entry: DiaryEntry;
  onDelete?: (id: string) => void;
}

export function DiaryEntryCard({ entry, onDelete }: DiaryEntryCardProps) {
  const { colors } = useTheme();
  const { date, time } = formatDate(entry.createdAt);
  const preview = entry.content.length > 120
    ? entry.content.slice(0, 120).trimEnd() + "…"
    : entry.content;

  return (
    <AppCard className="gap-3">
      {/* Header: date + delete */}
      <View className="flex-row items-start justify-between">
        <View className="gap-0.5">
          <AppText variant="bodyMedium" className="font-semibold capitalize">
            {date}
          </AppText>
          <View className="flex-row items-center gap-1">
            <Ionicons name="time-outline" size={12} color={colors.subtle} />
            <AppText variant="caption" color="muted">{time}</AppText>
          </View>
        </View>
        {onDelete && (
          <TouchableOpacity
            onPress={() => onDelete(entry.id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            activeOpacity={0.7}
          >
            <Ionicons name="trash-outline" size={18} color={colors.subtle} />
          </TouchableOpacity>
        )}
      </View>

      {/* Content preview */}
      <AppText variant="body" color="muted" className="leading-6">
        {preview}
      </AppText>

      {/* Feeling tags */}
      {entry.feelings.length > 0 && (
        <View className="flex-row flex-wrap gap-1.5">
          {entry.feelings.map((tag) => (
            <View
              key={tag}
              className="flex-row items-center gap-1 px-2.5 py-1 rounded-full bg-secondary/10 dark:bg-secondary-dark/15"
            >
              <AppText className="text-xs leading-4">{TAG_EMOJI[tag] ?? "🏷"}</AppText>
              <AppText variant="caption" color="secondary" className="capitalize font-medium">
                {tag}
              </AppText>
            </View>
          ))}
        </View>
      )}

      {/* Image indicator */}
      {entry.imageUri && (
        <View className="flex-row items-center gap-1.5">
          <Ionicons name="image-outline" size={14} color={colors.subtle} />
          <AppText variant="caption" color="muted">Foto anexada</AppText>
        </View>
      )}
    </AppCard>
  );
}
