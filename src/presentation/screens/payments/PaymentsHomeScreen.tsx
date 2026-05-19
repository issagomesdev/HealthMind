import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { TopBar } from "../../components/navigation/TopBar";
import { AppText } from "../../components/ui/AppText";
import { LoadingState } from "../../components/ui/LoadingState";
import { PaymentSummaryCard } from "../../components/payments/PaymentSummaryCard";
import { EarningsChart } from "../../components/payments/EarningsChart";
import { PaymentFilterChips } from "../../components/payments/PaymentFilterChips";
import { PaymentHistoryCard } from "../../components/payments/PaymentHistoryCard";
import { ExtraChargeCard } from "../../components/payments/ExtraChargeCard";
import { PaymentMethodCard } from "../../components/payments/PaymentMethodCard";
import { PayoutCard } from "../../components/payments/PayoutCard";
import { EmptyPaymentsState } from "../../components/payments/EmptyPaymentsState";
import { PaymentActionModal } from "../../components/payments/PaymentActionModal";
import { useAuth } from "../../../core/auth/AuthContext";
import { useTheme } from "../../../core/theme";
import { usePayments } from "../../../hooks/usePayments";
import { paymentService } from "../../../services/paymentService";

const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface SectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

function Section({ title, subtitle, children }: SectionProps) {
  const { colors } = useTheme();
  return (
    <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 12,
        }}
      >
        <AppText
          style={{ fontSize: 17, fontWeight: "800", color: colors.content }}
        >
          {title}
        </AppText>
        {subtitle ? (
          <AppText style={{ fontSize: 12, color: colors.subtle }}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
      {children}
    </View>
  );
}

