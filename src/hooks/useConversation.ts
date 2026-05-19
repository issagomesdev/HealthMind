import { useState, useEffect, useCallback, useRef } from "react";
import { chatService } from "../services/chatService";
import type { ChatConversation, ChatMessage } from "../types/chat";

const PATIENT_AUTO_REPLIES = [
  "Fico feliz que você esteja progredindo!",
  "Continue assim! Você está no caminho certo.",
  "Lembre-se de fazer seu check-in diário.",
  "Isso é muito positivo! Vejo evolução no seu processo.",
];

const PROFESSIONAL_AUTO_REPLIES = [
  "Obrigada por compartilhar isso. Vamos explorar mais na nossa próxima sessão.",
  "Entendi. Continue praticando as técnicas que trabalhamos.",
  "Que bom saber disso! Estou aqui se precisar de apoio.",
  "Anotei. Veremos isso juntos na consulta.",
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function useConversation(
  userRole: "patient" | "professional",
  conversationId: string
) {
  const [conversation, setConversation] = useState<ChatConversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isTypingSimulated, setIsTypingSimulated] = useState(false);
  const autoReplyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    if (!conversationId) return;
    setIsLoading(true);
    try {
      const data = await chatService.getConversationById(userRole, conversationId);
      if (data) {
        setConversation(data);
        setMessages(
          [...data.messages].sort(
            (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
          )
        );
        // Mark as read on mount
        await chatService.markConversationAsRead(userRole, conversationId);
      }
    } finally {
      setIsLoading(false);
    }
  }, [userRole, conversationId]);

  useEffect(() => {
    load();
    return () => {
      if (autoReplyTimerRef.current) clearTimeout(autoReplyTimerRef.current);
    };
  }, [load]);

  const sendMessage = useCallback(
    async (text: string, senderId: string) => {
      if (!text.trim() || isSending) return;
      setIsSending(true);
      try {
        const newMsg = await chatService.sendMessage(userRole, conversationId, text, senderId);
        setMessages((prev) => [...prev, newMsg]);

        // Update conversation's lastMessage
        setConversation((prev) =>
          prev
            ? {
                ...prev,
                lastMessage: text,
                lastMessageAt: newMsg.sentAt,
                lastMessageSenderId: senderId,
              }
            : prev
        );

        // Simulate auto-reply only for patient_professional conversations
        if (
          conversation &&
          conversation.conversationType === "patient_professional"
        ) {
          autoReplyTimerRef.current = setTimeout(() => {
            setIsTypingSimulated(true);
            autoReplyTimerRef.current = setTimeout(async () => {
              setIsTypingSimulated(false);
              const replyTexts =
                userRole === "patient" ? PATIENT_AUTO_REPLIES : PROFESSIONAL_AUTO_REPLIES;
              const replyText = pickRandom(replyTexts);
              const autoReplyMsg: ChatMessage = {
                id: `auto-reply-${Date.now()}`,
                conversationId,
                senderId: conversation.participant.id,
                senderRole:
                  conversation.participant.role === "patient" ? "patient" : "professional",
                text: replyText,
                sentAt: new Date().toISOString(),
                status: "delivered",
              };
              setMessages((prev) => [...prev, autoReplyMsg]);
              setConversation((prev) =>
                prev
                  ? {
                      ...prev,
                      lastMessage: replyText,
                      lastMessageAt: autoReplyMsg.sentAt,
                      lastMessageSenderId: conversation.participant.id,
                    }
                  : prev
              );
            }, 2000);
          }, 1500);
        }
      } finally {
        setIsSending(false);
      }
    },
    [userRole, conversationId, conversation, isSending]
  );

  return {
    conversation,
    messages,
    isLoading,
    isSending,
    isTypingSimulated,
    sendMessage,
    refresh: load,
  };
}
