import patientData from "../data/fake/payments/patientPayments.json";
import professionalData from "../data/fake/payments/professionalPayments.json";
import type {
  PaymentTransaction,
  PaymentSummary,
  PaymentMethod,
  ExtraCharge,
  PaymentPayout,
  PaymentStatus,
  ToReceiveItem,
} from "../types/payment";

const delay = (ms = 400) => new Promise<void>((r) => setTimeout(r, ms));

// Mutable in-memory copies
let patientTransactions: PaymentTransaction[] = [
  ...(patientData.transactions as unknown as PaymentTransaction[]),
];
let patientExtraCharges: ExtraCharge[] = [
  ...(patientData.extraCharges as unknown as ExtraCharge[]),
];
let patientMethods: PaymentMethod[] = [
  ...(patientData.paymentMethods as unknown as PaymentMethod[]),
];
let professionalTransactions: PaymentTransaction[] = [
  ...(professionalData.transactions as unknown as PaymentTransaction[]),
];
let professionalPayouts: PaymentPayout[] = [
  ...(professionalData.payouts as unknown as PaymentPayout[]),
];
let professionalExtraCharges: ExtraCharge[] = [
  ...(professionalData.extraCharges as unknown as ExtraCharge[]),
];

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

class PaymentService {
  async getPaymentSummary(
    userRole: "patient" | "professional"
  ): Promise<PaymentSummary> {
    await delay();
    if (userRole === "patient") {
      return patientData.summary as unknown as PaymentSummary;
    }
    return professionalData.summary as unknown as PaymentSummary;
  }

  async getTransactions(
    userRole: "patient" | "professional",
    filter?: string,
    search?: string
  ): Promise<PaymentTransaction[]> {
    await delay();
    let list =
      userRole === "patient" ? patientTransactions : professionalTransactions;

    // Apply filter
    if (filter && filter !== "all") {
      if (filter === "pending") {
        list = list.filter((t) => t.status === "pending");
      } else if (filter === "paid") {
        list = list.filter(
          (t) => t.status === "paid" || t.status === "received"
        );
      } else if (filter === "overdue") {
        list = list.filter((t) => t.status === "overdue");
      } else if (filter === "plans") {
        list = list.filter((t) => t.type === "subscription");
      } else if (filter === "appointments") {
        list = list.filter((t) => t.type === "appointment");
      } else if (filter === "extra_charges") {
        list = list.filter((t) => t.type === "extra_charge");
      } else if (filter === "received") {
        list = list.filter((t) => t.status === "received");
      } else if (filter === "payouts") {
        list = list.filter((t) => t.type === "payout");
      } else if (filter === "this_month") {
        // fixed month for fake data
        list = list.filter((t) => t.date.startsWith("2026-05"));
      }
    }

    // Apply search
    if (search && search.trim().length > 0) {
      const q = search.trim().toLowerCase();
      list = list.filter((t) =>
        t.relatedPersonName.toLowerCase().includes(q)
      );
    }

    return list;
  }

  async getTransactionById(
    userRole: "patient" | "professional",
    transactionId: string
  ): Promise<PaymentTransaction | null> {
    await delay();
    const list =
      userRole === "patient" ? patientTransactions : professionalTransactions;
    return list.find((t) => t.id === transactionId) ?? null;
  }

  async getPaymentMethods(
    userRole: "patient" | "professional"
  ): Promise<PaymentMethod[]> {
    await delay();
    if (userRole === "patient") {
      return patientMethods;
    }
    // Professional: return receiving account info as payment method entry
    const acct = professionalData.receivingAccount;
    return [
      {
        id: "receiving-account",
        type: "pix",
        label: `PIX - ${acct.pixKey}`,
        isDefault: true,
        icon: "business-outline",
        bankName: acct.bankName,
        accountNumber: acct.accountNumber,
        pixKey: acct.pixKey,
      },
    ];
  }

  async addPaymentMethod(
    userRole: "patient" | "professional",
    method: Omit<PaymentMethod, "id">
  ): Promise<PaymentMethod> {
    await delay();
    const newMethod: PaymentMethod = { ...method, id: `pm-${generateId()}` };
    if (userRole === "patient") {
      patientMethods.push(newMethod);
    }
    return newMethod;
  }

