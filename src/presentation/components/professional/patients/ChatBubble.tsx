import React from "react";
import { View } from "react-native";
import { AppText } from "../../ui/AppText";
import { useTheme } from "../../../../core/theme";
import { ChatMessage } from "../../../../types/patient";

interface ChatBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

function formatTime(sentAt: string): string {
  const d = new Date(sentAt);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

export function ChatBubble({ message, isOwn }: ChatBubbleProps) {
  const { colors } = useTheme();

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: isOwn ? "flex-end" : "flex-start",
        marginVertical: 4,
        paddingHorizontal: 16,
      }}
    >
      <View
        style={{
          maxWidth: "75%",
          backgroundColor: isOwn ? colors.secondary : colors.surface,
          borderRadius: 16,
          borderBottomRightRadius: isOwn ? 4 : 16,
          borderBottomLeftRadius: isOwn ? 16 : 4,
          paddingHorizontal: 14,
          paddingVertical: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        <AppText
          variant="body"
          style={{
            color: isOwn ? "#ffffff" : colors.content,
            fontSize: 15,
            lineHeight: 22,
          }}
        >
          {message.text}
        </AppText>
        <AppText
          variant="caption"
          style={{
            color: isOwn ? "rgba(255,255,255,0.65)" : colors.subtle,
            marginTop: 4,
            textAlign: "right",
          }}
        >
          {formatTime(message.sentAt)}
        </AppText>
      </View>
    </View>
  );
}
