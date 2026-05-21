export type PaymentUserType = "patient" | "professional";
export type PaymentStatus =
  | "paid"
  | "received"
  | "pending"
  | "overdue"
  | "cancelled"
  | "refunded"
  | "processing"
  | "approved"
  | "rejected"
  | "awaiting_acceptance";
export type PaymentType =
  | "subscription"
  | "premium_plan"
  | "renewal"
  | "upgrade"
  | "appointment"
  | "contract"
  | "extra_charge"
  | "payout"
  | "refund";
export type PaymentMethodType =
  | "credit_card"
  | "pix"
  | "bank_transfer"
  | "platform_balance";
export type PaymentFilterType =
  | "all"
  | "pending"
  | "paid"
  | "overdue"
  | "plans"
  | "appointments"
  | "extra_charges"
  | "received"
  | "payouts"
  | "this_month";

export interface PaymentMethod {
  id: string;
  type: PaymentMethodType;
  label: string;
  isDefault: boolean;
  icon: string;
  lastFour?: string;
  brand?: string;
  pixKey?: string;
  bankName?: string;
  accountNumber?: string;
}

export interface TransactionTimelineEvent {
  id: string;
  label: string;
  date: string;
  icon: string;
  color: string;
}

export interface PaymentTransaction {
  id: string;
  type: PaymentType;
  typeLabel: string;
  status: PaymentStatus;
  amount: number;
  currency: "BRL";
  date: string;
  dueDate?: string;
  description: string;
  relatedPersonName: string;
  relatedPersonId?: string;
  patientId?: string | null;
  paymentMethodId?: string;
  paymentMethodLabel?: string;
  transactionCode: string;
  receiptUrl?: string | null;
  notes?: string;
  timeline: TransactionTimelineEvent[];
}

export interface ExtraCharge {
  id: string;
  patientId: string;
  patientName: string;
  professionalId: string;
  professionalName: string;
  title: string;
  description: string;
  amount: number;
  reason: string;
  dueDate: string;
  status: PaymentStatus;
  createdAt: string;
  respondedAt?: string | null;
  notes?: string;
}

export interface PaymentSummary {
  // Patient
  currentPlan?: string;
  planStatus?: "active" | "expiring" | "cancelled";
  nextBillingDate?: string;
  nextBillingAmount?: number;
  pendingCount?: number;
  pendingAmount?: number;
  paidThisMonth?: number;
  // Professional
  revenueThisMonth?: number;
  revenueLastMonth?: number;
  revenueTrend?: number;
  toReceive?: number;
  professionalPendingCount?: number;
  professionalPendingAmount?: number;
  completedPayouts?: number;
  approvedExtraCharges?: number;
  weeklyRevenue?: Array<{ label: string; amount: number }>;
}

export interface PaymentPayout {
  id: string;
  amount: number;
  fee: number;
  netAmount: number;
  status: PaymentStatus;
  requestedAt: string;
  processedAt?: string | null;
  method: string;
  bankAccount: string;
}

export interface ReceivingAccount {
  bankName: string;
  accountType: string;
  accountNumber: string;
  agency: string;
  pixKey: string;
  pixKeyType: "cpf" | "email" | "phone" | "random";
  verified: boolean;
}

export interface ToReceiveItem {
  id: string;
  patientName: string;
  amount: number;
  dueDate: string;
  reason: string;
  status: "pending" | "overdue";
}
