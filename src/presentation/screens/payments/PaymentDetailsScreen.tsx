import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { TopBar } from "../../components/navigation/TopBar";
import { SuccessModal } from "../../components/ui/SuccessModal";
import { useModal } from "../../../hooks/useModal";
import { AppText } from "../../components/ui/AppText";
import { LoadingState } from "../../components/ui/LoadingState";
import { PaymentStatusBadge } from "../../components/payments/PaymentStatusBadge";
import { TransactionTimeline } from "../../components/payments/TransactionTimeline";
import { PaymentActionModal } from "../../components/payments/PaymentActionModal";
import { useTheme } from "../../../core/theme";
import { paymentService } from "../../../services/paymentService";
import { usePatientQuickActions } from "../../../hooks/usePatientQuickActions";
import {
  getPaymentActions,
  getPaymentVisualVariant,
  isSubscriptionPayment,
} from "../../../utils/paymentHelpers";
import type { PaymentTransaction } from "../../../types/payment";

const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

interface InfoRowProps {
  label: string;
  value: string | undefined | null;
  colors: { border: string; content: string; subtle: string };
}

function InfoRow({ label, value, colors }: InfoRowProps) {
  if (!value) return null;
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <AppText style={{ fontSize: 14, color: colors.subtle, flex: 1 }}>
        {label}
      </AppText>
      <AppText
        style={{
          fontSize: 14,
          fontWeight: "600",
          color: colors.content,
          flex: 2,
          textAlign: "right",
        }}
        numberOfLines={2}
      >
        {value}
      </AppText>
    </View>
  );
}

