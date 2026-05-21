import { useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { chatService } from "../services/chatService";
import { useCallActions } from "./useCallActions";
import { getParticipantProfileRoute } from "../utils/conversationInfoConfig";
import type { ChatConversation } from "../types/chat";

export interface FeedbackConfig {
  title: string;
  description: string;
  icon: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
  iconColor: string;
}

interface UseChatActionsResult {
  isMuted: boolean;
  // Confirmation modals
  showCheckInConfirm: boolean;
  setShowCheckInConfirm: (v: boolean) => void;
  checkInLoading: boolean;
  showMuteConfirm: boolean;
  setShowMuteConfirm: (v: boolean) => void;
  muteLoading: boolean;
  // Feedback modal
  feedbackConfig: FeedbackConfig | null;
  dismissFeedback: () => void;
  // Handlers
  handleInfoAction: (action: string) => void;
  handleCallConfirm: (callType: "voice" | "video") => void;
  confirmCheckIn: () => Promise<void>;
  confirmMute: () => Promise<void>;
}

export function useChatActions(
  conversation: ChatConversation | null,
  userRole: "patient" | "professional",
  router: ReturnType<typeof useRouter>
): UseChatActionsResult {
  const { startSimulatedCall } = useCallActions();
  const [isMuted, setIsMuted] = useState(conversation?.isMuted ?? false);
  const [showCheckInConfirm, setShowCheckInConfirm] = useState(false);
  const [checkInLoading, setCheckInLoading] = useState(false);
  const [showMuteConfirm, setShowMuteConfirm] = useState(false);
  const [muteLoading, setMuteLoading] = useState(false);
  const [feedbackConfig, setFeedbackConfig] = useState<FeedbackConfig | null>(null);

  const handleInfoAction = useCallback(
    (action: string) => {
      if (!conversation) return;
      const { id: participantId, name: participantName } = conversation.participant;

      switch (action) {
        case "view-agenda":
          router.push("/(protected)/appointments" as any);
          break;

        case "patient-chart":
          router.push(`/(protected)/patient-details?id=${participantId}` as any);
          break;

        case "evolution":
          router.push(
            `/(protected)/evolution-dashboard?initialSearch=${encodeURIComponent(participantName)}&patientId=${participantId}` as any
          );
          break;

        case "schedule-appointment":
          if (userRole === "professional") {
            router.push(
              `/(protected)/create-appointment?selectedPatientId=${participantId}&selectedPatientName=${encodeURIComponent(participantName)}` as any
            );
          } else {
            router.push("/(protected)/appointments" as any);
          }
          break;

        case "request-checkin":
          setShowCheckInConfirm(true);
          break;

        case "mute":
          setShowMuteConfirm(true);
          break;

        case "support":
          router.push("/(protected)/appointments" as any);
          break;

        case "view-profile":
          router.push(
            getParticipantProfileRoute(conversation.participant.role, participantId) as any
          );
          break;
      }
    },
    [conversation, userRole, router]
  );

  const handleCallConfirm = useCallback(
    (callType: "voice" | "video") => {
      if (!conversation) return;
      startSimulatedCall(
        { id: conversation.participant.id, name: conversation.participant.name },
        callType
      );
    },
    [conversation, startSimulatedCall]
  );

  const confirmCheckIn = useCallback(async () => {
    if (!conversation) return;
    setCheckInLoading(true);
    await chatService.requestPatientCheckIn(conversation.participant.id);
    setCheckInLoading(false);
    setShowCheckInConfirm(false);
    setFeedbackConfig({
      title: "Solicitação enviada",
      description: "Solicitação de check-in enviada.",
      icon: "checkmark-circle-outline",
      iconColor: "#6DBF7B",
    });
  }, [conversation]);

  const confirmMute = useCallback(async () => {
    if (!conversation) return;
    setMuteLoading(true);
    const newMuted = await chatService.toggleMuteConversation(userRole, conversation.id);
    setMuteLoading(false);
    setShowMuteConfirm(false);
    setIsMuted(newMuted);
    setFeedbackConfig(
      newMuted
        ? {
            title: "Conversa silenciada",
            description: "Conversa silenciada.",
            icon: "volume-mute-outline",
            iconColor: "#9CA3AF",
          }
        : {
            title: "Silêncio removido",
            description: "Silêncio removido.",
            icon: "volume-high-outline",
            iconColor: "#60A5FA",
          }
    );
  }, [conversation, userRole]);

  const dismissFeedback = useCallback(() => setFeedbackConfig(null), []);

  return {
    isMuted,
    showCheckInConfirm,
    setShowCheckInConfirm,
    checkInLoading,
    showMuteConfirm,
    setShowMuteConfirm,
    muteLoading,
    feedbackConfig,
    dismissFeedback,
    handleInfoAction,
    handleCallConfirm,
    confirmCheckIn,
    confirmMute,
  };
}
