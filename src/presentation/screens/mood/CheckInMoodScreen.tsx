import React, { useState } from "react";
import { View, ScrollView, KeyboardAvoidingView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "../../components/ui/AppText";
import { AppCard } from "../../components/ui/AppCard";
import { AppButton } from "../../components/ui/AppButton";
import { AppHeader } from "../../components/ui/AppHeader";
import { SuccessModal } from "../../components/ui/SuccessModal";
import { MoodSelector } from "../../components/mood/MoodSelector";
import { StressSlider } from "../../components/forms/StressSlider";
import { AppTextArea } from "../../components/forms/AppTextArea";
import { useCheckInController } from "../../controllers/useCheckInController";
import { MoodType } from "../../../core/types";

interface CheckInMoodScreenProps {
  initialMood?: MoodType;
  onBack: () => void;
  onSaved: () => void;
}

export function CheckInMoodScreen({
  initialMood,
  onBack,
  onSaved,
}: CheckInMoodScreenProps) {
  const insets = useSafeAreaInsets();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    mood,
    stressLevel,
    description,
    loading,
    error,
    setMood,
    setStressLevel,
    setDescription,
    handleSubmit,
    handleCancel,
  } = useCheckInController({
    initialMood,
    onCancel: onBack,
    onSuccess: () => setShowSuccess(true),
  });

  return (
    <>
      <KeyboardAvoidingView
        className="flex-1 bg-background dark:bg-background-dark"
        behavior="padding"
      >
        <AppHeader title="HealthMind" showBack onBack={onBack} />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-5 pt-6 gap-6">
            {/* Main question */}
            <View className="gap-1.5">
              <AppText variant="heading2" className="font-bold leading-tight">
                Como você está se{"\n"}sentindo agora?
              </AppText>
              <AppText variant="body" color="muted">
                Seu check-in diário de bem-estar.
              </AppText>
            </View>

            {/* Mood selection */}
            <MoodSelector selected={mood} onChange={setMood} />

            {/* Validation error */}
            {error && (
              <AppText variant="small" color="error" className="text-center -mt-2">
                {error}
              </AppText>
            )}

            {/* Stress level */}
            <AppCard className="gap-4">
              <AppText variant="bodyMedium" className="font-semibold">
                Nível de Estresse
              </AppText>
              <StressSlider value={stressLevel} onChange={setStressLevel} />
            </AppCard>

            {/* Description */}
            <AppCard className="gap-3">
              <AppTextArea
                label="O que mais marcou seu dia?"
                placeholder="Escreva aqui seus pensamentos, sentimentos ou eventos importantes..."
                value={description}
                onChangeText={setDescription}
                maxLength={500}
              />
            </AppCard>

            {/* Actions */}
            <View className="gap-3 pt-1">
              <AppButton
                label="Salvar registro"
                onPress={handleSubmit}
                variant="primary"
                loading={loading}
              />
              <AppButton
                label="Cancelar"
                onPress={handleCancel}
                variant="outline"
                disabled={loading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={showSuccess}
        type="success"
        title="Registro salvo!"
        message="Seu check-in de hoje foi registrado com sucesso."
        actionLabel="Continuar"
        onClose={onSaved}
      />
    </>
  );
}
