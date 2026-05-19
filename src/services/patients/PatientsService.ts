import patientsData from "../../data/fake/patients.json";
import usersData from "../../data/fake/usersToInvite.json";
import paymentsData from "../../data/fake/paymentHistory.json";
import chatsData from "../../data/fake/chats.json";
import {
  ProfessionalPatient,
  UserToInvite,
  PaymentRecord,
  ChatMessage,
  ContractRequest,
  ExtraCharge,
  TherapyCategory,
} from "../../types/patient";

const delay = (ms = 350) => new Promise<void>((r) => setTimeout(r, ms));

// In-memory mutable state
let patients: ProfessionalPatient[] = patientsData.patients as ProfessionalPatient[];
let payments: PaymentRecord[] = paymentsData.payments as PaymentRecord[];
const extraCharges: ExtraCharge[] = paymentsData.extraCharges as ExtraCharge[];
let messages: ChatMessage[] = chatsData.messages as ChatMessage[];

class PatientsService {
  async getProfessionalPatients(): Promise<ProfessionalPatient[]> {
    await delay();
    return [...patients];
  }

  async getPatientById(id: string): Promise<ProfessionalPatient | null> {
    await delay(200);
    return patients.find((p) => p.id === id) ?? null;
  }

  async searchUsersToInvite(
    query: string,
    state?: string,
    categories?: string[]
  ): Promise<UserToInvite[]> {
    await delay(300);
    let users = usersData.users as UserToInvite[];
    if (query) {
      const q = query.toLowerCase();
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q)
      );
    }
    if (state) {
      users = users.filter((u) => u.state === state);
    }
    if (categories?.length) {
      users = users.filter((u) =>
        categories.some((c) => u.categories.includes(c as TherapyCategory))
      );
    }
    return users;
  }

  async sendServiceContractRequest(
    payload: Omit<ContractRequest, "id" | "sentAt"> & { targetUserId: string }
  ): Promise<ProfessionalPatient> {
    await delay(500);
    const user = (usersData.users as UserToInvite[]).find(
      (u) => u.id === payload.targetUserId
    );
    if (!user) throw new Error("Usuário não encontrado");
    const newPatient: ProfessionalPatient = {
      id: `p${Date.now()}`,
      userId: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      avatarUrl: user.avatarUrl,
      age: user.age,
      gender: "Não informado",
      city: user.city,
      state: user.state,
      status: "pending",
      riskLevel: "stable",
      mainComplaint: user.mainComplaint,
      secondaryComplaints: [],
      dominantFeeling: "—",
      recentFeelings: [],
      averageMood: 0,
      moodVariation: 0,
      recurringEmotions: [],
      lastInteraction: new Date().toISOString().split("T")[0],
      nextAppointment: null,
      planTags: [],
      therapyCategories: payload.categories,
      therapyGoals: [],
      diaryPreview: "",
      recentDiaryEntries: [],
      importantNotes: "",
      emotionalAlerts: [],
      progressSummary: "",
      hasHealthInsurance: false,
      healthInsuranceName: null,
      hasPreviousTherapy: false,
      currentMedications: "Não informado",
      memberSince: new Date().toISOString().split("T")[0],
      contractRequest: {
        id: `cr${Date.now()}`,
        patientUserId: user.id,
        patientName: user.name,
        patientEmail: user.email,
        patientUsername: user.username,
        patientAge: user.age,
        patientCity: user.city,
        patientState: user.state,
        patientCategories: user.categories,
        ...payload,
        sentAt: new Date().toISOString(),
      },
    };
    patients = [...patients, newPatient];
    return newPatient;
  }

  async getPatientPaymentHistory(
    patientId: string
  ): Promise<{ payments: PaymentRecord[]; extraCharges: ExtraCharge[] }> {
    await delay(300);
    return {
      payments: payments.filter((p) => p.patientId === patientId),
      extraCharges: extraCharges.filter((e) => e.patientId === patientId),
    };
  }

  async addExtraCharge(
    patientId: string,
    charge: Omit<ExtraCharge, "id" | "patientId" | "requestedAt">
  ): Promise<ExtraCharge> {
    await delay(400);
    const newCharge: ExtraCharge = {
      id: `ec${Date.now()}`,
      patientId,
      requestedAt: new Date().toISOString(),
      ...charge,
    };
    extraCharges.push(newCharge);
    return newCharge;
  }

  async cancelExtraCharge(chargeId: string): Promise<void> {
    await delay(300);
    const index = extraCharges.findIndex((e) => e.id === chargeId);
    if (index !== -1) extraCharges.splice(index, 1);
  }

  async getPatientMessages(patientId: string): Promise<ChatMessage[]> {
    await delay(200);
    return messages.filter((m) => m.patientId === patientId);
  }

  async getUnreadMessageCount(patientId: string): Promise<number> {
    await delay(100);
    const thread = messages
      .filter((m) => m.patientId === patientId)
      .sort((a, b) => a.sentAt.localeCompare(b.sentAt));
    const lastProfMessage = [...thread].reverse().find((m) => m.senderRole === "professional");
    return thread.filter(
      (m) =>
        m.senderRole === "patient" &&
        (!lastProfMessage || m.sentAt > lastProfMessage.sentAt)
    ).length;
  }

  async sendChatMessage(
    patientId: string,
    text: string,
    professionalId: string
  ): Promise<ChatMessage> {
    await delay(150);
    const msg: ChatMessage = {
      id: `msg${Date.now()}`,
      patientId,
      senderId: professionalId,
      senderRole: "professional",
      text,
      sentAt: new Date().toISOString(),
    };
    messages = [...messages, msg];
    return msg;
  }
}

export const patientsService = new PatientsService();