export function PaymentDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { id, userRole } = useLocalSearchParams<{ id: string; userRole: string }>();

  const role = (userRole ?? "patient") as "patient" | "professional";

  const [transaction, setTransaction] = useState<PaymentTransaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { show: showModal, modalProps } = useModal();
  const [showPayModal, setShowPayModal] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [showContestModal, setShowContestModal] = useState(false);
  const [contestLoading, setContestLoading] = useState(false);

  const { openPatientChat } = usePatientQuickActions();

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    paymentService
      .getTransactionById(role, id)
      .then((t) => {
        setTransaction(t);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [id, role]);

  const handlePay = async () => {
    if (!transaction) return;
    setPayLoading(true);
    try {
      const updated = await paymentService.payFakeInvoice(role, transaction.id);
      setTransaction(updated);
      setShowPayModal(false);
      showModal({ type: "success", title: "Pagamento confirmado", message: "Seu pagamento foi processado com sucesso." });
    } catch {
      showModal({ type: "error", title: "Erro", message: "Não foi possível processar o pagamento." });
    } finally {
      setPayLoading(false);
    }
  };

  const handleContest = async () => {
    setContestLoading(true);
    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 800));
      setShowContestModal(false);
      showModal({ type: "success", title: "Contestação enviada", message: "Sua contestação foi registrada e será analisada em até 5 dias úteis." });
    } catch {
      showModal({ type: "error", title: "Erro", message: "Não foi possível enviar a contestação." });
    } finally {
      setContestLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingState fullScreen message="Carregando detalhes..." />;
  }

  if (!transaction) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <TopBar title="Detalhes" onBackPress={() => router.back()} showNotifications={false} />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.subtle} />
          <AppText style={{ fontSize: 16, color: colors.subtle, marginTop: 12, textAlign: "center" }}>
            Transação não encontrada.
          </AppText>
        </View>
      </View>
    );
  }

  const variant = getPaymentVisualVariant(transaction);
  const actions = getPaymentActions(transaction, role);
  const isSubscription = isSubscriptionPayment(transaction);
  const isNegative = transaction.amount < 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <TopBar title="Detalhes" onBackPress={() => router.back()} showNotifications={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}
      >
        {/* Status hero card */}
        <View style={{ paddingHorizontal: 16, marginTop: 8, marginBottom: 4 }}>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 20,
              padding: 20,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 12,
              elevation: 4,
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <PaymentStatusBadge status={transaction.status} />
              {isSubscription && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    backgroundColor: variant.accentColor + "18",
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 20,
                  }}
                >
                  <Ionicons name={variant.iconName as any} size={12} color={variant.accentColor} />
                  <AppText style={{ fontSize: 11, fontWeight: "700", color: variant.accentColor }}>
                    {variant.badgeLabel}
                  </AppText>
                </View>
              )}
            </View>

            <AppText
              style={{
                fontSize: 32,
                fontWeight: "800",
                color: isNegative ? "#EF4444" : colors.content,
                marginTop: 12,
                marginBottom: 6,
                lineHeight: 36,
              }}
            >
              {formatBRL(transaction.amount)}
            </AppText>
            {isNegative && (
              <AppText style={{ fontSize: 12, color: "#EF4444", marginBottom: 4, fontWeight: "600" }}>
                Saída financeira
              </AppText>
            )}
            <AppText style={{ fontSize: 15, color: colors.content, marginBottom: 4 }}>
              {transaction.description}
            </AppText>
            <AppText style={{ fontSize: 12, color: colors.subtle }}>
              {transaction.transactionCode}
            </AppText>
          </View>
        </View>

        {/* Info rows */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: 16,
              paddingHorizontal: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <InfoRow label="Tipo" value={transaction.typeLabel} colors={colors} />
            <InfoRow label="Data" value={formatDate(transaction.date)} colors={colors} />
            {transaction.dueDate ? (
              <InfoRow label="Vencimento" value={formatDate(transaction.dueDate)} colors={colors} />
            ) : null}
            {transaction.paymentMethodLabel ? (
              <InfoRow label="Método" value={transaction.paymentMethodLabel} colors={colors} />
            ) : null}
            {!isSubscription && (
              <InfoRow label="Relacionado a" value={transaction.relatedPersonName} colors={colors} />
            )}
            {isSubscription && (
              <InfoRow label="Plano" value={transaction.relatedPersonName} colors={colors} />
            )}
            <InfoRow label="Código" value={transaction.transactionCode} colors={colors} />
          </View>
        </View>

        {/* Notes */}
        {transaction.notes ? (
          <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
            <AppText
              style={{ fontSize: 17, fontWeight: "800", color: colors.content, marginBottom: 10 }}
            >
              Observações
            </AppText>
            <View style={{ backgroundColor: colors.surface, borderRadius: 14, padding: 16 }}>
              <AppText style={{ fontSize: 14, color: colors.subtle, lineHeight: 22 }}>
                {transaction.notes}
              </AppText>
            </View>
          </View>
        ) : null}

        {/* Timeline */}
        {transaction.timeline && transaction.timeline.length > 0 && (
          <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
            <AppText
              style={{ fontSize: 17, fontWeight: "800", color: colors.content, marginBottom: 16 }}
            >
              Histórico da transação
            </AppText>
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
              <TransactionTimeline events={transaction.timeline} />
            </View>
          </View>
        )}

        {/* Actions */}
        <View style={{ paddingHorizontal: 16, marginTop: 24, gap: 10 }}>
          {/* Abrir chat — só quando há patientId */}
          {actions.showOpenChat && (
            <TouchableOpacity
              onPress={() =>
                openPatientChat(transaction.patientId!, transaction.relatedPersonName)
              }
              activeOpacity={0.8}
              style={{
                backgroundColor: colors.secondary,
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Ionicons name="chatbubble-outline" size={18} color="#fff" />
              <AppText style={{ fontSize: 15, fontWeight: "700", color: "#fff" }}>
                Abrir chat
              </AppText>
            </TouchableOpacity>
          )}

          {/* Pagar agora — paciente, pendente, não assinatura */}
          {actions.showPayNow && (
            <TouchableOpacity
              onPress={() => setShowPayModal(true)}
              activeOpacity={0.8}
              style={{
                backgroundColor: colors.secondary,
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: "center",
              }}
            >
              <AppText style={{ fontSize: 15, fontWeight: "700", color: "#fff" }}>
                Pagar agora
              </AppText>
            </TouchableOpacity>
          )}

          {/* Ver recibo — paciente, não assinatura */}
          {actions.showViewReceipt && (
            <TouchableOpacity
              onPress={() => showModal({ type: "coming-soon", title: "Em breve", message: "Recibo disponível em breve." })}
              activeOpacity={0.8}
              style={{
                borderWidth: 1.5,
                borderColor: colors.secondary,
                borderRadius: 14,
                paddingVertical: 14,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Ionicons name="receipt-outline" size={18} color={colors.secondary} />
              <AppText style={{ fontSize: 15, fontWeight: "600", color: colors.secondary }}>
                Ver recibo
              </AppText>
            </TouchableOpacity>
          )}

          {/* Contestar cobrança — paciente, não assinatura, não reembolso */}
          {actions.showContest && (
            <TouchableOpacity
              onPress={() => setShowContestModal(true)}
              activeOpacity={0.8}
              style={{
                borderWidth: 1.5,
                borderColor: colors.error,
                borderRadius: 14,
                paddingVertical: 14,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Ionicons name="alert-circle-outline" size={18} color={colors.error} />
              <AppText style={{ fontSize: 15, fontWeight: "600", color: colors.error }}>
                Contestar cobrança
              </AppText>
            </TouchableOpacity>
          )}

          {/* Exportar comprovante — profissional sempre, ou paciente em assinatura */}
          {actions.showExportReceipt && (
            <TouchableOpacity
              onPress={() => showModal({ type: "success", title: "Comprovante", message: "Comprovante exportado com sucesso." })}
              activeOpacity={0.8}
              style={{
                borderWidth: 1.5,
                borderColor: isSubscription ? variant.accentColor : colors.secondary,
                borderRadius: 14,
                paddingVertical: 14,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <Ionicons
                name="download-outline"
                size={18}
                color={isSubscription ? variant.accentColor : colors.secondary}
              />
              <AppText
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: isSubscription ? variant.accentColor : colors.secondary,
                }}
              >
                Exportar comprovante
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <PaymentActionModal
        visible={showPayModal}
        onClose={() => !payLoading && setShowPayModal(false)}
        title="Confirmar pagamento"
        message={`Deseja pagar ${formatBRL(transaction.amount)} agora?\n\n${transaction.description}`}
        confirmLabel="Pagar"
        onConfirm={handlePay}
        loading={payLoading}
        icon="card-outline"
      />

      <PaymentActionModal
        visible={showContestModal}
        onClose={() => !contestLoading && setShowContestModal(false)}
        title="Contestar cobrança"
        message="Deseja contestar esta cobrança? Nossa equipe analisará o caso em até 5 dias úteis e entrará em contato."
        confirmLabel="Contestar"
        onConfirm={handleContest}
        loading={contestLoading}
        danger
        icon="alert-circle-outline"
      />

      <SuccessModal {...modalProps} />
    </View>
  );
}
