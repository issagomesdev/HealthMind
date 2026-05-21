import type { ChatConversation, ChatParticipant } from "../types/chat";

export interface InfoRowConfig {
  icon: string;
  label: string;
  value: string;
}

export interface ActionRowConfig {
  icon: string;
  label: string;
  action: string;
  color?: string;
}

export interface ConversationInfoConfig {
  infoRows: InfoRowConfig[];
  actionRows: ActionRowConfig[];
}

function getMuteAction(isMuted: boolean): ActionRowConfig {
  return {
    icon: isMuted ? "volume-high-outline" : "volume-mute-outline",
    label: isMuted ? "Remover silêncio" : "Silenciar",
    action: "mute",
  };
}

function getStatusInfoRow(participant: ChatParticipant): InfoRowConfig {
  const statusValue = participant.isOnline
    ? "Online"
    : participant.lastSeen
    ? `Visto em ${new Date(participant.lastSeen).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      })} às ${new Date(participant.lastSeen).toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    : "Offline";
  return { icon: "radio-button-on-outline", label: "Status", value: statusValue };
}

/**
 * Returns contextual info rows and action rows based on:
 * - who is authenticated (authenticatedRole)
 * - the conversation type and participant role
 * - whether the conversation is currently muted
 */
export function getConversationInfoConfig(
  authenticatedRole: "patient" | "professional",
  conversation: ChatConversation,
  isMuted: boolean
): ConversationInfoConfig {
  const { participant } = conversation;

  const isSupport =
    conversation.conversationType === "support" || participant.role === "support";

  // ── Support conversation ────────────────────────────────────────────────────
  if (isSupport) {
    return {
      infoRows: [],
      actionRows: [getMuteAction(isMuted)],
    };
  }

  // ── Authenticated user is PROFESSIONAL ──────────────────────────────────────
  if (authenticatedRole === "professional") {
    if (participant.role === "patient") {
      // Full clinical context
      return {
        infoRows: [
          getStatusInfoRow(participant),
          {
            icon: "time-outline",
            label: "Última interação",
            value: participant.lastSeen
              ? new Date(participant.lastSeen).toLocaleDateString("pt-BR")
              : "Hoje",
          },
          { icon: "calendar-outline", label: "Próxima consulta", value: "20/05/2026 08:30" },
        ],
        actionRows: [
          { icon: "person-outline", label: "Ver perfil", action: "view-profile" },
          { icon: "calendar-outline", label: "Ver agenda", action: "view-agenda" },
          { icon: "document-text-outline", label: "Abrir prontuário", action: "patient-chart" },
          { icon: "stats-chart-outline", label: "Painel de Evolução", action: "evolution" },
          {
            icon: "calendar-check-outline",
            label: "Agendar consulta",
            action: "schedule-appointment",
          },
          {
            icon: "checkmark-circle-outline",
            label: "Solicitar check-in",
            action: "request-checkin",
          },
          getMuteAction(isMuted),
        ],
      };
    }

    // Professional talking with non-patient non-support (peer / community)
    return {
      infoRows: [getStatusInfoRow(participant)],
      actionRows: [
        { icon: "person-outline", label: "Ver perfil", action: "view-profile" },
        getMuteAction(isMuted),
      ],
    };
  }

  // ── Authenticated user is PATIENT ────────────────────────────────────────────
  if (participant.role === "professional") {
    // Patient talking with their professional
    return {
      infoRows: [
        { icon: "briefcase-outline", label: "Especialidade", value: participant.subtitle },
        getStatusInfoRow(participant),
        { icon: "calendar-outline", label: "Próxima consulta", value: "20/05/2026 08:30" },
      ],
      actionRows: [
        { icon: "person-outline", label: "Ver perfil", action: "view-profile" },
        { icon: "calendar-outline", label: "Ver agenda", action: "view-agenda" },
        getMuteAction(isMuted),
      ],
    };
  }

  // Patient talking with community member
  return {
    infoRows: [getStatusInfoRow(participant)],
    actionRows: [
      { icon: "person-outline", label: "Ver perfil", action: "view-profile" },
      getMuteAction(isMuted),
    ],
  };
}

/**
 * Returns the route string for viewing a participant's public profile.
 */
export function getParticipantProfileRoute(role: string, participantId: string): string {
  if (role === "professional") {
    return `/(protected)/public-professional-profile?participantId=${participantId}`;
  }
  return `/(protected)/public-user-profile?participantId=${participantId}&participantType=${role}`;
}
