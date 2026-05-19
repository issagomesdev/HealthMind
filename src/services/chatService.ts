import patientChatsData from "../data/fake/chats/patientChats.json";
import professionalChatsData from "../data/fake/chats/professionalChats.json";
import extendedMessagesData from "../data/fake/chats/chatMessages.json";
import type { ChatConversation, ChatMessage, MessageStatus } from "../types/chat";

const delay = (ms = 350) => new Promise<void>((r) => setTimeout(r, ms));

// Mutable in-memory state (cloned from JSON on load)
let patientConversations: ChatConversation[] = patientChatsData.map((c) => ({
  ...c,
  messages: c.messages.map((m) => ({ ...m })),
})) as ChatConversation[];

let professionalConversations: ChatConversation[] = professionalChatsData.map((c) => ({
  ...c,
  messages: c.messages.map((m) => ({ ...m })),
})) as ChatConversation[];

const extendedMessages = extendedMessagesData as Record<string, ChatMessage[]>;

function getList(userRole: "patient" | "professional"): ChatConversation[] {
  return userRole === "patient" ? patientConversations : professionalConversations;
}

function setList(userRole: "patient" | "professional", list: ChatConversation[]) {
  if (userRole === "patient") {
    patientConversations = list;
  } else {
    professionalConversations = list;
  }
}

function sortConversations(list: ChatConversation[]): ChatConversation[] {
  return [...list].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime();
  });
}

class ChatService {
  async getChatsByUserType(userRole: "patient" | "professional"): Promise<ChatConversation[]> {
    await delay();
    return sortConversations(getList(userRole)).map((c) => ({ ...c, messages: [...c.messages] }));
  }

  async getConversationById(
    userRole: "patient" | "professional",
    conversationId: string
  ): Promise<ChatConversation | null> {
    await delay();
    const list = getList(userRole);
    const conv = list.find((c) => c.id === conversationId);
    if (!conv) return null;

    // Merge extended messages if available
    const extended = extendedMessages[conversationId];
    if (extended && extended.length > 0) {
      const mergedMessages = [...extended];
      // Add any messages from conv that aren't in the extended set
      conv.messages.forEach((m) => {
        if (!mergedMessages.find((em) => em.id === m.id)) {
          mergedMessages.push(m);
        }
      });
      mergedMessages.sort(
        (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
      );
      return { ...conv, messages: mergedMessages };
    }

    return { ...conv, messages: [...conv.messages] };
  }

  async sendMessage(
    userRole: "patient" | "professional",
    conversationId: string,
    text: string,
    senderId: string
  ): Promise<ChatMessage> {
    await delay(200);
    const list = getList(userRole);
    const index = list.findIndex((c) => c.id === conversationId);
    if (index === -1) throw new Error("Conversation not found");

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId,
      senderRole: userRole === "patient" ? "patient" : "professional",
      text,
      sentAt: new Date().toISOString(),
      status: "sent",
    };

    list[index] = {
      ...list[index],
      messages: [...list[index].messages, newMessage],
      lastMessage: text,
      lastMessageAt: newMessage.sentAt,
      lastMessageSenderId: senderId,
    };

    // Also update extended messages if present
    if (extendedMessages[conversationId]) {
      extendedMessages[conversationId] = [...extendedMessages[conversationId], newMessage];
    }

    setList(userRole, list);
    return newMessage;
  }

  async markConversationAsRead(
    userRole: "patient" | "professional",
    conversationId: string
  ): Promise<void> {
    await delay(100);
    const list = getList(userRole);
    const index = list.findIndex((c) => c.id === conversationId);
    if (index === -1) return;

    list[index] = {
      ...list[index],
      unreadCount: 0,
      messages: list[index].messages.map((m) =>
        m.status !== "read" ? { ...m, status: "read" as MessageStatus } : m
      ),
    };
    setList(userRole, list);
  }

  async toggleMuteConversation(
    userRole: "patient" | "professional",
    conversationId: string
  ): Promise<boolean> {
    await delay(150);
    const list = getList(userRole);
    const index = list.findIndex((c) => c.id === conversationId);
    if (index === -1) return false;

    const newValue = !list[index].isMuted;
    list[index] = { ...list[index], isMuted: newValue };
    setList(userRole, list);
    return newValue;
  }

  async togglePinConversation(
    userRole: "patient" | "professional",
    conversationId: string
  ): Promise<boolean> {
    await delay(150);
    const list = getList(userRole);
    const index = list.findIndex((c) => c.id === conversationId);
    if (index === -1) return false;

    const newValue = !list[index].isPinned;
    list[index] = { ...list[index], isPinned: newValue };
    setList(userRole, list);
    return newValue;
  }

  async deleteConversation(
    userRole: "patient" | "professional",
    conversationId: string
  ): Promise<void> {
    await delay(200);
    const list = getList(userRole);
    setList(
      userRole,
      list.filter((c) => c.id !== conversationId)
    );
  }

  async startFakeCall(
    conversationId: string,
    callType: "voice" | "video"
  ): Promise<{ success: boolean; message: string }> {
    await delay(300);
    // Find in either list
    const conv =
      patientConversations.find((c) => c.id === conversationId) ||
      professionalConversations.find((c) => c.id === conversationId);

    if (!conv) return { success: false, message: "Conversa não encontrada." };
    if (conv.isBlocked) {
      return { success: false, message: conv.blockReason ?? "Chamada bloqueada." };
    }

    const typeLabel = callType === "voice" ? "voz" : "vídeo";
    return { success: true, message: `Chamando ${conv.participant.name} por ${typeLabel}...` };
  }
}

export const chatService = new ChatService();
