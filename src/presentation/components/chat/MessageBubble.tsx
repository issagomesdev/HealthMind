import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";
import type { ChatMessage } from "../../../types/chat";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  showTime?: boolean;
}

function formatMessageTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusIcon({ status, color }: { status: ChatMessage["status"]; color: string }) {
  const iconName =
    status === "read" ? "checkmark-done-outline" : status === "delivered" ? "checkmark-done-outline" : "checkmark-outline";
  const iconColor = status === "read" ? color : "#aaa";
  return <Ionicons name={iconName} size={12} color={iconColor} />;
}

export function MessageBubble({ message, isOwn, showTime = true }: MessageBubbleProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        alignSelf: isOwn ? "flex-end" : "flex-start",
        maxWidth: "78%",
        marginVertical: 2,
        marginHorizontal: 12,
      }}
    >
      <View
        style={{
          backgroundColor: isOwn ? colors.secondary : colors.surface,
          borderRadius: 18,
          borderBottomRightRadius: isOwn ? 4 : 18,
          borderBottomLeftRadius: isOwn ? 18 : 4,
          paddingHorizontal: 12,
          paddingVertical: 8,
        }}
      >
        <AppText
          style={{
            fontSize: 15,
            color: isOwn ? "#fff" : colors.content,
            lineHeight: 21,
          }}
        >
          {message.text}
        </AppText>

        {showTime && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 3,
              marginTop: 3,
            }}
          >
            <AppText
              style={{
                fontSize: 10,
                color: isOwn ? "rgba(255,255,255,0.7)" : colors.subtle,
              }}
            >
              {formatMessageTime(message.sentAt)}
            </AppText>
            {isOwn && <StatusIcon status={message.status} color={colors.secondary} />}
          </View>
        )}
      </View>
    </View>
  );
}
