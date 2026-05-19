import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../ui/AppText";
import { useTheme } from "../../../../core/theme";
import type { EmotionalInsight } from "../../../../types/evolution";

interface Props {
  insight: EmotionalInsight;
}

const CATEGORY_CONFIG: Record<
  EmotionalInsight["category"],
  { bg: string; border: string; iconColor: string }
> = {
  improvement: { bg: "#F0FDF4", border: "#BBF7D0", iconColor: "#059669" },
  warning: { bg: "#FFF7F7", border: "#FECACA", iconColor: "#DC2626" },
  pattern: { bg: "#EFF6FF", border: "#BFDBFE", iconColor: "#2563EB" },
  engagement: { bg: "#FFFBEB", border: "#FDE68A", iconColor: "#D97706" },
  neutral: { bg: "#F9FAFB", border: "#E5E7EB", iconColor: "#6B7280" },
};

export function InsightCard({ insight }: Props) {
  const { colors } = useTheme();
  const cfg = CATEGORY_CONFIG[insight.category];

  return (
    <View
      className="rounded-2xl p-4 mb-3"
      style={{
        backgroundColor: cfg.bg,
        borderWidth: 1,
        borderColor: cfg.border,
      }}
    >
      <View className="flex-row items-start" style={{ gap: 12 }}>
        {/* Icon area */}
        <View className="items-center" style={{ gap: 4 }}>
          <View
            className="w-9 h-9 rounded-xl items-center justify-center"
            style={{ backgroundColor: cfg.iconColor + "22" }}
          >
            <Ionicons
              name={(insight.icon as keyof typeof Ionicons.glyphMap) ?? "bulb-outline"}
              size={18}
              color={cfg.iconColor}
            />
          </View>
          {/* AI badge */}
          <View
            className="rounded-full px-1.5 py-0.5"
            style={{ backgroundColor: cfg.iconColor + "22" }}
          >
            <AppText style={{ fontSize: 8, fontWeight: "700", color: cfg.iconColor }}>
              IA
            </AppText>
          </View>
        </View>

        {/* Content */}
        <View className="flex-1">
          {insight.patientName ? (
            <AppText variant="caption" style={{ color: cfg.iconColor, fontWeight: "700", marginBottom: 2 }}>
              {insight.patientName}
            </AppText>
          ) : null}
          <AppText style={{ fontSize: 13, fontWeight: "700", color: colors.content, marginBottom: 4 }}>
            {insight.title}
          </AppText>
          <AppText variant="caption" style={{ color: colors.subtle, lineHeight: 17 }}>
            {insight.text}
          </AppText>
        </View>
      </View>
    </View>
  );
}

interface TextInsightCardProps {
  text: string;
}

export function TextInsightCard({ text }: TextInsightCardProps) {
  const { colors } = useTheme();

  return (
    <View
      className="rounded-xl p-3 mb-2 flex-row items-start"
      style={{ backgroundColor: colors.surface, gap: 8 }}
    >
      <Ionicons name="sparkles-outline" size={14} color={colors.secondary} style={{ marginTop: 1 }} />
      <AppText variant="small" style={{ color: colors.content, flex: 1, lineHeight: 18 }}>
        {text}
      </AppText>
    </View>
  );
}
