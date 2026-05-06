import React from "react";
import { View, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { ContentItem } from "../../../core/types";

const TYPE_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  trilha:   "map-outline",
  leitura:  "book-outline",
  áudio:    "headset-outline",
  prática:  "barbell-outline",
};

interface FeaturedContentCardProps {
  content: ContentItem;
  onPress?: () => void;
}

export function FeaturedContentCard({ content, onPress }: FeaturedContentCardProps) {
  const icon = TYPE_ICONS[content.type] ?? "document-outline";
  const typeLabel = content.type.charAt(0).toUpperCase() + content.type.slice(1);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.88}>
      <LinearGradient
        colors={["#1a2744", "#1e3a5f"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-3xl overflow-hidden"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.2,
          shadowRadius: 14,
          elevation: 6,
        }}
      >
        {/* Badge */}
        <View className="px-5 pt-5">
          <View className="self-start flex-row items-center gap-1.5 bg-secondary/80 rounded-full px-3 py-1">
            <Ionicons name="star" size={11} color="#fff" />
            <AppText variant="caption" className="text-white font-semibold">
              Trilha em Destaque
            </AppText>
          </View>
        </View>

        <View className="px-5 pt-4 pb-5 gap-3">
          <AppText
            variant="heading3"
            className="font-bold leading-7"
            style={{ color: "#2A9D8F" }}
          >
            {content.title}
          </AppText>

          <AppText variant="body" className="leading-6" style={{ color: "#c8d8e8" }}>
            {content.description}
          </AppText>

          <View className="flex-row items-center gap-1.5">
            <Ionicons name={icon} size={14} color="#8899bb" />
            <AppText variant="caption" style={{ color: "#8899bb" }}>
              {typeLabel} • {content.durationMinutes} min
            </AppText>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}
