import React, { useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TopBar } from "../../../components/navigation/TopBar";
import { AppText } from "../../../components/ui/AppText";
import { AppCard } from "../../../components/ui/AppCard";
import { useTheme } from "../../../../core/theme";
import { patientsService } from "../../../../services/patients/PatientsService";
import {
  TherapyCategory,
  PaymentType,
  RecurringInterval,
  AppointmentFormat,
} from "../../../../types/patient";

const THERAPY_CATEGORIES: TherapyCategory[] = [
  "Ansiedade","Trauma","Estresse","Raiva","Insônia","Depressão",
  "Luto","Relacionamentos","Autoestima","Foco","Burnout",
];

const RECURRING_INTERVALS: { key: RecurringInterval; label: string }[] = [
  { key: "daily", label: "Diário" },
  { key: "weekly", label: "Semanal" },
  { key: "monthly", label: "Mensal" },
  { key: "bimonthly", label: "Bimestral" },
  { key: "annual", label: "Anual" },
];

function maskCurrency(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  const value = parseInt(digits, 10) / 100;
  return value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function ServiceContractRequestScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { colors } = useTheme();

  const [message, setMessage] = useState("");
  const [serviceValueRaw, setServiceValueRaw] = useState("");
  const [paymentType, setPaymentType] = useState<PaymentType>("recurring");
  const [recurringInterval, setRecurringInterval] = useState<RecurringInterval>("monthly");
  const [selectedCategories, setSelectedCategories] = useState<TherapyCategory[]>([]);
  const [sessionsIncluded, setSessionsIncluded] = useState("");
  const [sessionDuration, setSessionDuration] = useState("50");
  const [appointmentFormat, setAppointmentFormat] = useState<AppointmentFormat>("online");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [allowExtraCharges, setAllowExtraCharges] = useState(false);
  const [extraChargesPolicy, setExtraChargesPolicy] = useState("");

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const toggleCategory = (cat: TherapyCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleServiceValueChange = (text: string) => {
    const masked = maskCurrency(text);
    setServiceValueRaw(masked);
  };

  const getNumericValue = (): number => {
    const digits = serviceValueRaw.replace(/\D/g, "");
    if (!digits) return 0;
    return parseInt(digits, 10) / 100;
  };

  const handleSubmitPress = () => {
    if (!userId) return;
    if (selectedCategories.length === 0) {
      setSubmitError("Selecione ao menos uma categoria.");
      return;
    }
    if (!serviceValueRaw) {
      setSubmitError("Informe o valor do serviço.");
      return;
    }
    setSubmitError("");
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    if (!userId) return;
    setIsSubmitting(true);
    try {
      await patientsService.sendServiceContractRequest({
        targetUserId: userId,
        patientUserId: userId,
        patientName: "",
        patientEmail: "",
        patientUsername: "",
        patientAge: 0,
        patientCity: "",
        patientState: "",
        patientCategories: selectedCategories,
        message,
        serviceValue: getNumericValue(),
        paymentType,
        recurringInterval: paymentType === "recurring" ? recurringInterval : null,
        categories: selectedCategories,
        sessionsIncluded: sessionsIncluded ? parseInt(sessionsIncluded, 10) : null,
        sessionDurationMinutes: parseInt(sessionDuration, 10) || 50,
        appointmentFormat,
        additionalNotes,
        allowExtraCharges,
        extraChargesPolicy,
      });
      setShowConfirmModal(false);
      router.replace("/(protected)/(tabs)/patients" as never);
    } catch {
      setIsSubmitting(false);
      setShowConfirmModal(false);
      setSubmitError("Erro ao enviar solicitação. Tente novamente.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
    >
      <View className="flex-1 bg-background dark:bg-background-dark">
        <TopBar
          title="Proposta de Contrato"
          onBackPress={() => router.back()}
          showMenu={false}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, paddingBottom: 48, gap: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Personalized message */}
          <AppCard>
            <AppText variant="bodyMedium" style={{ fontWeight: "700", marginBottom: 12 }}>
              Mensagem personalizada
            </AppText>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Escreva uma mensagem de apresentação para o paciente..."
              placeholderTextColor={colors.subtle}
              multiline
              numberOfLines={4}
              style={{
                color: colors.content,
                backgroundColor: colors.muted + "40",
                borderRadius: 10,
                padding: 12,
                fontSize: 15,
                lineHeight: 22,
                minHeight: 100,
                textAlignVertical: "top",
                borderWidth: 1,
                borderColor: colors.border,
              }}
            />
          </AppCard>

          {/* Service value */}
          <AppCard>
            <AppText variant="bodyMedium" style={{ fontWeight: "700", marginBottom: 12 }}>
              Valor do serviço
            </AppText>
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
              <AppText variant="bodyMedium" color="muted">
                R$
              </AppText>
              <TextInput
                value={serviceValueRaw}
                onChangeText={handleServiceValueChange}
                placeholder="0,00"
                placeholderTextColor={colors.subtle}
                keyboardType="numeric"
                style={{ flex: 1, color: colors.content, fontSize: 18, fontWeight: "600" }}
              />
            </View>
          </AppCard>

          {/* Payment type */}
          <AppCard>
            <AppText variant="bodyMedium" style={{ fontWeight: "700", marginBottom: 12 }}>
              Tipo de pagamento
            </AppText>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {(["single", "recurring"] as PaymentType[]).map((type) => {
                const isActive = paymentType === type;
                const label = type === "single" ? "Pagamento único" : "Recorrente";
                const icon = type === "single" ? "card-outline" : "repeat-outline";
                return (
                  <TouchableOpacity
                    key={type}
                    onPress={() => setPaymentType(type)}
                    activeOpacity={0.7}
                    style={{
                      flex: 1,
                      padding: 14,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: isActive ? colors.secondary : colors.border,
                      backgroundColor: isActive ? colors.secondary + "10" : "transparent",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <Ionicons
                      name={icon}
                      size={22}
                      color={isActive ? colors.secondary : colors.subtle}
                    />
                    <AppText
                      variant="small"
                      style={{
                        color: isActive ? colors.secondary : colors.subtle,
                        fontWeight: isActive ? "600" : "400",
                        textAlign: "center",
                      }}
                    >
                      {label}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Recurrence interval */}
            {paymentType === "recurring" && (
              <View style={{ marginTop: 14 }}>
                <AppText variant="small" color="muted" style={{ marginBottom: 8 }}>
                  Intervalo de cobrança
                </AppText>
                <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                  {RECURRING_INTERVALS.map((interval) => {
                    const isActive = recurringInterval === interval.key;
                    return (
                      <TouchableOpacity
                        key={interval.key}
                        onPress={() => setRecurringInterval(interval.key)}
                        activeOpacity={0.7}
                        style={{
                          paddingHorizontal: 14,
                          paddingVertical: 7,
                          borderRadius: 99,
                          backgroundColor: isActive ? colors.secondary : "transparent",
                          borderWidth: 1.5,
                          borderColor: isActive ? colors.secondary : colors.border,
                        }}
                      >
                        <AppText
                          variant="small"
                          style={{
                            color: isActive ? "#fff" : colors.subtle,
                            fontWeight: isActive ? "600" : "400",
                          }}
                        >
                          {interval.label}
                        </AppText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </AppCard>

          {/* Categories */}
          <AppCard>
            <AppText variant="bodyMedium" style={{ fontWeight: "700", marginBottom: 12 }}>
              Categorias / Problemas
            </AppText>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {THERAPY_CATEGORIES.map((cat) => {
                const isActive = selectedCategories.includes(cat);
                return (
                  <TouchableOpacity
                    key={cat}
                    onPress={() => toggleCategory(cat)}
                    activeOpacity={0.7}
                    style={{
                      paddingHorizontal: 14,
                      paddingVertical: 7,
                      borderRadius: 99,
                      backgroundColor: isActive ? colors.secondary : "transparent",
                      borderWidth: 1.5,
                      borderColor: isActive ? colors.secondary : colors.border,
                    }}
                  >
                    <AppText
                      variant="small"
                      style={{
                        color: isActive ? "#fff" : colors.subtle,
                        fontWeight: isActive ? "600" : "400",
                      }}
                    >
                      {cat}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </AppCard>

          {/* Sessions + Duration */}
          <AppCard>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <AppText variant="small" color="muted" style={{ marginBottom: 8 }}>
                  Sessões incluídas (opcional)
                </AppText>
                <View
                  style={{
                    backgroundColor: colors.muted + "40",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colors.border,
                    paddingHorizontal: 12,
                    height: 44,
                    justifyContent: "center",
                  }}
                >
                  <TextInput
                    value={sessionsIncluded}
                    onChangeText={setSessionsIncluded}
                    placeholder="Ex: 4"
                    placeholderTextColor={colors.subtle}
                    keyboardType="numeric"
                    style={{ color: colors.content, fontSize: 15 }}
                  />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <AppText variant="small" color="muted" style={{ marginBottom: 8 }}>
                  Duração (minutos)
                </AppText>
                <View
                  style={{
                    backgroundColor: colors.muted + "40",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colors.border,
                    paddingHorizontal: 12,
                    height: 44,
                    justifyContent: "center",
                  }}
                >
                  <TextInput
                    value={sessionDuration}
                    onChangeText={setSessionDuration}
                    placeholder="50"
                    placeholderTextColor={colors.subtle}
                    keyboardType="numeric"
                    style={{ color: colors.content, fontSize: 15 }}
                  />
                </View>
              </View>
            </View>
          </AppCard>

          {/* Format */}
          <AppCard>
            <AppText variant="bodyMedium" style={{ fontWeight: "700", marginBottom: 12 }}>
              Formato de atendimento
            </AppText>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {(
                [
                  { key: "online" as AppointmentFormat, label: "Online", icon: "videocam-outline" },
                  { key: "in_person" as AppointmentFormat, label: "Presencial", icon: "business-outline" },
                  { key: "hybrid" as AppointmentFormat, label: "Híbrido", icon: "git-merge-outline" },
                ] as { key: AppointmentFormat; label: string; icon: keyof typeof Ionicons.glyphMap }[]
              ).map((fmt) => {
                const isActive = appointmentFormat === fmt.key;
                return (
                  <TouchableOpacity
                    key={fmt.key}
                    onPress={() => setAppointmentFormat(fmt.key)}
                    activeOpacity={0.7}
                    style={{
                      flex: 1,
                      padding: 12,
                      borderRadius: 12,
                      borderWidth: 2,
                      borderColor: isActive ? colors.secondary : colors.border,
                      backgroundColor: isActive ? colors.secondary + "10" : "transparent",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Ionicons
                      name={fmt.icon}
                      size={20}
                      color={isActive ? colors.secondary : colors.subtle}
                    />
                    <AppText
                      variant="caption"
                      style={{
                        color: isActive ? colors.secondary : colors.subtle,
                        fontWeight: isActive ? "600" : "400",
                        textAlign: "center",
                      }}
                    >
                      {fmt.label}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </AppCard>

          {/* Additional notes */}
          <AppCard>
            <AppText variant="bodyMedium" style={{ fontWeight: "700", marginBottom: 12 }}>
              Observações adicionais
            </AppText>
            <TextInput
              value={additionalNotes}
              onChangeText={setAdditionalNotes}
              placeholder="Horários preferenciais, condições especiais, etc."
              placeholderTextColor={colors.subtle}
              multiline
              numberOfLines={3}
              style={{
                color: colors.content,
                backgroundColor: colors.muted + "40",
                borderRadius: 10,
                padding: 12,
                fontSize: 15,
                lineHeight: 22,
                minHeight: 80,
                textAlignVertical: "top",
                borderWidth: 1,
                borderColor: colors.border,
              }}
            />
          </AppCard>

          {/* Extra charges toggle */}
          <AppCard>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <AppText variant="bodyMedium" style={{ fontWeight: "700" }}>
                  Permitir cobrança extra
                </AppText>
                <AppText variant="small" color="muted">
                  Habilita cobranças por sessões ou materiais adicionais
                </AppText>
              </View>
              <Switch
                value={allowExtraCharges}
                onValueChange={setAllowExtraCharges}
                trackColor={{ false: colors.border, true: colors.secondary + "80" }}
                thumbColor={allowExtraCharges ? colors.secondary : colors.subtle}
              />
            </View>
            {allowExtraCharges && (
              <View style={{ marginTop: 12 }}>
                <AppText variant="small" color="muted" style={{ marginBottom: 8 }}>
                  Política de cobrança extra
                </AppText>
                <TextInput
                  value={extraChargesPolicy}
                  onChangeText={setExtraChargesPolicy}
                  placeholder="Descreva as condições para cobranças extras..."
                  placeholderTextColor={colors.subtle}
                  multiline
                  numberOfLines={3}
                  style={{
                    color: colors.content,
                    backgroundColor: colors.muted + "40",
                    borderRadius: 10,
                    padding: 12,
                    fontSize: 15,
                    lineHeight: 22,
                    minHeight: 80,
                    textAlignVertical: "top",
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                />
              </View>
            )}
          </AppCard>

          {/* Error */}
          {submitError !== "" && (
            <View
              style={{
                backgroundColor: colors.error + "15",
                borderRadius: 10,
                padding: 12,
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ionicons name="alert-circle-outline" size={18} color={colors.error} />
              <AppText variant="small" style={{ color: colors.error }}>
                {submitError}
              </AppText>
            </View>
          )}

          {/* Submit button */}
          <TouchableOpacity
            onPress={handleSubmitPress}
            activeOpacity={0.85}
            style={{
              backgroundColor: colors.secondary,
              borderRadius: 14,
              paddingVertical: 16,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 8,
              shadowColor: colors.secondary,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
              elevation: 6,
            }}
          >
            <Ionicons name="paper-plane-outline" size={20} color="#fff" />
            <AppText variant="bodyMedium" style={{ color: "#fff", fontWeight: "700" }}>
              Enviar solicitação
            </AppText>
          </TouchableOpacity>
        </ScrollView>

        {/* Confirm Modal */}
        <Modal
          visible={showConfirmModal}
          transparent
          animationType="fade"
          onRequestClose={() => !isSubmitting && setShowConfirmModal(false)}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.5)",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
          >
            <View
              style={{
                backgroundColor: colors.surface,
                borderRadius: 20,
                padding: 24,
                width: "100%",
                maxWidth: 360,
                gap: 12,
              }}
            >
              <View style={{ alignItems: "center", marginBottom: 8 }}>
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: colors.secondary + "20",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 12,
                  }}
                >
                  <Ionicons name="paper-plane-outline" size={28} color={colors.secondary} />
                </View>
                <AppText variant="heading3" style={{ fontWeight: "700", textAlign: "center" }}>
                  Confirmar solicitação?
                </AppText>
                <AppText variant="small" color="muted" style={{ textAlign: "center", marginTop: 6 }}>
                  Será enviada uma proposta de contrato terapêutico ao paciente para aceite.
                </AppText>
              </View>
              <View style={{ gap: 10 }}>
                <TouchableOpacity
                  onPress={handleConfirm}
                  disabled={isSubmitting}
                  activeOpacity={0.85}
                  style={{
                    backgroundColor: colors.secondary,
                    borderRadius: 12,
                    paddingVertical: 14,
                    alignItems: "center",
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <AppText variant="bodyMedium" style={{ color: "#fff", fontWeight: "700" }}>
                      Confirmar
                    </AppText>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setShowConfirmModal(false)}
                  disabled={isSubmitting}
                  activeOpacity={0.7}
                  style={{
                    borderRadius: 12,
                    paddingVertical: 14,
                    alignItems: "center",
                    borderWidth: 1.5,
                    borderColor: colors.border,
                  }}
                >
                  <AppText variant="bodyMedium" color="muted">
                    Cancelar
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
}
