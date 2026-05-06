import React from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppHeader } from "../../components/ui/AppHeader";
import { AppText } from "../../components/ui/AppText";
import { AppButton } from "../../components/ui/AppButton";
import { SymptomSelector } from "../../components/professionals/SymptomSelector";
import { SmartAnalysisCard } from "../../components/professionals/SmartAnalysisCard";
import { useProfessionalMatchController } from "../../controllers/useProfessionalMatchController";
import { Symptom } from "../../../core/types";

interface ProfessionalMatchIntroScreenProps {
  onBack: () => void;
  onContinue: (params: { symptoms: Symptom[]; smart: boolean }) => void;
}

export function ProfessionalMatchIntroScreen({
  onBack,
  onContinue,
}: ProfessionalMatchIntroScreenProps) {
  const insets = useSafeAreaInsets();
  const {
    selectedSymptoms,
    useSmartAnalysis,
    canContinue,
    toggleSymptom,
    toggleSmartAnalysis,
  } = useProfessionalMatchController();

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background dark:bg-background-dark"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <AppHeader title="Encontrar profissional" showBack onBackPress={onBack} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-2 gap-6">
          {/* Heading */}
          <View className="gap-2">
            <AppText variant="heading2" className="font-bold leading-tight">
              Encontre o profissional ideal para você
            </AppText>
            <AppText variant="body" color="muted" className="leading-6">
              Escolha os temas que deseja trabalhar ou permita que o HealthMind sugira
              profissionais com base na sua jornada emocional.
            </AppText>
          </View>

          {/* Smart analysis */}
          <SmartAnalysisCard active={useSmartAnalysis} onToggle={toggleSmartAnalysis} />

          {/* Separator */}
          <View className="flex-row items-center gap-3">
            <View className="flex-1 h-px bg-border dark:bg-border-dark" />
            <AppText variant="small" color="muted">ou selecione os temas</AppText>
            <View className="flex-1 h-px bg-border dark:bg-border-dark" />
          </View>

          {/* Symptom selector */}
          <View className="gap-3">
            <AppText variant="bodyMedium" className="font-semibold">
              O que você quer trabalhar?
              {selectedSymptoms.length > 0 && (
                <AppText variant="bodyMedium" color="secondary">
                  {" "}({selectedSymptoms.length} selecionados)
                </AppText>
              )}
            </AppText>
            <SymptomSelector selected={selectedSymptoms} onToggle={toggleSymptom} />
          </View>

          {/* Continue */}
          <AppButton
            label="Continuar"
            onPress={() => onContinue({ symptoms: selectedSymptoms, smart: useSmartAnalysis })}
            variant="gradient"
            disabled={!canContinue}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
