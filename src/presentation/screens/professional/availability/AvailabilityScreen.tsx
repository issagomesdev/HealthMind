import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { TopBar } from "../../../components/navigation/TopBar";
import { AppText } from "../../../components/ui/AppText";
import { AppCard } from "../../../components/ui/AppCard";
import { LoadingState } from "../../../components/ui/LoadingState";
import { ConfirmActionModal } from "../../../components/ui/ConfirmActionModal";
import { AvailabilityDayCard } from "../../../components/professional/availability/AvailabilityDayCard";
import { AvailabilitySwitch } from "../../../components/professional/availability/AvailabilitySwitch";
import { AvailableSlotsPreview } from "../../../components/professional/availability/AvailableSlotsPreview";
import { BreakConfigCard } from "../../../components/professional/availability/BreakConfigCard";
import { FormatToggleGroup } from "../../../components/professional/availability/FormatToggleGroup";
import { AppointmentTypeConfigCard } from "../../../components/professional/availability/AppointmentTypeConfigCard";
import { AppointmentRulesCard } from "../../../components/professional/availability/AppointmentRulesCard";
import { UnavailablePeriodCard } from "../../../components/professional/availability/UnavailablePeriodCard";
import { DurationChip } from "../../../components/professional/availability/DurationChip";
import { useProfessionalAvailability } from "../../../../hooks/useProfessionalAvailability";
import { useTheme } from "../../../../core/theme";
import type {
  WeeklyAvailability,
  AvailabilityDay,
  TimeInterval,
  AppointmentTypeConfig,
  UnavailableReason,
  AppointmentFormat,
} from "../../../../types/professionalAvailability";

const DAY_KEYS: (keyof WeeklyAvailability)[] = [
  "segunda",
  "terca",
  "quarta",
  "quinta",
  "sexta",
  "sabado",
  "domingo",
];

const DAY_LABELS: Record<keyof WeeklyAvailability, string> = {
  segunda: "Segunda-feira",
  terca: "Terça-feira",
  quarta: "Quarta-feira",
  quinta: "Quinta-feira",
  sexta: "Sexta-feira",
  sabado: "Sábado",
  domingo: "Domingo",
};

const DURATION_OPTIONS = [30, 45, 50, 60, 90];

const REASON_OPTIONS: { label: string; value: UnavailableReason }[] = [
  { label: "Viagem", value: "viagem" },
  { label: "Evento", value: "evento" },
  { label: "Férias", value: "ferias" },
  { label: "Compromisso pessoal", value: "compromisso_pessoal" },
  { label: "Outro", value: "outro" },
];

function applyDateMask(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
}

