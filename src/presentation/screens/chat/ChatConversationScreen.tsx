import React, { useState, useRef, useCallback } from "react";
import {
  View,
  FlatList,
  KeyboardAvoidingView,
} from "react-native";
import { AppText } from "../../components/ui/AppText";
import { LoadingState } from "../../components/ui/LoadingState";
import { ConfirmActionModal } from "../../components/ui/ConfirmActionModal";
import { ChatHeader } from "../../components/chat/ChatHeader";
import { MessageBubble } from "../../components/chat/MessageBubble";
import { ChatInputBar } from "../../components/chat/ChatInputBar";
import { TypingIndicator } from "../../components/chat/TypingIndicator";
import { QuickReplyChips } from "../../components/chat/QuickReplyChips";
import { CallActionModal } from "../../components/chat/CallActionModal";
import { AttachmentActionSheet } from "../../components/chat/AttachmentActionSheet";
import { ConversationInfoModal } from "../../components/chat/ConversationInfoModal";
import { useAuth } from "../../../core/auth/AuthContext";
import { useTheme } from "../../../core/theme";
import { useConversation } from "../../../hooks/useConversation";
import { useChatActions } from "../../../hooks/useChatActions";
import { useRouter, useLocalSearchParams } from "expo-router";
import type { ChatMessage } from "../../../types/chat";

type GroupedItem =
  | { type: "date"; label: string }
  | { type: "message"; message: ChatMessage };

const PT_WEEKDAYS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const PT_MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

function getDateLabel(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();

  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffMs = nowOnly.getTime() - dateOnly.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoje";
  if (diffDays === 1) return "Ontem";
  if (diffDays >= 2 && diffDays <= 6) return PT_WEEKDAYS[date.getDay()];
  return `${date.getDate()} de ${PT_MONTHS[date.getMonth()]}`;
}

function groupMessagesByDate(messages: ChatMessage[]): GroupedItem[] {
  const result: GroupedItem[] = [];
  let lastLabel = "";

  for (const message of messages) {
    const label = getDateLabel(message.sentAt);
    if (label !== lastLabel) {
      result.push({ type: "date", label });
      lastLabel = label;
    }
    result.push({ type: "message", message });
  }

  return result;
}