  async removePaymentMethod(
    userRole: "patient" | "professional",
    methodId: string
  ): Promise<void> {
    await delay();
    if (userRole === "patient") {
      patientMethods = patientMethods.filter((m) => m.id !== methodId);
    }
  }

  async setDefaultPaymentMethod(
    userRole: "patient" | "professional",
    methodId: string
  ): Promise<void> {
    await delay();
    if (userRole === "patient") {
      patientMethods = patientMethods.map((m) => ({
        ...m,
        isDefault: m.id === methodId,
      }));
    }
  }

  async payFakeInvoice(
    userRole: "patient" | "professional",
    transactionId: string
  ): Promise<PaymentTransaction> {
    await delay(800);
    const list =
      userRole === "patient" ? patientTransactions : professionalTransactions;
    const idx = list.findIndex((t) => t.id === transactionId);
    if (idx === -1) throw new Error("Transação não encontrada");

    const updated: PaymentTransaction = {
      ...list[idx],
      status: userRole === "patient" ? "paid" : "received",
      timeline: [
        ...list[idx].timeline,
        {
          id: `ev-${generateId()}`,
          label: "Pagamento confirmado",
          date: new Date().toISOString(),
          icon: "checkmark-circle-outline",
          color: "#065F46",
        },
      ],
    };

    if (userRole === "patient") {
      patientTransactions = patientTransactions.map((t) =>
        t.id === transactionId ? updated : t
      );
    } else {
      professionalTransactions = professionalTransactions.map((t) =>
        t.id === transactionId ? updated : t
      );
    }
    return updated;
  }

  async getExtraCharges(
    userRole: "patient" | "professional"
  ): Promise<ExtraCharge[]> {
    await delay();
    return userRole === "patient"
      ? patientExtraCharges
      : professionalExtraCharges;
  }

  async respondExtraCharge(
    userRole: "patient" | "professional",
    chargeId: string,
    action: "accept" | "reject"
  ): Promise<ExtraCharge> {
    await delay(600);
    const newStatus: PaymentStatus = action === "accept" ? "approved" : "rejected";
    const now = new Date().toISOString();

    let updated: ExtraCharge | undefined;

    if (userRole === "patient") {
      patientExtraCharges = patientExtraCharges.map((c) => {
        if (c.id === chargeId) {
          updated = { ...c, status: newStatus, respondedAt: now };
          return updated;
        }
        return c;
      });
    } else {
      professionalExtraCharges = professionalExtraCharges.map((c) => {
        if (c.id === chargeId) {
          updated = { ...c, status: newStatus, respondedAt: now };
          return updated;
        }
        return c;
      });
    }

    if (!updated) throw new Error("Cobrança não encontrada");
    return updated;
  }

  async createExtraCharge(
    payload: Omit<ExtraCharge, "id" | "createdAt" | "status" | "respondedAt">
  ): Promise<ExtraCharge> {
    await delay(600);
    const newCharge: ExtraCharge = {
      ...payload,
      id: `pec-${generateId()}`,
      createdAt: new Date().toISOString(),
      status: "awaiting_acceptance",
      respondedAt: null,
    };
    professionalExtraCharges.push(newCharge);
    return newCharge;
  }

  async getPayouts(): Promise<PaymentPayout[]> {
    await delay();
    return professionalPayouts;
  }

  async getToReceive(): Promise<ToReceiveItem[]> {
    await delay();
    return professionalData.toReceive as unknown as ToReceiveItem[];
  }

  async requestFakePayout(amount: number): Promise<PaymentPayout> {
    await delay(800);
    const fee = Math.round(amount * 0.025 * 100) / 100;
    const netAmount = Math.round((amount - fee) * 100) / 100;
    const newPayout: PaymentPayout = {
      id: `po-${generateId()}`,
      amount,
      fee,
      netAmount,
      status: "processing",
      requestedAt: new Date().toISOString(),
      processedAt: null,
      method: "PIX - Banco Inter",
      bankAccount: "Inter - Ag. 0001 / CC: ****5412",
    };
    professionalPayouts = [newPayout, ...professionalPayouts];
    return newPayout;
  }

  async exportPaymentReportFake(): Promise<{
    success: boolean;
    message: string;
  }> {
    await delay(1000);
    return {
      success: true,
      message: "Relatório gerado com sucesso. Download disponível em breve.",
    };
  }
}

export const paymentService = new PaymentService();
