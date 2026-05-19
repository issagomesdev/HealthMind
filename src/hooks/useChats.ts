import { useState, useEffect, useCallback } from "react";
import { chatService } from "../services/chatService";
import type { ChatConversation, ChatFilterType } from "../types/chat";

export function useChats(userRole: "patient" | "professional") {
  const [allConversations, setAllConversations] = useState<ChatConversation[]>([]);
  const [filter, setFilter] = useState<ChatFilterType>("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await chatService.getChatsByUserType(userRole);
      setAllConversations(data);
    } finally {
      setIsLoading(false);
    }
  }, [userRole]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredConversations = allConversations
    .filter((conv) => {
      switch (filter) {
        case "unread":
          return conv.unreadCount > 0;
        case "professionals":
          return conv.conversationType === "patient_professional";
        case "patients":
          return conv.conversationType === "patient_professional";
        case "community":
          return conv.conversationType === "community";
        case "support":
          return conv.conversationType === "support";
        case "online":
          return conv.participant.isOnline;
        default:
          return true;
      }
    })
    .filter((conv) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        conv.participant.name.toLowerCase().includes(q) ||
        conv.participant.subtitle.toLowerCase().includes(q) ||
        conv.lastMessage.toLowerCase().includes(q)
      );
    });

  const totalUnread = allConversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const markAsRead = useCallback(
    async (conversationId: string) => {
      await chatService.markConversationAsRead(userRole, conversationId);
      setAllConversations((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                unreadCount: 0,
                messages: c.messages.map((m) =>
                  m.status !== "read" ? { ...m, status: "read" as const } : m
                ),
              }
            : c
        )
      );
    },
    [userRole]
  );

  const toggleMute = useCallback(
    async (conversationId: string) => {
      const newValue = await chatService.toggleMuteConversation(userRole, conversationId);
      setAllConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, isMuted: newValue } : c))
      );
    },
    [userRole]
  );

  const togglePin = useCallback(
    async (conversationId: string) => {
      const newValue = await chatService.togglePinConversation(userRole, conversationId);
      setAllConversations((prev) =>
        prev
          .map((c) => (c.id === conversationId ? { ...c, isPinned: newValue } : c))
          .sort((a, b) => {
            if (a.isPinned && !b.isPinned) return -1;
            if (!a.isPinned && b.isPinned) return 1;
            return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
          })
      );
    },
    [userRole]
  );

  const deleteConversation = useCallback(
    async (conversationId: string) => {
      await chatService.deleteConversation(userRole, conversationId);
      setAllConversations((prev) => prev.filter((c) => c.id !== conversationId));
    },
    [userRole]
  );

  return {
    conversations: filteredConversations,
    allConversations,
    filter,
    setFilter,
    search,
    setSearch,
    isLoading,
    refresh: load,
    markAsRead,
    toggleMute,
    togglePin,
    deleteConversation,
    totalUnread,
  };
}