export function ChatConversationScreen() {
  const { conversationId, userRole: userRoleParam } = useLocalSearchParams<{
    conversationId: string;
    userRole: string;
  }>();

  const userRole = (userRoleParam as "patient" | "professional") ?? "patient";
  const { user } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const { conversation, messages, isLoading, isSending, isTypingSimulated, sendMessage } =
    useConversation(userRole, conversationId ?? "");

  const chatActions = useChatActions(conversation, userRole, router);

  const [showCallModal, setShowCallModal] = useState(false);
  const [callType, setCallType] = useState<"voice" | "video">("voice");
  const [showAttachment, setShowAttachment] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [inputText, setInputText] = useState("");
  const [inputFocused, setInputFocused] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  const showQuickReplies = !inputFocused && inputText.length === 0;
  const groupedItems = groupMessagesByDate(messages);

  const handleSend = useCallback(() => {
    const text = inputText.trim();
    if (!text || !user?.id) return;
    setInputText("");
    sendMessage(text, user.id);
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [inputText, user?.id, sendMessage]);

  const handleSelectQuickReply = useCallback((text: string) => {
    setInputText(text);
  }, []);

  const handleAttachmentAction = useCallback((_actionId: string) => {
    // Attachment actions are simulated
  }, []);

  if (isLoading || !conversation) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <LoadingState fullScreen message="Carregando conversa..." />
      </View>
    );
  }

  const participantName = conversation.participant.name;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior="padding"
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <ChatHeader
        conversation={conversation}
        onBack={() => router.back()}
        onCall={(type) => {
          setCallType(type);
          setShowCallModal(true);
        }}
        onInfo={() => setShowInfo(true)}
      />

      {/* Messages list */}
      <FlatList
        ref={flatListRef}
        data={groupedItems}
        keyExtractor={(item, index) =>
          item.type === "date" ? `date-${item.label}-${index}` : item.message.id
        }
        onContentSizeChange={() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }}
        renderItem={({ item }) => {
          if (item.type === "date") {
            return (
              <View style={{ alignItems: "center", marginVertical: 10 }}>
                <View
                  style={{
                    backgroundColor: colors.muted,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                  }}
                >
                  <AppText style={{ fontSize: 12, color: colors.subtle, fontWeight: "600" }}>
                    {item.label}
                  </AppText>
                </View>
              </View>
            );
          }
          const isOwn = item.message.senderId === user?.id;
          return <MessageBubble message={item.message} isOwn={isOwn} />;
        }}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 8 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Typing indicator */}
      {isTypingSimulated && <TypingIndicator name={participantName} />}

      {/* Quick reply chips */}
      {showQuickReplies && (
        <QuickReplyChips userRole={userRole} onSelect={handleSelectQuickReply} />
      )}

      {/* Input bar */}
      <ChatInputBar
        value={inputText}
        onChangeText={(text) => {
          setInputText(text);
          if (!inputFocused && text.length > 0) setInputFocused(true);
        }}
        onSend={handleSend}
        onAttachmentPress={() => setShowAttachment(true)}
        isSending={isSending}
      />

      {/* Call modal */}
      <CallActionModal
        visible={showCallModal}
        onClose={() => setShowCallModal(false)}
        participantName={participantName}
        callType={callType}
        onConfirm={() => {
          setShowCallModal(false);
          chatActions.handleCallConfirm(callType);
        }}
        isBlocked={conversation.isBlocked}
        blockReason={conversation.blockReason}
      />

      {/* Attachment sheet */}
      <AttachmentActionSheet
        visible={showAttachment}
        onClose={() => setShowAttachment(false)}
        onAction={handleAttachmentAction}
        userRole={userRole}
      />

      {/* Conversation info modal */}
      {showInfo && (
        <ConversationInfoModal
          visible={showInfo}
          onClose={() => setShowInfo(false)}
          conversation={conversation}
          userRole={userRole}
          isMuted={chatActions.isMuted}
          onNavigate={chatActions.handleInfoAction}
        />
      )}

      {/* Check-in confirmation */}
      <ConfirmActionModal
        visible={chatActions.showCheckInConfirm}
        isLoading={chatActions.checkInLoading}
        icon="checkmark-circle-outline"
        iconColor="#6DBF7B"
        confirmColor="#6DBF7B"
        title="Solicitar check-in"
        description={`Deseja enviar uma solicitação de check-in emocional para ${participantName}?`}
        confirmLabel="Enviar solicitação"
        cancelLabel="Cancelar"
        onConfirm={chatActions.confirmCheckIn}
        onCancel={() => chatActions.setShowCheckInConfirm(false)}
      />

      {/* Mute / unmute confirmation */}
      <ConfirmActionModal
        visible={chatActions.showMuteConfirm}
        isLoading={chatActions.muteLoading}
        icon={chatActions.isMuted ? "volume-high-outline" : "volume-mute-outline"}
        iconColor={chatActions.isMuted ? "#60A5FA" : "#9CA3AF"}
        title={chatActions.isMuted ? "Remover silêncio" : "Silenciar conversa"}
        description={
          chatActions.isMuted
            ? "Deseja voltar a receber alertas desta conversa?"
            : "Você deixará de receber alertas desta conversa. Deseja continuar?"
        }
        confirmLabel={chatActions.isMuted ? "Remover silêncio" : "Silenciar"}
        cancelLabel="Cancelar"
        onConfirm={chatActions.confirmMute}
        onCancel={() => chatActions.setShowMuteConfirm(false)}
      />

      {/* Feedback modal (success/info) */}
      {chatActions.feedbackConfig && (
        <ConfirmActionModal
          visible={!!chatActions.feedbackConfig}
          icon={chatActions.feedbackConfig.icon}
          iconColor={chatActions.feedbackConfig.iconColor}
          confirmColor={chatActions.feedbackConfig.iconColor}
          title={chatActions.feedbackConfig.title}
          description={chatActions.feedbackConfig.description}
          confirmLabel="Ok"
          cancelLabel={false}
          onConfirm={chatActions.dismissFeedback}
          onCancel={chatActions.dismissFeedback}
        />
      )}
    </KeyboardAvoidingView>
  );
}
