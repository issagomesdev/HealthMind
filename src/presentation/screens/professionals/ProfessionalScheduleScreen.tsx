import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppHeader } from "../../components/ui/AppHeader";
import { AppText } from "../../components/ui/AppText";
import { AppButton } from "../../components/ui/AppButton";
import { SuccessModal } from "../../components/ui/SuccessModal";
import { ProfessionalSummaryCard } from "../../components/professionals/ProfessionalSummaryCard";
import { AppointmentCalendar } from "../../components/professionals/AppointmentCalendar";
import { TimeSlotSelector } from "../../components/professionals/TimeSlotSelector";
import { useProfessionalScheduleController } from "../../controllers/useProfessionalScheduleController";
import { Professional } from "../../../core/types";

interface ProfessionalScheduleScreenProps {
  professional: Professional;
  onBack: () => void;
  onConfirmed: () => void;
}

export function ProfessionalScheduleScreen({
  professional,
  onBack,
  onConfirmed,
}: ProfessionalScheduleScreenProps) {
  const insets = useSafeAreaInsets();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    availableDates,
    availableTimes,
    selectedDate,
    selectedTime,
    loadingDates,
    loadingTimes,
    booking,
    canConfirm,
    loadDates,
    selectDate,
    selectTime,
    confirmAppointment,
  } = useProfessionalScheduleController(professional.id);

  useEffect(() => {
    loadDates();
  }, [loadDates]);

  const handleConfirm = async () => {
    await confirmAppointment();
    setShowSuccess(true);
  };

  return (
    <>
      <View className="flex-1 bg-background dark:bg-background-dark">
        <AppHeader title="Agendar consulta" showBack onBackPress={onBack} />

        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        >
          <View className="px-5 pt-2 gap-5">
            {/* Professional summary */}
            <ProfessionalSummaryCard professional={professional} />

            {/* Calendar */}
            <View className="gap-2">
              <AppText variant="bodyMedium" className="font-semibold">
                Escolha uma data disponível
              </AppText>
              <AppointmentCalendar
                availableDates={availableDates}
                selectedDate={selectedDate}
                onSelectDate={selectDate}
              />
            </View>

            {/* Time slots */}
            {selectedDate && (
              <View className="gap-3">
                <AppText variant="bodyMedium" className="font-semibold">
                  Horários disponíveis
                </AppText>
                <TimeSlotSelector
                  times={availableTimes}
                  selectedTime={selectedTime}
                  loading={loadingTimes}
                  onSelect={selectTime}
                />
              </View>
            )}

            {/* Confirm */}
            <AppButton
              label="Confirmar consulta"
              onPress={handleConfirm}
              variant="gradient"
              disabled={!canConfirm}
              loading={booking}
            />
          </View>
        </ScrollView>
      </View>

      <SuccessModal
        visible={showSuccess}
        type="success"
        title="Consulta agendada!"
        message={`Sua consulta com ${professional.name} foi agendada com sucesso.`}
        actionLabel="Ir para início"
        onClose={onConfirmed}
      />
    </>
  );
}
