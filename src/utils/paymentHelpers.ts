import type { PaymentTransaction, PaymentType } from "../types/payment";

// ── Subscription type set ─────────────────────────────────────────────────────

const SUBSCRIPTION_TYPES: PaymentType[] = [
  "subscription",
  "premium_plan",
  "renewal",
  "upgrade",
];

export function isSubscriptionPayment(transaction: PaymentTransaction): boolean {
  return SUBSCRIPTION_TYPES.includes(transaction.type);
}

export function isPatientRelatedPayment(transaction: PaymentTransaction): boolean {
  return !!transaction.patientId;
}

// ── Visual variant ────────────────────────────────────────────────────────────

export interface PaymentVisualVariant {
  accentColor: string;
  iconName: string;
  badgeLabel: string;
}

export function getPaymentVisualVariant(
  transaction: PaymentTransaction
): PaymentVisualVariant {
  if (isSubscriptionPayment(transaction)) {
    return {
      accentColor: "#7C3AED",
      iconName: "star-outline",
      badgeLabel: "Assinatura",
    };
  }
  if (transaction.type === "payout") {
    return {
      accentColor: "#0369A1",
      iconName: "arrow-up-circle-outline",
      badgeLabel: "Repasse",
    };
  }
  if (transaction.type === "refund") {
    return {
      accentColor: "#6B7280",
      iconName: "return-down-back-outline",
      badgeLabel: "Reembolso",
    };
  }
  // appointment | contract | extra_charge
  return {
    accentColor: "#059669",
    iconName: "cash-outline",
    badgeLabel: transaction.type === "extra_charge" ? "Cobrança Extra" : "Consulta",
  };
}

// ── Action visibility ─────────────────────────────────────────────────────────

export interface PaymentActions {
  showOpenChat: boolean;
  showExportReceipt: boolean;
  showPayNow: boolean;
  showViewReceipt: boolean;
  showContest: boolean;
}

export function getPaymentActions(
  transaction: PaymentTransaction,
  userRole: "patient" | "professional"
): PaymentActions {
  const isProfessional = userRole === "professional";
  const isSubscription = isSubscriptionPayment(transaction);
  const hasPatient = isPatientRelatedPayment(transaction);
  const isPending = transaction.status === "pending";

  if (isProfessional) {
    return {
      showOpenChat: hasPatient && !isSubscription,
      showExportReceipt: true,
      showPayNow: false,
      showViewReceipt: false,
      showContest: false,
    };
  }

  // patient
  return {
    showOpenChat: false,
    showExportReceipt: isSubscription,
    showPayNow: isPending && !isSubscription,
    showViewReceipt: !isSubscription,
    showContest: !isSubscription && transaction.type !== "refund",
  };
}