function applyTimeMask(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

function parseMaskedDate(masked: string): string {
  // DD/MM/YYYY -> YYYY-MM-DD
  const parts = masked.split("/");
  if (parts.length === 3 && parts[2].length === 4) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return masked;
}

function formatDateForDisplay(iso: string): string {
  // YYYY-MM-DD -> DD/MM/YYYY
  const parts = iso.split("-");
  if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
  return iso;
}

interface SectionHeaderProps {
  title: string;
}

function SectionHeader({ title }: SectionHeaderProps) {
  const { colors } = useTheme();
  return (
    <AppText
      style={{
        fontSize: 11,
        fontWeight: "700",
        color: colors.subtle,
        letterSpacing: 0.8,
        paddingTop: 8,
        marginBottom: 10,
        textTransform: "uppercase",
      }}
    >
      {title}
    </AppText>
  );
}

export function AvailabilityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const {
    availability,
    availableSlots,
    isLoading,
    isSaving,
    toggleGeneralAvailability,
    updateDefaultDuration,
    updateWeeklySchedule,
    updateBreakConfig,
    updateFormatConfig,
    updateBookingRules,
    updateAppointmentTypes,
    addUnavailablePeriod,
    removeUnavailablePeriod,
    save,
    reset,
  } = useProfessionalAvailability();

  // Modals
  const [showSuccess, setShowSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Add unavailable period form
  const [showAddPeriod, setShowAddPeriod] = useState(false);
  const [periodStartDate, setPeriodStartDate] = useState("");
  const [periodEndDate, setPeriodEndDate] = useState("");
  const [periodStartTime, setPeriodStartTime] = useState("");
  const [periodEndTime, setPeriodEndTime] = useState("");
  const [periodReason, setPeriodReason] = useState<UnavailableReason>("outro");
  const [periodNote, setPeriodNote] = useState("");
  const [isAddingPeriod, setIsAddingPeriod] = useState(false);

  if (isLoading || !availability) {
    return <LoadingState fullScreen message="Carregando disponibilidade..." />;
  }

  // --- Day schedule helpers ---
  const handleToggleDay = (dayKey: keyof WeeklyAvailability) => {
    const day = availability.weeklySchedule[dayKey];
    updateWeeklySchedule({
      [dayKey]: { ...day, enabled: !day.enabled },
    });
  };

  const handleAddInterval = (dayKey: keyof WeeklyAvailability) => {
    const day = availability.weeklySchedule[dayKey];
    const newInterval: TimeInterval = {
      id: `${dayKey}_${Date.now()}`,
      start: "09:00",
      end: "17:00",
    };
    updateWeeklySchedule({
      [dayKey]: { ...day, intervals: [...day.intervals, newInterval] },
    });
  };

  const handleRemoveInterval = (
    dayKey: keyof WeeklyAvailability,
    id: string
  ) => {
    const day = availability.weeklySchedule[dayKey];
    updateWeeklySchedule({
      [dayKey]: {
        ...day,
        intervals: day.intervals.filter((iv) => iv.id !== id),
      },
    });
  };

  const handleEditInterval = (
    dayKey: keyof WeeklyAvailability,
    id: string,
    field: "start" | "end",
    value: string
  ) => {
    const day = availability.weeklySchedule[dayKey];
    updateWeeklySchedule({
      [dayKey]: {
        ...day,
        intervals: day.intervals.map((iv) =>
          iv.id === id ? { ...iv, [field]: value } : iv
        ),
      },
    });
  };

  // --- AppointmentTypes helper ---
  const handleUpdateAppointmentType = (updated: AppointmentTypeConfig) => {
    updateAppointmentTypes(
      availability.appointmentTypes.map((t) =>
        t.id === updated.id ? updated : t
      )
    );
  };

  // --- Save handler ---
  const handleSave = async () => {
    const ok = await save();
    if (ok) setShowSuccess(true);
  };

  // --- Reset handler ---
  const handleReset = async () => {
    setShowResetConfirm(false);
    await reset();
    setShowSuccess(true);
  };

  // --- Add unavailable period handler ---
  const handleAddPeriod = async () => {
    if (!periodStartDate || !periodEndDate) return;
    setIsAddingPeriod(true);
    try {
      await addUnavailablePeriod({
        startDate: parseMaskedDate(periodStartDate),
        endDate: parseMaskedDate(periodEndDate),
        startTime: periodStartTime || undefined,
        endTime: periodEndTime || undefined,
        reason: periodReason,
        note: periodNote || undefined,
      });
      // Reset form
      setPeriodStartDate("");
      setPeriodEndDate("");
      setPeriodStartTime("");
      setPeriodEndTime("");
      setPeriodReason("outro");
      setPeriodNote("");
      setShowAddPeriod(false);
    } finally {
      setIsAddingPeriod(false);
    }
  };

  const inputStyle = {
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.muted,
    color: colors.content,
    fontSize: 14,
    paddingHorizontal: 12,
  };

  const hasPresencial = availability.formatConfig.formats.includes("presencial");
  const hasOnline = availability.formatConfig.formats.includes("online");

  return (
    <>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <TopBar
          title="Disponibilidade"
          onBackPress={() => router.back()}
          showNotifications={false}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: insets.bottom + 40,
          }}
        >
          {/* ── VISÃO DA SEMANA ── */}
          <SectionHeader title="Visão da semana" />
          <AppCard className="p-4 mb-2" style={{ marginBottom: 16 }}>
            <AvailableSlotsPreview slots={availableSlots} isLoading={false} />
            <View
              style={{
                height: 1,
                backgroundColor: colors.border,
                marginVertical: 14,
              }}
            />
            <AvailabilitySwitch
              label="Disponível para atendimentos"
              description={
                availability.isGenerallyAvailable
                  ? "Sua agenda está visível para os pacientes."
                  : "Sua agenda está temporariamente oculta."
              }
              value={availability.isGenerallyAvailable}
              onValueChange={toggleGeneralAvailability}
            />
          </AppCard>

          {/* ── HORÁRIOS SEMANAIS ── */}
          <SectionHeader title="Horários semanais" />
          <View style={{ marginBottom: 16 }}>
            {DAY_KEYS.map((dayKey) => (
              <AvailabilityDayCard
                key={dayKey}
                dayLabel={DAY_LABELS[dayKey]}
                day={availability.weeklySchedule[dayKey]}
                onToggle={() => handleToggleDay(dayKey)}
                onAddInterval={() => handleAddInterval(dayKey)}
                onRemoveInterval={(id) => handleRemoveInterval(dayKey, id)}
                onEditInterval={(id, field, value) =>
                  handleEditInterval(dayKey, id, field, value)
                }
              />
            ))}
          </View>

          {/* ── DURAÇÃO PADRÃO ── */}
          <SectionHeader title="Duração padrão" />
          <AppCard className="p-4" style={{ marginBottom: 16 }}>
            <AppText
              style={{
                fontSize: 13,
                color: colors.subtle,
                marginBottom: 12,
                lineHeight: 18,
              }}
            >
              Duração utilizada quando o tipo de consulta não especificar.
            </AppText>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {DURATION_OPTIONS.map((d) => (
                <DurationChip
                  key={d}
                  value={d}
                  selected={availability.defaultDurationMinutes === d}
                  onPress={() => updateDefaultDuration(d)}
                />
              ))}
            </View>
          </AppCard>

          {/* ── PAUSAS E INTERVALOS ── */}
          <SectionHeader title="Pausas e intervalos" />
          <AppCard className="p-4" style={{ marginBottom: 16 }}>
            <BreakConfigCard
              config={availability.breakConfig}
              onChange={updateBreakConfig}
            />
          </AppCard>

          {/* ── FORMATO DE ATENDIMENTO ── */}
          <SectionHeader title="Formato de atendimento" />
          <AppCard className="p-4" style={{ marginBottom: 16 }}>
            <FormatToggleGroup
              value={availability.formatConfig.formats}
              onChange={(formats) => updateFormatConfig({ formats })}
            />

            {hasPresencial && (
              <View style={{ marginTop: 16, gap: 10 }}>
                <AppText
                  style={{
                    fontSize: 13,
                    fontWeight: "600",
                    color: colors.content,
                  }}
                >
                  Endereço do consultório
                </AppText>
                <TextInput
                  value={availability.formatConfig.officeAddress ?? ""}
                  onChangeText={(t) =>
                    updateFormatConfig({ officeAddress: t })
                  }
                  placeholder="Rua, número, sala..."
                  placeholderTextColor={colors.subtle}
                  style={[inputStyle, { height: undefined, paddingVertical: 10 }]}
                />
                <AvailabilitySwitch
                  label="Ocultar endereço até confirmação"
                  description="O endereço só será exibido após a consulta ser confirmada."
                  value={availability.formatConfig.hideAddressUntilConfirmed}
                  onValueChange={(v) =>
                    updateFormatConfig({ hideAddressUntilConfirmed: v })
                  }
                />
              </View>
            )}

            {hasOnline && (
              <View style={{ marginTop: 16, gap: 10 }}>
                <AvailabilitySwitch
                  label="Gerar link automaticamente"
                  description="Um link de videochamada será criado para cada consulta online."
                  value={availability.formatConfig.autoGenerateLink}
                  onValueChange={(v) =>
                    updateFormatConfig({ autoGenerateLink: v })
                  }
                />
                {!availability.formatConfig.autoGenerateLink && (
                  <>
                    <AppText
                      style={{
                        fontSize: 13,
                        fontWeight: "600",
                        color: colors.content,
                      }}
                    >
                      Link padrão de videochamada
                    </AppText>
                    <TextInput
                      value={availability.formatConfig.defaultOnlineLink ?? ""}
                      onChangeText={(t) =>
                        updateFormatConfig({ defaultOnlineLink: t })
                      }
                      placeholder="https://meet.google.com/..."
                      placeholderTextColor={colors.subtle}
                      style={inputStyle}
                      autoCapitalize="none"
                    />
                  </>
                )}
              </View>
            )}
          </AppCard>

          {/* ── TIPOS DE CONSULTA ── */}
          <SectionHeader title="Tipos de consulta" />
          <View style={{ marginBottom: 16 }}>
            {availability.appointmentTypes.map((type) => (
              <AppointmentTypeConfigCard
                key={type.id}
                config={type}
                onChange={handleUpdateAppointmentType}
              />
            ))}
          </View>

          {/* ── REGRAS PARA PACIENTES ── */}
          <SectionHeader title="Regras para pacientes" />
          <AppCard className="p-4" style={{ marginBottom: 16 }}>
            <AppointmentRulesCard
              rules={availability.bookingRules}
              onChange={updateBookingRules}
            />
          </AppCard>

          {/* ── EXCEÇÕES E BLOQUEIOS ── */}
          <SectionHeader title="Exceções e bloqueios" />
          <View style={{ marginBottom: 16 }}>
            {availability.unavailablePeriods.length === 0 && !showAddPeriod ? (
              <View
                style={{
                  alignItems: "center",
                  paddingVertical: 20,
                  gap: 6,
                  backgroundColor: colors.surface,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: colors.border,
                  marginBottom: 10,
                }}
              >
                <Ionicons
                  name="calendar-clear-outline"
                  size={28}
                  color={colors.subtle}
                />
                <AppText style={{ fontSize: 13, color: colors.subtle }}>
                  Nenhum bloqueio cadastrado.
                </AppText>
              </View>
            ) : (
              availability.unavailablePeriods.map((period) => (
                <UnavailablePeriodCard
                  key={period.id}
                  period={period}
                  onRemove={() => removeUnavailablePeriod(period.id)}
                />
              ))
            )}

            {/* Add period form */}
            {showAddPeriod && (
              <View
                style={{
                  backgroundColor: colors.surface,
                  borderRadius: 14,
                  padding: 14,
                  borderWidth: 1,
                  borderColor: colors.secondary + "50",
                  gap: 12,
                  marginBottom: 10,
                }}
              >
                <AppText
                  style={{
                    fontSize: 14,
                    fontWeight: "700",
                    color: colors.content,
                  }}
                >
                  Novo bloqueio
                </AppText>

                {/* Dates */}
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <View style={{ flex: 1, gap: 4 }}>
                    <AppText style={{ fontSize: 12, color: colors.subtle }}>
                      Data início
                    </AppText>
                    <TextInput
                      value={periodStartDate}
                      onChangeText={(t) => setPeriodStartDate(applyDateMask(t))}
                      placeholder="DD/MM/AAAA"
                      placeholderTextColor={colors.subtle}
                      keyboardType="numeric"
                      maxLength={10}
                      style={inputStyle}
                    />
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <AppText style={{ fontSize: 12, color: colors.subtle }}>
                      Data fim
                    </AppText>
                    <TextInput
                      value={periodEndDate}
                      onChangeText={(t) => setPeriodEndDate(applyDateMask(t))}
                      placeholder="DD/MM/AAAA"
                      placeholderTextColor={colors.subtle}
                      keyboardType="numeric"
                      maxLength={10}
                      style={inputStyle}
                    />
                  </View>
                </View>

                {/* Times (optional) */}
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <View style={{ flex: 1, gap: 4 }}>
                    <AppText style={{ fontSize: 12, color: colors.subtle }}>
                      Hora início (opcional)
                    </AppText>
                    <TextInput
                      value={periodStartTime}
                      onChangeText={(t) =>
                        setPeriodStartTime(applyTimeMask(t))
                      }
                      placeholder="HH:MM"
                      placeholderTextColor={colors.subtle}
                      keyboardType="numeric"
                      maxLength={5}
                      style={inputStyle}
                    />
                  </View>
                  <View style={{ flex: 1, gap: 4 }}>
                    <AppText style={{ fontSize: 12, color: colors.subtle }}>
                      Hora fim (opcional)
                    </AppText>
                    <TextInput
                      value={periodEndTime}
                      onChangeText={(t) => setPeriodEndTime(applyTimeMask(t))}
                      placeholder="HH:MM"
                      placeholderTextColor={colors.subtle}
                      keyboardType="numeric"
                      maxLength={5}
                      style={inputStyle}
                    />
                  </View>
                </View>

                {/* Reason chips */}
                <View style={{ gap: 6 }}>
                  <AppText style={{ fontSize: 12, color: colors.subtle }}>
                    Motivo
                  </AppText>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    {REASON_OPTIONS.map((opt) => {
                      const sel = periodReason === opt.value;
                      return (
                        <TouchableOpacity
                          key={opt.value}
                          onPress={() => setPeriodReason(opt.value)}
                          activeOpacity={0.75}
                          style={{
                            paddingHorizontal: 12,
                            paddingVertical: 7,
                            borderRadius: 20,
                            backgroundColor: sel
                              ? colors.secondary
                              : colors.muted,
                            borderWidth: 1.5,
                            borderColor: sel ? colors.secondary : colors.border,
                          }}
                        >
                          <AppText
                            style={{
                              fontSize: 12,
                              fontWeight: "600",
                              color: sel ? "#fff" : colors.content,
                            }}
                          >
                            {opt.label}
                          </AppText>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Note */}
                <View style={{ gap: 4 }}>
                  <AppText style={{ fontSize: 12, color: colors.subtle }}>
                    Observação (opcional)
                  </AppText>
                  <TextInput
                    value={periodNote}
                    onChangeText={setPeriodNote}
                    placeholder="Ex: Congresso anual, viagem a trabalho..."
                    placeholderTextColor={colors.subtle}
                    style={[
                      inputStyle,
                      { height: undefined, paddingVertical: 10 },
                    ]}
                    multiline
                    numberOfLines={2}
                  />
                </View>

                {/* Form buttons */}
                <View style={{ flexDirection: "row", gap: 10, marginTop: 4 }}>
                  <TouchableOpacity
                    onPress={() => setShowAddPeriod(false)}
                    activeOpacity={0.75}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 12,
                      borderWidth: 1.5,
                      borderColor: colors.border,
                      alignItems: "center",
                    }}
                  >
                    <AppText
                      style={{
                        fontSize: 14,
                        fontWeight: "600",
                        color: colors.subtle,
                      }}
                    >
                      Cancelar
                    </AppText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleAddPeriod}
                    disabled={
                      isAddingPeriod || !periodStartDate || !periodEndDate
                    }
                    activeOpacity={0.8}
                    style={{
                      flex: 2,
                      paddingVertical: 12,
                      borderRadius: 12,
                      backgroundColor: colors.secondary,
                      alignItems: "center",
                      opacity:
                        isAddingPeriod || !periodStartDate || !periodEndDate
                          ? 0.6
                          : 1,
                    }}
                  >
                    {isAddingPeriod ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <AppText
                        style={{
                          fontSize: 14,
                          fontWeight: "700",
                          color: "#fff",
                        }}
                      >
                        Adicionar
                      </AppText>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Add period trigger button */}
            {!showAddPeriod && (
              <TouchableOpacity
                onPress={() => setShowAddPeriod(true)}
                activeOpacity={0.75}
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
                }}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={20}
                  color={colors.secondary}
                />
                <AppText
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: colors.secondary,
                  }}
                >
                  Adicionar bloqueio
                </AppText>
              </TouchableOpacity>
            )}
          </View>

          {/* ── AÇÕES ── */}
          <View style={{ gap: 12, marginTop: 8 }}>
            {/* Save button */}
            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaving}
              activeOpacity={0.85}
              style={{
                backgroundColor: colors.secondary,
                borderRadius: 16,
                paddingVertical: 17,
                alignItems: "center",
                shadowColor: colors.secondary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.28,
                shadowRadius: 10,
                elevation: 5,
                opacity: isSaving ? 0.7 : 1,
              }}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <AppText
                  style={{ fontSize: 16, fontWeight: "700", color: "#fff" }}
                >
                  Salvar disponibilidade
                </AppText>
              )}
            </TouchableOpacity>

            {/* Reset button */}
            <TouchableOpacity
              onPress={() => setShowResetConfirm(true)}
              disabled={isSaving}
              activeOpacity={0.75}
              style={{
                paddingVertical: 13,
                borderRadius: 16,
                borderWidth: 1.5,
                borderColor: colors.border,
                alignItems: "center",
              }}
            >
              <AppText
                style={{
                  fontSize: 14,
                  fontWeight: "600",
                  color: colors.subtle,
                }}
              >
                Restaurar padrão
              </AppText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Success modal */}
      <ConfirmActionModal
        visible={showSuccess}
        onConfirm={() => setShowSuccess(false)}
        onCancel={() => setShowSuccess(false)}
        icon="checkmark-circle-outline"
        iconColor="#6DBF7B"
        confirmColor="#6DBF7B"
        title="Salvo!"
        confirmLabel="Ok"
        cancelLabel={false}
        description="Disponibilidade atualizada com sucesso."
      />

      {/* Reset confirm modal */}
      <ConfirmActionModal
        visible={showResetConfirm}
        onConfirm={handleReset}
        onCancel={() => setShowResetConfirm(false)}
        icon="refresh-outline"
        iconColor={colors.error}
        confirmColor={colors.error}
        title="Restaurar padrão?"
        confirmLabel="Restaurar"
        cancelLabel="Cancelar"
        description="Todas as configurações de disponibilidade voltarão ao padrão inicial. Esta ação não pode ser desfeita."
      />
    </>
  );
}
