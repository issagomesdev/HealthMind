export type ConversationType = "patient_professional" | "community" | "support" | "professional_network";
export type MessageStatus = "sent" | "delivered" | "read";
export type CallType = "voice" | "video";
export type ChatFilterType = "all" | "unread" | "professionals" | "patients" | "community" | "support" | "online";

export interface ChatParticipant {
  id: string;
  name: string;
  role: "patient" | "professional" | "support" | "community";
  subtitle: string;
  avatarInitials: string;
  avatarUrl: string | null;
  isOnline: boolean;
  lastSeen: string | null;
  isTyping: boolean;
  bio?: string;
  username?: string;
  city?: string;
  state?: string;
  interests?: string[];
  joinedAt?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: "patient" | "professional" | "support";
  text: string;
  sentAt: string;
  status: MessageStatus;
}

export interface ChatConversation {
  id: string;
  conversationType: ConversationType;
  participant: ChatParticipant;
  lastMessage: string;
  lastMessageAt: string;
  lastMessageSenderId: string;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  isBlocked: boolean;
  blockReason: string | null;
  messages: ChatMessage[];
}

export interface AttachmentAction {
  id: string;
  icon: string;
  label: string;
  color: string;
}
