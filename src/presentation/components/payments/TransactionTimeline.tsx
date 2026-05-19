import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";
import type { TransactionTimelineEvent } from "../../../types/payment";

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

interface TransactionTimelineProps {
  events: TransactionTimelineEvent[];
}

export function TransactionTimeline({ events }: TransactionTimelineProps) {
  const { colors } = useTheme();

  return (
    <View>
      {events.map((event, index) => {
        const isLast = index === events.length - 1;
        return (
          <View key={event.id} style={{ flexDirection: "row" }}>
            {/* Left column: dot + line */}
            <View
              style={{
                width: 24,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: event.color,
                  marginTop: 3,
                  zIndex: 1,
                }}
              />
              {!isLast && (
                <View
                  style={{
                    width: 2,
                    flex: 1,
                    backgroundColor: colors.border,
                    marginTop: 2,
                  }}
                />
              )}
            </View>

            {/* Right column: content */}
            <View
              style={{
                flex: 1,
                paddingLeft: 10,
                paddingBottom: isLast ? 0 : 18,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 2,
                }}
              >
                <Ionicons
                  name={event.icon as keyof typeof Ionicons.glyphMap}
                  size={14}
                  color={event.color}
                />
                <AppText
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.content,
                  }}
                >
                  {event.label}
                </AppText>
              </View>
              <AppText style={{ fontSize: 12, color: colors.subtle }}>
                {formatDate(event.date)}
              </AppText>
            </View>
          </View>
        );
      })}
    </View>
  );
}
