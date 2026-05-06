import React, { useState } from "react";
import { View, Alert } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { AppText } from "../../components/ui/AppText";
import { SectionHeader } from "../../components/dashboard/SectionHeader";
import { GreetingHeader } from "../../components/dashboard/GreetingHeader";
import { MoodSelector } from "../../components/dashboard/MoodSelector";
import { ActivityCard } from "../../components/dashboard/ActivityCard";
import { AppointmentCard } from "../../components/dashboard/AppointmentCard";
import { WeeklyChart } from "../../components/dashboard/WeeklyChart";
import { ActionButton } from "../../components/dashboard/ActionButton";
import { AppointmentDetailsModal } from "../../components/appointments/AppointmentDetailsModal";
import { PatientDashboardData, MoodValue, MoodType, User } from "../../../core/types";
import { useNavigationContext } from "../../context/NavigationContext";
import { TopBar } from "../../components/navigation/TopBar";

interface PatientDashboardProps {
  user: User;
  data: PatientDashboardData;
  onSelectMood: (mood: MoodValue) => void;
  onNavigateToSettings?: () => void;
}

const MOOD_TO_TYPE: Record<MoodValue, MoodType> = {
  5: "OTIMO",
  4: "BEM",
  3: "NEUTRO",
  2: "RUIM",
  1: "PESSIMO",
};

export function PatientDashboard({
  user,
  data,
  onSelectMood,
  onNavigateToSettings,
}: PatientDashboardProps) {
  const { openMenu } = useNavigationContext();
  const router = useRouter();
  const firstName = user.name.split(" ")[0];

  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const handleMoodPress = (mood: MoodValue) => {
    onSelectMood(mood);
    router.push({
      pathname: "/(protected)/checkin",
      params: { initialMood: MOOD_TO_TYPE[mood] },
    });
  };

  const handleQuickAction = (label: string) => {
    switch (label) {
      case "Diário":
        router.push("/(protected)/(tabs)/diary");
        break;
      case "Humor":
        router.push("/(protected)/mood-insights");
        break;
      case "Respiração":
        router.push("/(protected)/breathing");
        break;
      case "Comunidade":
        router.push("/(protected)/(tabs)/community");
        break;
    }
  };

  const handleAppointmentCancel = () => {
    Alert.alert("HealthMind", "Consulta cancelada com sucesso.");
  };

  const handleAppointmentReschedule = () => {
    Alert.alert("HealthMind", "Solicitação de reagendamento enviada.");
  };

  const QUICK_ACTIONS = [
    { label: "Diário", icon: "book-outline" as const },
    { label: "Humor", icon: "happy-outline" as const },
    { label: "Respiração", icon: "leaf-outline" as const },
    { label: "Comunidade", icon: "chatbubbles-outline" as const },
  ];

  return (
    <ScreenContainer scrollable safeArea edges={["top", "bottom"]}>
      {/* Top bar */}
      <TopBar title="HealthMind" onMenuPress={openMenu} />

      {/* Content */}
      <View className="px-5 gap-5 pb-6">
        <GreetingHeader
          greeting={`Olá, como você\nestá hoje?`}
          subtitle="Bem-vindo de volta ao seu espaço de cuidado."
          variant="patient"
        />

        {/* Mood check-in */}
        <MoodSelector selected={data.selectedMood} onChange={handleMoodPress} />

        {/* Recommended activity → breathing */}
        <ActivityCard
          activity={data.recommendedActivity}
          onStart={() => router.push("/(protected)/breathing")}
        />

        {/* Next appointment */}
        {data.nextAppointment && (
          <View className="gap-3">
            <SectionHeader title="Próxima Consulta" />
            <AppointmentCard
              appointment={data.nextAppointment}
              onDetails={() => setShowDetailsModal(true)}
            />
          </View>
        )}

        {/* Quick actions grid */}
        <View className="gap-2.5">
          <View className="flex-row gap-2.5">
            {QUICK_ACTIONS.slice(0, 2).map((action) => (
              <ActionButton
                key={action.label}
                label={action.label}
                icon={action.icon}
                onPress={() => handleQuickAction(action.label)}
              />
            ))}
          </View>
          <View className="flex-row gap-2.5">
            {QUICK_ACTIONS.slice(2, 4).map((action) => (
              <ActionButton
                key={action.label}
                label={action.label}
                icon={action.icon}
                onPress={() => handleQuickAction(action.label)}
              />
            ))}
          </View>
        </View>

        {/* Weekly summary */}
        <View className="gap-3">
          <SectionHeader title="Resumo da semana" />
          <WeeklyChart
            data={data.weeklyMetrics}
            description={data.weeklyInsight}
            maxBarHeight={64}
          />
        </View>
      </View>

      {/* Appointment details modal */}
      <AppointmentDetailsModal
        visible={showDetailsModal}
        appointment={data.nextAppointment}
        onClose={() => setShowDetailsModal(false)}
        onCancel={handleAppointmentCancel}
        onReschedule={handleAppointmentReschedule}
      />
    </ScreenContainer>
  );
}
