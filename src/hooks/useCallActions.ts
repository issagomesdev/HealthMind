import { useRouter } from "expo-router";

export interface CallParticipant {
  id: string;
  name: string;
}

export function useCallActions() {
  const router = useRouter();

  const startSimulatedCall = (
    participant: CallParticipant,
    callType: "voice" | "video" = "video"
  ) => {
    router.push(
      `/(protected)/simulated-call?participantId=${participant.id}&participantName=${encodeURIComponent(participant.name)}&callType=${callType}` as any
    );
  };

  return { startSimulatedCall };
}
