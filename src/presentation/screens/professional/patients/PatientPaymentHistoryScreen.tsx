import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TopBar } from "../../../components/navigation/TopBar";
import { AppText } from "../../../components/ui/AppText";
import { AppCard } from "../../../components/ui/AppCard";
import { LoadingState } from "../../../components/ui/LoadingState";
import { ConfirmActionModal } from "../../../components/ui/ConfirmActionModal";
import { useTheme } from "../../../../core/theme";
import { patientsService } from "../../../../services/patients/PatientsService";
import { ProfessionalPatient, PaymentRecord, ExtraCharge } from "../../../../types/patient";

function maskCurrency(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  const value = parseInt(digits, 10) / 100;
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatBRL(amount: number): string {
  return amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("pt-BR");
}

function getStatusConfig(status: PaymentRecord["status"]) {
  switch (status) {
    case "paid":
      return { label: "Pago", color: "#6DBF7B", bg: "#6DBF7B15" };
    case "pending":
      return { label: "Pendente", color: "#F59E0B", bg: "#F59E0B15" };
    case "overdue":
      return { label: "Atrasado", color: "#EF4444", bg: "#EF444415" };
    default:
      return { label: "—", color: "#9CA3AF", bg: "#9CA3AF15" };
  }
}

export function PatientPaymentHistoryScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const [patient, setPatient] = useState<ProfessionalPatient | null>(null);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [extraCharges, setExtraCharges] = useState<ExtraCharge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Add charge form modal
  const [showForm, setShowForm] = useState(false);
  const [extraDesc, setExtraDesc] = useState("");
  const [extraValueRaw, setExtraValueRaw] = useState("");
  const [extraReason, setExtraReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add charge confirm modal
  const [showAddConfirm, setShowAddConfirm] = useState(false);

  // Cancel charge confirm modal
  const [chargeToCancel, setChargeToCancel] = useState<ExtraCharge | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const [p, hist] = await Promise.all([
          patientsService.getPatientById(id),
          patientsService.getPatientPaymentHistory(id),
        ]);
        setPatient(p);
        setPayments(hist.payments);
        setExtraCharges(hist.extraCharges);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAddExtraCharge = useCallback(async () => {
    if (!id || !extraDesc || !extraValueRaw) return;
    setIsSubmitting(true);
    try {
      const digits = extraValueRaw.replace(/\D/g, "");
      const amount = digits ? parseInt(digits, 10) / 100 : 0;
      const newCharge = await patientsService.addExtraCharge(id, {
        description: extraDesc,
        amount,
        reason: extraReason,
      });
      setExtraCharges((prev) => [newCharge, ...prev]);
      setShowAddConfirm(false);
      setShowForm(false);
      setExtraDesc("");
      setExtraValueRaw("");
      setExtraReason("");
    } finally {
      setIsSubmitting(false);
    }
  }, [id, extraDesc, extraValueRaw, extraReason]);

  const handleCancelCharge = useCallback(async () => {
    if (!chargeToCancel) return;
    setIsCancelling(true);
    try {
      await patientsService.cancelExtraCharge(chargeToCancel.id);
      setExtraCharges((prev) => prev.filter((c) => c.id !== chargeToCancel.id));
      setChargeToCancel(null);
    } finally {
      setIsCancelling(false);
    }
  }, [chargeToCancel]);

  const paidCount = payments.filter((p) => p.status === "paid").length;
  const pendingCount = payments.filter((p) => p.status === "pending").length;
  const overdueCount = payments.filter((p) => p.status === "overdue").length;
  const totalPaid = payments
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        <TopBar title="Histórico de Pagamento" onBackPress={() => router.back()} showMenu={false} />
        <LoadingState message="Carregando pagamentos..." fullScreen />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <TopBar
        title={patient?.name ?? "Histórico de Pagamento"}
        onBackPress={() => router.back()}
        showMenu={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 48, gap: 14 }}
      >
        {/* Status summary */}
        <AppCard>
          <AppText variant="bodyMedium" style={{ fontWeight: "700", marginBottom: 14 }}>
            Resumo financeiro
          </AppText>
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
            <SummaryChip label="Pagos" value={paidCount} color="#6DBF7B" />
            <SummaryChip label="Pendentes" value={pendingCount} color="#F59E0B" />
            <SummaryChip label="Atrasados" value={overdueCount} color="#EF4444" />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              backgroundColor: colors.secondary + "10",
              borderRadius: 10,
              padding: 12,
            }}
          >
            <AppText variant="small" color="muted">Total recebido</AppText>
            <AppText variant="bodyMedium" style={{ color: colors.secondary, fontWeight: "700" }}>
              {formatBRL(totalPaid)}
            </AppText>
          </View>
        </AppCard>

        {/* Payment history */}
        <AppCard>
          <AppText variant="bodyMedium" style={{ fontWeight: "700", marginBottom: 12 }}>
            Histórico de pagamentos
          </AppText>
          {payments.length === 0 ? (
            <AppText variant="small" color="muted" className="text-center py-4">
              Nenhum pagamento registrado.
            </AppText>
          ) : (
            payments.map((payment, index) => {
              const statusConfig = getStatusConfig(payment.status);
              return (
                <View
                  key={payment.id}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: index < payments.length - 1 ? 1 : 0,
                    borderBottomColor: colors.border,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <AppText variant="small" style={{ fontWeight: "600" }} numberOfLines={1}>
                      {payment.description}
                    </AppText>
                    <AppText variant="caption" color="muted">{formatDate(payment.date)}</AppText>
                  </View>
                  <View style={{ alignItems: "flex-end", gap: 4 }}>
                    <AppText variant="small" style={{ fontWeight: "700", color: colors.content }}>
                      {formatBRL(payment.amount)}
                    </AppText>
                    <View
                      style={{
                        backgroundColor: statusConfig.bg,
                        borderRadius: 99,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                      }}
                    >
                      <AppText variant="caption" style={{ color: statusConfig.color, fontWeight: "600" }}>
                        {statusConfig.label}
                      </AppText>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </AppCard>

        {/* Extra charges */}
        {extraCharges.length > 0 && (
          <AppCard>
            <AppText variant="bodyMedium" style={{ fontWeight: "700", marginBottom: 12 }}>
              Cobranças extras
            </AppText>
            {extraCharges.map((charge, index) => (
              <View
                key={charge.id}
                style={{
                  paddingVertical: 12,
                  borderBottomWidth: index < extraCharges.length - 1 ? 1 : 0,
                  borderBottomColor: colors.border,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
                      <AppText variant="small" style={{ fontWeight: "600", flex: 1 }} numberOfLines={1}>
                        {charge.description}
                      </AppText>
                      <AppText variant="small" style={{ fontWeight: "700", color: colors.error }}>
                        {formatBRL(charge.amount)}
                      </AppText>
                    </View>
                    <AppText variant="caption" color="muted">{charge.reason}</AppText>
                    <AppText variant="caption" color="muted">
                      {new Date(charge.requestedAt).toLocaleDateString("pt-BR")}
                    </AppText>
                  </View>
                  {/* Cancel button */}
                  <TouchableOpacity
                    onPress={() => setChargeToCancel(charge)}
                    activeOpacity={0.7}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: colors.error + "12",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 2,
                    }}
                  >
                    <Ionicons name="close" size={16} color={colors.error} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </AppCard>
        )}

        {/* Add extra charge button */}
        <TouchableOpacity
          onPress={() => setShowForm(true)}
          activeOpacity={0.85}
          style={{
            backgroundColor: colors.error,
            borderRadius: 14,
            paddingVertical: 14,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <AppText variant="bodyMedium" style={{ color: "#fff", fontWeight: "700" }}>
            Solicitar cobrança extra
          </AppText>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Charge: Form Modal */}
      <Modal
        visible={showForm}
        transparent
        animationType="slide"
        onRequestClose={() => !isSubmitting && setShowForm(false)}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
          <View
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              gap: 14,
            }}
          >
            <AppText variant="heading3" style={{ fontWeight: "700" }}>
              Solicitar cobrança extra
            </AppText>
            <TextInput
              value={extraDesc}
              onChangeText={setExtraDesc}
              placeholder="Descrição (ex: Material extra)"
              placeholderTextColor={colors.subtle}
              style={{
                backgroundColor: colors.muted + "40",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 12,
                color: colors.content,
                fontSize: 15,
              }}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.muted + "40",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: 12,
                height: 48,
                gap: 6,
              }}
            >
              <AppText variant="bodyMedium" color="muted">R$</AppText>
              <TextInput
                value={extraValueRaw}
                onChangeText={(t) => setExtraValueRaw(maskCurrency(t))}
                placeholder="0,00"
                placeholderTextColor={colors.subtle}
                keyboardType="numeric"
                style={{ flex: 1, color: colors.content, fontSize: 16, fontWeight: "600" }}
              />
            </View>
            <TextInput
              value={extraReason}
              onChangeText={setExtraReason}
              placeholder="Motivo da cobrança"
              placeholderTextColor={colors.subtle}
              multiline
              numberOfLines={3}
              style={{
                backgroundColor: colors.muted + "40",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 12,
                color: colors.content,
                fontSize: 15,
                minHeight: 80,
                textAlignVertical: "top",
              }}
            />
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => setShowForm(false)}
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: "center",
                  borderWidth: 1.5,
                  borderColor: colors.border,
                }}
              >
                <AppText variant="bodyMedium" color="muted">Cancelar</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setShowAddConfirm(true)}
                disabled={!extraDesc || !extraValueRaw}
                style={{
                  flex: 1,
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: "center",
                  backgroundColor: colors.secondary,
                  opacity: !extraDesc || !extraValueRaw ? 0.6 : 1,
                }}
              >
                <AppText variant="bodyMedium" style={{ color: "#fff", fontWeight: "700" }}>
                  Continuar
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Charge: Confirm Modal */}
      <ConfirmActionModal
        visible={showAddConfirm}
        onConfirm={handleAddExtraCharge}
        onCancel={() => setShowAddConfirm(false)}
        isLoading={isSubmitting}
        icon="receipt-outline"
        iconColor={colors.error}
        title="Confirmar cobrança extra?"
        confirmLabel="Confirmar"
        cancelLabel="Voltar"
        confirmColor={colors.error}
        description={
          <AppText style={{ fontSize: 14, color: colors.subtle, textAlign: "center", lineHeight: 20 }}>
            Será enviada uma cobrança de{" "}
            <AppText style={{ fontWeight: "700", color: colors.error }}>R$ {extraValueRaw}</AppText>{" "}
            referente a{" "}
            <AppText style={{ fontWeight: "600", color: colors.content }}>{extraDesc}</AppText>.
            {"\n"}O paciente receberá uma notificação para aceite.
          </AppText>
        }
      />

      {/* Cancel Charge: Confirm Modal */}
      <ConfirmActionModal
        visible={!!chargeToCancel}
        onConfirm={handleCancelCharge}
        onCancel={() => setChargeToCancel(null)}
        isLoading={isCancelling}
        icon="close-circle-outline"
        iconColor={colors.error}
        title="Cancelar cobrança?"
        confirmLabel="Sim, cancelar"
        cancelLabel="Voltar"
        confirmColor={colors.error}
        description={
          chargeToCancel ? (
            <AppText style={{ fontSize: 14, color: colors.subtle, textAlign: "center", lineHeight: 20 }}>
              A cobrança de{" "}
              <AppText style={{ fontWeight: "700", color: colors.error }}>
                {formatBRL(chargeToCancel.amount)}
              </AppText>{" "}
              referente a{" "}
              <AppText style={{ fontWeight: "600", color: colors.content }}>
                {chargeToCancel.description}
              </AppText>{" "}
              será cancelada e removida.
            </AppText>
          ) : ""
        }
      />
    </View>
  );
}

function SummaryChip({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: color + "15",
        borderRadius: 10,
        padding: 10,
        alignItems: "center",
      }}
    >
      <AppText variant="heading3" style={{ color, fontWeight: "700" }}>{value}</AppText>
      <AppText variant="caption" style={{ color: color + "CC" }}>{label}</AppText>
    </View>
  );
}
