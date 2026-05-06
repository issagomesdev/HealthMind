import React, { useState } from "react";
import { useRouter } from "expo-router";
import { ProfessionalMatchIntroScreen } from "../../src/presentation/screens/professionals/ProfessionalMatchIntroScreen";
import { ProfessionalListScreen } from "../../src/presentation/screens/professionals/ProfessionalListScreen";
import { ProfessionalScheduleScreen } from "../../src/presentation/screens/professionals/ProfessionalScheduleScreen";
import { Symptom, Professional } from "../../src/core/types";

type Step = "intro" | "list" | "schedule";

interface ListParams {
  symptoms: Symptom[];
  smart: boolean;
}

export default function FindProfessionalPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("intro");
  const [listParams, setListParams] = useState<ListParams>({ symptoms: [], smart: false });
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);

  if (step === "intro") {
    return (
      <ProfessionalMatchIntroScreen
        onBack={() => router.back()}
        onContinue={(params) => {
          setListParams(params);
          setStep("list");
        }}
      />
    );
  }

  if (step === "list") {
    return (
      <ProfessionalListScreen
        symptoms={listParams.symptoms}
        smartMode={listParams.smart}
        onBack={() => setStep("intro")}
        onSchedule={(professional) => {
          setSelectedProfessional(professional);
          setStep("schedule");
        }}
      />
    );
  }

  if (step === "schedule" && selectedProfessional) {
    return (
      <ProfessionalScheduleScreen
        professional={selectedProfessional}
        onBack={() => setStep("list")}
        onConfirmed={() => router.replace("/(protected)/(tabs)/home")}
      />
    );
  }

  return null;
}
