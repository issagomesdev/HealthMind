import React, { useEffect } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppHeader } from "../../components/ui/AppHeader";
import { AppText } from "../../components/ui/AppText";
import { ProfessionalCard } from "../../components/professionals/ProfessionalCard";
import { useProfessionalMatchController } from "../../controllers/useProfessionalMatchController";
import { Symptom, Professional } from "../../../core/types";
import { useTheme } from "../../../core/theme";

interface ProfessionalListScreenProps {
  symptoms: Symptom[];
  smartMode: boolean;
  onBack: () => void;
  onSchedule: (professional: Professional) => void;
}

export function ProfessionalListScreen({
  symptoms,
  smartMode,
  onBack,
  onSchedule,
}: ProfessionalListScreenProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { professionals, loading, loadProfessionals } = useProfessionalMatchController();

  useEffect(() => {
    loadProfessionals();
  }, [loadProfessionals]);

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <AppHeader title="Profissionais" showBack onBackPress={onBack} />

      {loading ? (
        <View className="flex-1 items-center justify-center gap-3">
          <ActivityIndicator color={colors.secondary} size="large" />
          <AppText variant="small" color="muted">
            {smartMode ? "Analisando seus dados..." : "Buscando profissionais..."}
          </AppText>
        </View>
      ) : (
        <FlatList
          data={professionals}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: insets.bottom + 24,
            gap: 16,
          }}
          ListHeaderComponent={
            <View className="gap-1 pt-2 pb-2">
              <AppText variant="heading3" className="font-bold">
                Profissionais recomendados
              </AppText>
              <AppText variant="body" color="muted" className="leading-6">
                Selecionamos profissionais que podem combinar com suas necessidades atuais.
              </AppText>
              {smartMode && (
                <View className="flex-row items-center gap-1.5 mt-1 px-3 py-1.5 bg-secondary/10 dark:bg-secondary-dark/15 rounded-full self-start">
                  <AppText variant="caption" color="secondary" className="font-semibold">
                    ✨ Baseado na sua análise inteligente
                  </AppText>
                </View>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <ProfessionalCard
              professional={item}
              onSchedule={() => onSchedule(item)}
            />
          )}
        />
      )}
    </View>
  );
}
