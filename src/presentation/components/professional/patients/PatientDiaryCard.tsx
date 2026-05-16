import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../ui/AppText";
import { DiaryRecord } from "../../../../types/patient";
import { DiaryMoodBadge, getMoodColor } from "./DiaryMoodBadge";
import { useTheme } from "../../../../core/theme";

interface PatientDiaryCardProps {
  record: DiaryRecord;
  onPress: () => void;
}

function formatRecordedAt(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PatientDiaryCard({ record, onPress }: PatientDiaryCardProps) {
  const { colors } = useTheme();
  const borderColor = getMoodColor(record.mood);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      style={{
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 16,
        borderLeftWidth: 4,
        borderLeftColor: borderColor,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
        gap: 10,
      }}
    >
      {/* Header row */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View style={{ flex: 1, gap: 4 }}>
          <AppText style={{ fontSize: 12, color: colors.subtle }}>
            {formatRecordedAt(record.recordedAt)}
          </AppText>
          <DiaryMoodBadge mood={record.moodLabel} moodScore={record.mood} size="sm" />
        </View>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          {record.hasAlert && (
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: "#EF444420",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="warning-outline" size={14} color="#EF4444" />
            </View>
          )}
          {!record.sharedWithProfessional && (
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: colors.muted + "40",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="lock-closed-outline" size={13} color={colors.subtle} />
            </View>
          )}
          <Ionicons name="chevron-forward-outline" size={16} color={colors.subtle} />
        </View>
      </View>

      {/* Dominant emotion */}
      <AppText style={{ fontSize: 13, fontWeight: "600", color: colors.content }}>
        {record.dominantEmotion}
      </AppText>

      {/* Summary */}
      <AppText
        style={{ fontSize: 13, color: colors.subtle, lineHeight: 19 }}
        numberOfLines={2}
      >
        {record.summary}
      </AppText>

      {/* Tags */}
      {record.emotionTags.length > 0 && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
          {record.emotionTags.slice(0, 4).map((tag) => (
            <View
              key={tag}
              style={{
                backgroundColor: colors.muted + "50",
                borderRadius: 99,
                paddingHorizontal: 8,
                paddingVertical: 2,
              }}
            >
              <AppText style={{ fontSize: 11, color: colors.subtle }}>#{tag}</AppText>
            </View>
          ))}
        </View>
      )}

      {/* Alert message */}
      {record.hasAlert && record.alertMessage && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor: "#EF444412",
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 6,
          }}
        >
          <Ionicons name="alert-circle-outline" size={13} color="#EF4444" />
          <AppText style={{ fontSize: 11, color: "#EF4444", flex: 1 }} numberOfLines={1}>
            {record.alertMessage}
          </AppText>
        </View>
      )}
    </TouchableOpacity>
  );
}
