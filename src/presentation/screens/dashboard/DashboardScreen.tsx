import React from "react";
import { View } from "react-native";
import { useFocusEffect } from "expo-router";
import { useDashboardController } from "../../controllers/useDashboardController";
import { PatientDashboard } from "./PatientDashboard";
import { ProfessionalDashboard } from "./ProfessionalDashboard";
import { LoadingState } from "../../components/ui/LoadingState";
import { EmptyState } from "../../components/ui/EmptyState";
import { useRefreshAuthenticatedUser } from "../../../hooks/useRefreshAuthenticatedUser";

interface DashboardScreenProps {
  onNavigateToSettings?: () => void;
}

export function DashboardScreen({ onNavigateToSettings }: DashboardScreenProps) {
  const { state, loading, error, user, reload, selectMood } =
    useDashboardController();

  const { refresh } = useRefreshAuthenticatedUser();
  useFocusEffect(React.useCallback(() => { refresh(); }, [refresh]));

  if (loading) {
    return <LoadingState message="Carregando dashboard..." fullScreen />;
  }

  if (error || !state || !user) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark items-center justify-center">
        <EmptyState
          title="Algo deu errado"
          description={error ?? "Não foi possível carregar o dashboard."}
          actionLabel="Tentar novamente"
          onAction={reload}
        />
      </View>
    );
  }

  if (state.role === "professional") {
    return (
      <ProfessionalDashboard
        user={user}
        data={state.data}
        onNavigateToSettings={onNavigateToSettings}
      />
    );
  }

  return (
    <PatientDashboard
      user={user}
      data={state.data}
      onSelectMood={selectMood}
      onNavigateToSettings={onNavigateToSettings}
    />
  );
}
