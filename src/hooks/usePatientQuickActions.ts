import { useRouter } from "expo-router";
import { chatService } from "../services/chatService";

export function usePatientQuickActions() {
  const router = useRouter();

  const openPatientChat = async (patientId: string, patientName: string) => {
    const conv = await chatService.getConversationByPatientId(patientId);
    if (conv) {
      router.push(
        `/(protected)/chat-conversation?conversationId=${conv.id}&userRole=professional`
      );
    } else {
      router.push("/(protected)/messages");
    }
  };

  const openPatientRecord = (patientId: string) => {
    router.push(`/(protected)/patient-details?id=${patientId}`);
  };

  const schedulePatientAppointment = (patientId: string, patientName: string) => {
    router.push(
      `/(protected)/create-appointment?selectedPatientId=${patientId}&selectedPatientName=${encodeURIComponent(patientName)}`
    );
  };

  const createPatientObservation = (patientId: string, patientName: string) => {
    router.push(
      `/(protected)/add-patient-observation?patientId=${patientId}&patientName=${encodeURIComponent(patientName)}`
    );
  };

  return {
    openPatientChat,
    openPatientRecord,
    schedulePatientAppointment,
    createPatientObservation,
  };
}
