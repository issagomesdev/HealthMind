import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { UnreadBadge } from "./UnreadBadge";
import { OnlineStatusBadge } from "./OnlineStatusBadge";
import { useTheme } from "../../../core/theme";
import type { ChatConversation } from "../../../types/chat";

interface ChatListItemProps {
  conversation: ChatConversation;
  onPress: () => void;
  onLongPress?: () => void;
  isSelected?: boolean;
}

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
  } else if (diffDays === 1) {
    return "Ontem";
  } else if (diffDays < 7) {
    return date.toLocaleDateString("pt-BR", { weekday: "short" });
  } else {
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
  }
}

function AvatarCircle({ conversation }: { conversation: ChatConversation }) {
  const { colors } = useTheme();
  const { participant } = conversation;

  if (participant.role === "support") {
    return (
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: colors.accent + "33",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="headset-outline" size={22} color={colors.accent} />
      </View>
    );
  }

  if (participant.role === "community") {
    return (
      <View
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: "#6366F122",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="people-outline" size={22} color="#6366F1" />
      </View>
    );
  }

  return (
    <View
      style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.secondary + "22",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <AppText style={{ fontSize: 16, fontWeight: "700", color: colors.secondary }}>
        {participant.avatarInitials}
      </AppText>
    </View>
  );
}

export function ChatListItem({
  conversation,
  onPress,
  onLongPress,
  isSelected = false,
}: ChatListItemProps) {
  const { colors, isDark } = useTheme();
  const { participant, unreadCount, isPinned, isMuted } = conversation;
  const hasUnread = unreadCount > 0;

  const bgColor = isSelected
    ? colors.secondary + "18"
    : hasUnread
    ? isDark
      ? colors.secondary + "0f"
      : colors.secondary + "08"
    : "transparent";

  const previewText =
    participant.isTyping
      ? "Digitando..."
      : conversation.lastMessage;

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.75}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: bgColor,
        gap: 12,
      }}
    >
      {/* Avatar */}
      <View style={{ position: "relative" }}>
        <AvatarCircle conversation={conversation} />
        <View style={{ position: "absolute", bottom: 0, right: 0 }}>
          <OnlineStatusBadge isOnline={participant.isOnline} />
        </View>
      </View>

      {/* Content */}
      <View style={{ flex: 1, gap: 3 }}>
        {/* Name + Time row */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <AppText
            style={{
              fontSize: 15,
              fontWeight: hasUnread ? "700" : "600",
              color: colors.content,
              flex: 1,
            }}
            numberOfLines={1}
          >
            {participant.name}
          </AppText>
          <AppText style={{ fontSize: 12, color: colors.subtle, marginLeft: 8 }}>
            {formatTime(conversation.lastMessageAt)}
          </AppText>
        </View>

        {/* Preview + Badge row */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <AppText
            style={{
              fontSize: 13,
              color: participant.isTyping ? colors.secondary : colors.subtle,
              fontStyle: participant.isTyping ? "italic" : "normal",
              flex: 1,
            }}
            numberOfLines={1}
          >
            {previewText}
          </AppText>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            {isMuted && (
              <Ionicons name="volume-mute-outline" size={13} color={colors.subtle} />
            )}
            {isPinned && (
              <Ionicons name="pin-outline" size={13} color={colors.subtle} />
            )}
            {hasUnread && <UnreadBadge count={unreadCount} />}
          </View>
        </View>
      </View>

      {/* Separator */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 72,
          right: 0,
          height: 0.5,
          backgroundColor: colors.border,
        }}
      />
    </TouchableOpacity>
  );
}