export function PaymentsHomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { user } = useAuth();
  const userRole = (user?.role ?? "patient") as "patient" | "professional";
  const isProfessional = userRole === "professional";
  const isPatient = !isProfessional;

  const {
    summary,
    transactions,
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
    respondToCharge,
    requestPayout,
  } = usePayments(userRole);

  // Modals
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const pendingCharges =
    isPatient
      ? extraCharges.filter((c) => c.status === "awaiting_acceptance")
      : [];

  const handleRespondCharge = async (
    chargeId: string,
    action: "accept" | "reject"
  ) => {
    try {
      await respondToCharge(chargeId, action);
      Alert.alert(
        action === "accept" ? "Cobrança aceita" : "Cobrança recusada",
        action === "accept"
          ? "A cobrança foi aceita. O pagamento será processado."
          : "A cobrança foi recusada."
      );
    } catch {
      Alert.alert("Erro", "Não foi possível processar sua resposta.");
    }
  };

  const handleRequestPayout = async () => {
    setPayoutLoading(true);
    try {
      await requestPayout(1200.0);
      setShowPayoutModal(false);
      Alert.alert(
        "Repasse solicitado",
        "Seu repasse de R$ 1.200,00 está sendo processado."
      );
    } catch {
      Alert.alert("Erro", "Não foi possível solicitar o repasse.");
    } finally {
      setPayoutLoading(false);
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      const result = await paymentService.exportPaymentReportFake();
      setShowExportModal(false);
      Alert.alert("Sucesso", result.message);
    } catch {
      Alert.alert("Erro", "Não foi possível gerar o relatório.");
    } finally {
      setExportLoading(false);
    }
  };

  const handleSetDefaultMethod = async (methodId: string) => {
    try {
      await paymentService.setDefaultPaymentMethod(userRole, methodId);
      refresh();
    } catch {
      Alert.alert("Erro", "Não foi possível alterar o método padrão.");
    }
  };

  const handleRemoveMethod = async (methodId: string) => {
    Alert.alert(
      "Remover método",
      "Deseja remover este método de pagamento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              await paymentService.removePaymentMethod(userRole, methodId);
              refresh();
            } catch {
              Alert.alert("Erro", "Não foi possível remover o método.");
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingState fullScreen message="Carregando pagamentos..." />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar
        title="HealthMind"
        onBackPress={() => router.back()}
        showNotifications={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 }}>
          <AppText style={{ fontSize: 26, fontWeight: "800", color: colors.content, lineHeight: 32 }}>
            Pagamentos
          </AppText>
          <AppText style={{ fontSize: 13, color: colors.subtle, marginTop: 2 }}>
            {isPatient
              ? "Gerencie planos, consultas e cobranças."
              : "Acompanhe seus ganhos, cobranças e repasses."}
          </AppText>
        </View>

        {/* Summary cards */}
        {summary && (
          <PaymentSummaryCard summary={summary} userRole={userRole} />
        )}

        {/* Professional: Earnings chart */}
        {isProfessional && summary?.weeklyRevenue && (
          <Section
            title="Resumo Financeiro"
            subtitle="Ganhos por semana"
          >
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 16,
                padding: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <EarningsChart data={summary.weeklyRevenue} />
              {summary.revenueTrend !== undefined && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 12,
                    gap: 6,
                  }}
                >
                  <Ionicons
                    name={
                      summary.revenueTrend >= 0
                        ? "trending-up-outline"
                        : "trending-down-outline"
                    }
                    size={16}
                    color={
                      summary.revenueTrend >= 0
                        ? colors.secondary
                        : colors.error
                    }
                  />
                  <AppText
                    style={{
                      fontSize: 13,
                      color:
                        summary.revenueTrend >= 0
                          ? colors.secondary
                          : colors.error,
                      fontWeight: "600",
                    }}
                  >
                    {summary.revenueTrend >= 0 ? "+" : ""}
                    {summary.revenueTrend}% vs mês passado
                  </AppText>
                  <AppText style={{ fontSize: 13, color: colors.subtle }}>
                    ({formatBRL(summary.revenueLastMonth ?? 0)})
                  </AppText>
                </View>
              )}
            </View>
          </Section>
        )}

        {/* Search */}
        <View style={{ paddingHorizontal: 20, marginTop: 20, marginBottom: 4 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: 12,
              height: 44,
              paddingHorizontal: 14,
              gap: 8,
            }}
          >
            <Ionicons name="search-outline" size={18} color={colors.subtle} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Buscar por nome..."
              placeholderTextColor={colors.subtle}
              style={{
                flex: 1,
                fontSize: 14,
                color: colors.content,
              }}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={18} color={colors.subtle} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filter chips */}
        <PaymentFilterChips
          filter={filter}
          onChange={setFilter}
          userRole={userRole}
        />

        {/* Patient: pending extra charges */}
        {isPatient && pendingCharges.length > 0 && (
          <Section title="Cobranças para Aceitar">
            {pendingCharges.map((charge) => (
              <ExtraChargeCard
                key={charge.id}
                charge={charge}
                userRole="patient"
                onPress={() => {}}
                onAccept={() => handleRespondCharge(charge.id, "accept")}
                onReject={() => handleRespondCharge(charge.id, "reject")}
              />
            ))}
          </Section>
        )}

        {/* Professional: A Receber section */}
        {isProfessional && (summary?.toReceive ?? 0) > 0 && toReceive.length > 0 && (
          <Section
            title="A Receber"
            subtitle={formatBRL(summary?.toReceive ?? 0)}
          >
            {toReceive.map((item) => (
              <View
                key={item.id}
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 8,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderLeftWidth: 3,
                  borderLeftColor:
                    item.status === "overdue" ? colors.error : colors.secondary,
                }}
              >
                <View style={{ flex: 1 }}>
                  <AppText
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: colors.content,
                    }}
                  >
                    {item.patientName}
                  </AppText>
                  <AppText style={{ fontSize: 12, color: colors.subtle, marginTop: 2 }}>
                    {item.reason}
                  </AppText>
                  <AppText style={{ fontSize: 11, color: colors.subtle }}>
                    Venc.{" "}
                    {new Date(item.dueDate).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </AppText>
                </View>
                <AppText
                  style={{
                    fontSize: 15,
                    fontWeight: "700",
                    color:
                      item.status === "overdue" ? colors.error : colors.content,
                  }}
                >
                  {formatBRL(item.amount)}
                </AppText>
              </View>
            ))}
          </Section>
        )}

        {/* Transactions list */}
        <Section
          title={isProfessional ? "Pagamentos Recentes" : "Histórico"}
          subtitle={`${transactions.length} transaç${transactions.length === 1 ? "ão" : "ões"}`}
        >
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              overflow: "hidden",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            {transactions.length === 0 ? (
              <EmptyPaymentsState filter={filter} userRole={userRole} />
            ) : (
              transactions.map((t) => (
                <PaymentHistoryCard
                  key={t.id}
                  transaction={t}
                  userRole={userRole}
                  onPress={() =>
                    router.push(
                      `/(protected)/payment-details?id=${t.id}&userRole=${userRole}` as any
                    )
                  }
                />
              ))
            )}
          </View>
        </Section>

        {/* Patient: Payment methods */}
        {isPatient && (
          <Section title="Métodos de Pagamento">
            {methods.map((m) => (
              <PaymentMethodCard
                key={m.id}
                method={m}
                isDefault={m.isDefault}
                onSetDefault={() => handleSetDefaultMethod(m.id)}
                onRemove={() => handleRemoveMethod(m.id)}
              />
            ))}
            <TouchableOpacity
              activeOpacity={0.7}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                paddingVertical: 14,
                borderWidth: 1.5,
                borderColor: colors.secondary,
                borderRadius: 14,
                borderStyle: "dashed",
                marginTop: 4,
              }}
              onPress={() =>
                Alert.alert(
                  "Em breve",
                  "Adição de novos métodos estará disponível em breve."
                )
              }
            >
              <Ionicons name="add-circle-outline" size={20} color={colors.secondary} />
              <AppText
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.secondary,
                }}
              >
                Adicionar método de pagamento
              </AppText>
            </TouchableOpacity>
          </Section>
        )}

        {/* Professional: Payouts section */}
        {isProfessional && (
          <Section title="Repasses">
            {/* Available balance row + request button */}
            <View
              style={{
                backgroundColor: colors.secondary + "15",
                borderRadius: 14,
                padding: 16,
                marginBottom: 14,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <AppText style={{ fontSize: 12, color: colors.subtle }}>
                  Disponível para repasse
                </AppText>
                <AppText
                  style={{
                    fontSize: 20,
                    fontWeight: "800",
                    color: colors.content,
                    marginTop: 2,
                  }}
                >
                  {formatBRL(summary?.revenueThisMonth ?? 0)}
                </AppText>
              </View>
              <TouchableOpacity
                onPress={() => setShowPayoutModal(true)}
                activeOpacity={0.8}
                style={{
                  backgroundColor: colors.secondary,
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                }}
              >
                <AppText
                  style={{
                    fontSize: 13,
                    fontWeight: "700",
                    color: "#fff",
                  }}
                >
                  Solicitar
                </AppText>
              </TouchableOpacity>
            </View>

            {payouts.slice(0, 3).map((p) => (
              <PayoutCard
                key={p.id}
                payout={p}
                onPress={() =>
                  Alert.alert(
                    "Repasse",
                    `Valor: ${formatBRL(p.amount)}\nLíquido: ${formatBRL(p.netAmount)}\nMétodo: ${p.method}`
                  )
                }
              />
            ))}
          </Section>
        )}

        {/* Professional: Extra charges */}
        {isProfessional && extraCharges.length > 0 && (
          <Section title="Cobranças Extras">
            {extraCharges.slice(0, 3).map((charge) => (
              <ExtraChargeCard
                key={charge.id}
                charge={charge}
                userRole="professional"
                onPress={() => {}}
              />
            ))}
          </Section>
        )}

        {/* Professional: Export button */}
        {isProfessional && (
          <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
            <TouchableOpacity
              onPress={() => setShowExportModal(true)}
              activeOpacity={0.8}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                backgroundColor: colors.surface,
                borderRadius: 14,
                paddingVertical: 16,
                borderWidth: 1,
                borderColor: colors.border,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Ionicons
                name="download-outline"
                size={20}
                color={colors.secondary}
              />
              <AppText
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: colors.secondary,
                }}
              >
                Exportar relatório financeiro
              </AppText>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Payout modal */}
      <PaymentActionModal
        visible={showPayoutModal}
        onClose={() => !payoutLoading && setShowPayoutModal(false)}
        title="Solicitar repasse"
        message="Deseja solicitar um repasse de R$ 1.200,00? A taxa de 2,5% será descontada e você receberá R$ 1.170,00."
        confirmLabel="Solicitar"
        onConfirm={handleRequestPayout}
        loading={payoutLoading}
        icon="arrow-up-circle-outline"
      />

      {/* Export modal */}
      <PaymentActionModal
        visible={showExportModal}
        onClose={() => !exportLoading && setShowExportModal(false)}
        title="Exportar relatório"
        message="Gerar relatório financeiro completo com todas as transações do período? O arquivo ficará disponível para download."
        confirmLabel="Exportar"
        onConfirm={handleExport}
        loading={exportLoading}
        icon="document-text-outline"
      />
    </View>
  );
}
