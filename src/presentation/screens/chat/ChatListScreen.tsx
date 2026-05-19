import React, { useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { AppText } from "../../components/ui/AppText";
import { LoadingState } from "../../components/ui/LoadingState";
import { TopBar } from "../../components/navigation/TopBar";
import { useAuth } from "../../../core/auth/AuthContext";
import { useTheme } from "../../../core/theme";
import { useChats } from "../../../hooks/useChats";
import { ChatListItem } from "../../components/chat/ChatListItem";
import { ChatSearchBar } from "../../components/chat/ChatSearchBar";
import { ChatFilterChips } from "../../components/chat/ChatFilterChips";
import { EmptyChatState } from "../../components/chat/EmptyChatState";
import type { ChatConversation } from "../../../types/chat";

interface LongPressActionSheetProps {
  conversation: ChatConversation;
  onClose: () => void;
  onMute: () => void;
  onPin: () => void;
  onMarkRead: () => void;
  onDelete: () => void;
}

function LongPressActionSheet({
  conversation,
  onClose,
  onMute,
  onPin,
  onMarkRead,
  onDelete,
}: LongPressActionSheetProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const actions = [
    {
      icon: conversation.isMuted ? "volume-high-outline" : "volume-mute-outline",
      label: conversation.isMuted ? "Reativar notificações" : "Silenciar",
      onPress: onMute,
    },
    {
      icon: conversation.isPinned ? "pin-outline" : "pin-outline",
      label: conversation.isPinned ? "Desafixar" : "Fixar conversa",
      onPress: onPin,
    },
    {
      icon: "checkmark-done-outline",
      label: "Marcar como lida",
      onPress: onMarkRead,
    },
    {
      icon: "trash-outline",
      label: "Apagar conversa",
      onPress: onDelete,
      danger: true,
    },
  ];

  return (
    <Modal
      visible
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" }}
        onPress={onClose}
      >
        <Pressable
          style={{
            backgroundColor: colors.surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingBottom: insets.bottom + 16,
            paddingTop: 12,
          }}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Handle */}
          <View
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              backgroundColor: colors.border,
              alignSelf: "center",
              marginBottom: 16,
            }}
          />

          <AppText
            style={{
              fontSize: 15,
              fontWeight: "700",
              color: colors.content,
              paddingHorizontal: 20,
              marginBottom: 8,
            }}
          >
            {conversation.participant.name}
          </AppText>

          {actions.map((action) => (
            <TouchableOpacity
              key={action.label}
              onPress={() => {
                action.onPress();
                onClose();
              }}
              activeOpacity={0.75}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 20,
                paddingVertical: 15,
                gap: 14,
              }}
            >
              <Ionicons
                name={action.icon as any}
                size={20}
                color={(action as any).danger ? colors.error : colors.content}
              />
              <AppText
                style={{
                  fontSize: 15,
                  color: (action as any).danger ? colors.error : colors.content,
                }}
              >
                {action.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export function ChatListScreen() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const userRole = (user?.role ?? "patient") as "patient" | "professional";

  const {
    conversations,
    filter,
    setFilter,
    search,
    setSearch,
    isLoading,
    markAsRead,
    toggleMute,
    togglePin,
    deleteConversation,
    totalUnread,
  } = useChats(userRole);

  const [longPressConv, setLongPressConv] = useState<ChatConversation | null>(null);

  function handleDelete(conv: ChatConversation) {
    Alert.alert(
      "Apagar conversa",
      `Deseja apagar a conversa com ${conv.participant.name}? Esta ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Apagar",
          style: "destructive",
          onPress: () => deleteConversation(conv.id),
        },
      ]
    );
  }

  const pluralConv = conversations.length === 1 ? "conversa" : "conversas";
  const pluralUnread = totalUnread === 1 ? "não lida" : "não lidas";

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar title="HealthMind" onBackPress={() => router.back()} />

      <FlatList
        data={conversations}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <View style={{ paddingHorizontal: 20, paddingBottom: 8 }}>
              <AppText style={{ fontSize: 28, fontWeight: "800", color: colors.content, lineHeight: 34 }}>
                Mensagens
              </AppText>
              {totalUnread > 0 && (
                <AppText style={{ fontSize: 13, color: colors.subtle, marginTop: 2 }}>
                  {totalUnread} {pluralUnread}
                </AppText>
              )}
            </View>
            <ChatSearchBar
              value={search}
              onChangeText={setSearch}
              onClear={() => setSearch("")}
            />
            <ChatFilterChips filter={filter} onChange={setFilter} userRole={userRole} />
            <AppText
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: colors.subtle,
                paddingHorizontal: 20,
                paddingTop: 8,
                marginBottom: 4,
              }}
            >
              {conversations.length} {pluralConv}
            </AppText>
          </View>
        }
        renderItem={({ item }) => (
          <ChatListItem
            conversation={item}
            onPress={() => {
              markAsRead(item.id);
              router.push(
                `/(protected)/chat-conversation?conversationId=${item.id}&userRole=${userRole}` as any
              );
            }}
            onLongPress={() => setLongPressConv(item)}
          />
        )}
        ListEmptyComponent={
          isLoading ? <LoadingState message="Carregando conversas..." /> : <EmptyChatState filter={filter} />
        }
        contentContainerStyle={{ paddingBottom: insets.bottom + 60 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Safety disclaimer */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 4,
          paddingTop: 6,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.background,
        }}
      >
        <Ionicons name="shield-checkmark-outline" size={11} color={colors.subtle} />
        <AppText style={{ fontSize: 10, color: colors.subtle }}>
          Este chat não substitui atendimento de emergência.
        </AppText>
      </View>

      {/* Long press action sheet */}
      {longPressConv && (
        <LongPressActionSheet
          conversation={longPressConv}
          onClose={() => setLongPressConv(null)}
          onMute={() => toggleMute(longPressConv.id)}
          onPin={() => togglePin(longPressConv.id)}
          onMarkRead={() => markAsRead(longPressConv.id)}
          onDelete={() => handleDelete(longPressConv)}
        />
      )}
    </View>
  );
}
