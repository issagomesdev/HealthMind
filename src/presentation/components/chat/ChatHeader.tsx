import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "../ui/AppText";
import { OnlineStatusBadge } from "./OnlineStatusBadge";
import { useTheme } from "../../../core/theme";
import type { ChatConversation } from "../../../types/chat";

interface ChatHeaderProps {
  conversation: ChatConversation;
  onBack: () => void;
  onCall: (type: "voice" | "video") => void;
  onInfo: () => void;
}

const ONLINE_GREEN = "#6DBF7B";

function formatLastSeen(lastSeen: string | null): string {
  if (!lastSeen) return "";
  const date = new Date(lastSeen);
  return `Visto às ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}

export function ChatHeader({ conversation, onBack, onCall, onInfo }: ChatHeaderProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { participant } = conversation;

  let statusText = "";
  let statusColor = colors.subtle;

  if (participant.isTyping) {
    statusText = "Digitando...";
    statusColor = colors.secondary;
  } else if (participant.isOnline) {
    statusText = "Online";
    statusColor = ONLINE_GREEN;
  } else if (participant.lastSeen) {
    statusText = formatLastSeen(participant.lastSeen);
    statusColor = colors.subtle;
  }

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        paddingTop: insets.top + 10,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        gap: 10,
      }}
    >
      {/* Back button */}
      <TouchableOpacity
        onPress={onBack}
        activeOpacity={0.7}
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.muted,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="chevron-back" size={24} color={colors.content} />
      </TouchableOpacity>

      {/* Avatar */}
      <View style={{ position: "relative" }}>
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 19,
            backgroundColor: colors.secondary + "22",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AppText style={{ fontSize: 14, fontWeight: "700", color: colors.secondary }}>
            {participant.avatarInitials}
          </AppText>
        </View>
        <View style={{ position: "absolute", bottom: 0, right: 0 }}>
          <OnlineStatusBadge isOnline={participant.isOnline} />
        </View>
      </View>

      {/* Name & status */}
      <View style={{ flex: 1 }}>
        <AppText style={{ fontSize: 15, fontWeight: "700", color: colors.content }} numberOfLines={1}>
          {participant.name}
        </AppText>
        {statusText ? (
          <AppText style={{ fontSize: 12, color: statusColor, marginTop: 1 }}>
            {statusText}
          </AppText>
        ) : null}
      </View>

      {/* Call buttons + info */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        {conversation.conversationType === "patient_professional" && (
          <>
            <TouchableOpacity
              onPress={() => onCall("voice")}
              activeOpacity={0.75}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: colors.secondary + "18",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="call-outline" size={18} color={colors.secondary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => onCall("video")}
              activeOpacity={0.75}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: colors.secondary + "18",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="videocam-outline" size={19} color={colors.secondary} />
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          onPress={onInfo}
          activeOpacity={0.75}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.muted,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="information-circle-outline" size={20} color={colors.subtle} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
