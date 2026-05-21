import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { AppText } from "../../components/ui/AppText";
import { AppCard } from "../../components/ui/AppCard";
import { SectionHeader } from "../../components/dashboard/SectionHeader";
import { GreetingHeader } from "../../components/dashboard/GreetingHeader";
import { StatsCard } from "../../components/dashboard/StatsCard";
import { AlertCard } from "../../components/dashboard/AlertCard";
import { WeeklyChart } from "../../components/dashboard/WeeklyChart";
import { InsightCard } from "../../components/dashboard/InsightCard";
import { PatientSelectModal } from "../../components/professional/patients/PatientSelectModal";
import { ProfessionalDashboardData, EmotionalAlert, User } from "../../../core/types";
import { ProfessionalPatient } from "../../../types/patient";
import { useTheme } from "../../../core/theme";
import { useNavigationContext } from "../../context/NavigationContext";
import { TopBar } from "../../components/navigation/TopBar";
import { ROUTES } from "../../../core/constants/routes";

interface ProfessionalDashboardProps {
  user: User;
  data: ProfessionalDashboardData;
  onNavigateToSettings?: () => void;
}

const QUICK_ACTIONS = [
  { label: "Novo Paciente", icon: "person-add-outline" as const },
  { label: "Anotações rápidas", icon: "document-text-outline" as const },
];

export function ProfessionalDashboard({
  user,
  data,
}: ProfessionalDashboardProps) {
  const { colors } = useTheme();
  const { openMenu } = useNavigationContext();
  const router = useRouter();
  const [showPatientModal, setShowPatientModal] = useState(false);

  const handleQuickAction = (label: string) => {
    switch (label) {
      case "Novo Paciente":
        router.push(ROUTES.ADD_PATIENT);
        break;
      case "Anotações rápidas":
        setShowPatientModal(true);
        break;
    }
  };

  const handleAlertAction = (alert: EmotionalAlert) => {
    if (alert.severity === "medium") {
      router.push({ pathname: ROUTES.PATIENT_CHAT, params: { id: alert.patientId } });
    } else {
      router.push({ pathname: ROUTES.PATIENT_DETAILS, params: { id: alert.patientId } });
    }
  };

  const handleSelectPatient = (patient: ProfessionalPatient) => {
    setShowPatientModal(false);
    router.push({
      pathname: ROUTES.ADD_PATIENT_OBSERVATION,
      params: { patientId: patient.id, patientName: patient.name },
    });
  };

  return (
    <ScreenContainer scrollable safeArea edges={["bottom"]}>
      <TopBar title="HealthMind" onMenuPress={openMenu} />

      <View className="px-5 gap-5 pb-6">
        <GreetingHeader
          greeting={`Olá, ${user.name.split(" ")[0]}`}
          subtitle="Aqui está um resumo do seu dia."
          variant="professional"
        />

        {/* Stats cards */}
        <View className="gap-3">
          <StatsCard
            icon="people-outline"
            label="Pacientes Ativos"
            value={data.activePatients}
            subtitle={data.activePatientsChange}
            variant="default"
          />
          <StatsCard
            icon="calendar-outline"
            label="Próximas Consultas"
            value={data.nextAppointmentsCount}
            subtitle={data.nextAppointmentsTime}
            variant="highlighted"
          />
        </View>

        {/* Quick actions */}
        <AppCard className="gap-0 p-0 overflow-hidden">
          {QUICK_ACTIONS.map((action, index) => (
            <React.Fragment key={action.label}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => handleQuickAction(action.label)}
                className="flex-row items-center gap-3 px-5 py-4"
              >
                <View className="w-8 h-8 rounded-full bg-secondary/10 dark:bg-secondary-dark/20 items-center justify-center">
                  <Ionicons name={action.icon} size={17} color={colors.secondary} />
                </View>
                <AppText variant="bodyMedium" className="font-medium">
                  {action.label}
                </AppText>
                <View className="flex-1" />
                <Ionicons name="chevron-forward" size={16} color={colors.subtle} />
              </TouchableOpacity>
              {index < QUICK_ACTIONS.length - 1 && (
                <View className="h-px bg-border dark:bg-border-dark mx-5" />
              )}
            </React.Fragment>
          ))}
        </AppCard>

        {/* Emotional alerts */}
        <View className="gap-3">
          <SectionHeader
            title="Alertas Emocionais"
            actionLabel="Ver todos"
            onAction={() => router.push(ROUTES.PATIENTS)}
          />
          <View className="gap-2.5">
            {data.emotionalAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onAction={() => handleAlertAction(alert)}
              />
            ))}
          </View>
        </View>

        {/* Weekly metrics */}
        <View className="gap-3">
          <SectionHeader title="Métricas da Semana" />
          <WeeklyChart data={data.weeklyMetrics} maxBarHeight={110} />
        </View>

        {/* Professional insight */}
        <InsightCard
          title="Professional Insight"
          body={data.professionalInsight}
          variant="professional"
        />
      </View>

      <PatientSelectModal
        visible={showPatientModal}
        onClose={() => setShowPatientModal(false)}
        onSelectPatient={handleSelectPatient}
      />
    </ScreenContainer>
  );
}
