import { useState, useEffect, useCallback } from "react";
import { paymentService } from "../services/paymentService";
import type {
  PaymentSummary,
  PaymentTransaction,
  ExtraCharge,
  PaymentMethod,
  PaymentPayout,
  PaymentFilterType,
  ToReceiveItem,
} from "../types/payment";

export function usePayments(userRole: "patient" | "professional") {
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [extraCharges, setExtraCharges] = useState<ExtraCharge[]>([]);
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [payouts, setPayouts] = useState<PaymentPayout[]>([]);
  const [toReceive, setToReceive] = useState<ToReceiveItem[]>([]);

  const [filter, setFilter] = useState<PaymentFilterType>("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  // Load all data on mount and refresh
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    const promises: Promise<unknown>[] =
      userRole === "patient"
        ? [
            paymentService.getPaymentSummary(userRole),
            paymentService.getTransactions(userRole),
            paymentService.getExtraCharges(userRole),
            paymentService.getPaymentMethods(userRole),
          ]
        : [
            paymentService.getPaymentSummary(userRole),
            paymentService.getTransactions(userRole),
            paymentService.getExtraCharges(userRole),
            paymentService.getPayouts(),
            paymentService.getToReceive(),
          ];

    Promise.all(promises)
      .then((results) => {
        if (cancelled) return;
        if (userRole === "patient") {
          const [sum, txns, charges, meths] = results as [
            PaymentSummary,
            PaymentTransaction[],
            ExtraCharge[],
            PaymentMethod[]
          ];
          setSummary(sum);
          setTransactions(txns);
          setExtraCharges(charges);
          setMethods(meths);
        } else {
          const [sum, txns, charges, pouts, toRec] = results as [
            PaymentSummary,
            PaymentTransaction[],
            ExtraCharge[],
            PaymentPayout[],
            ToReceiveItem[]
          ];
          setSummary(sum);
          setTransactions(txns);
          setExtraCharges(charges);
          setPayouts(pouts);
          setToReceive(toRec);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userRole, refreshKey]);

  // Filtered transactions (client-side filtering after initial load)
  const filteredTransactions = transactions.filter((t) => {
    let matchesFilter = true;
    let matchesSearch = true;

    if (filter !== "all") {
      if (filter === "pending") matchesFilter = t.status === "pending";
      else if (filter === "paid")
        matchesFilter = t.status === "paid" || t.status === "received";
      else if (filter === "overdue") matchesFilter = t.status === "overdue";
      else if (filter === "plans")
        matchesFilter = (["subscription", "premium_plan", "renewal", "upgrade"] as string[]).includes(t.type);
      else if (filter === "appointments")
        matchesFilter = t.type === "appointment";
      else if (filter === "extra_charges")
        matchesFilter = t.type === "extra_charge";
      else if (filter === "received") matchesFilter = t.status === "received";
      else if (filter === "payouts") matchesFilter = t.type === "payout";
      else if (filter === "this_month")
        matchesFilter = t.date.startsWith("2026-05");
    }

    if (search.trim().length > 0) {
      matchesSearch = t.relatedPersonName
        .toLowerCase()
        .includes(search.trim().toLowerCase());
    }

    return matchesFilter && matchesSearch;
  });

  const payTransaction = useCallback(
    async (transactionId: string) => {
      const updated = await paymentService.payFakeInvoice(
        userRole,
        transactionId
      );
      setTransactions((prev) =>
        prev.map((t) => (t.id === transactionId ? updated : t))
      );
      return updated;
    },
    [userRole]
  );

  const respondToCharge = useCallback(
    async (chargeId: string, action: "accept" | "reject") => {
      const updated = await paymentService.respondExtraCharge(
        userRole,
        chargeId,
        action
      );
      setExtraCharges((prev) =>
        prev.map((c) => (c.id === chargeId ? updated : c))
      );
      return updated;
    },
    [userRole]
  );

  const requestPayout = useCallback(async (amount: number) => {
    const newPayout = await paymentService.requestFakePayout(amount);
    setPayouts((prev) => [newPayout, ...prev]);
    return newPayout;
  }, []);

  return {
    summary,
    transactions: filteredTransactions,
    allTransactions: transactions,
    extraCharges,
    methods,
    payouts,
    toReceive,
    filter,
    setFilter,
    search,
    setSearch,
    isLoading,
    refresh,
    payTransaction,
    respondToCharge,
    requestPayout,
  };
}
