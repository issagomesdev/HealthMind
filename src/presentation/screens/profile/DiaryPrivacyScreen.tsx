import React from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppHeader } from "../../components/ui/AppHeader";
import { AppText } from "../../components/ui/AppText";
import { AppCard } from "../../components/ui/AppCard";
import { PrivacyOptionSelector } from "../../components/profile/PrivacyOptionSelector";
import { usePrivacyController } from "../../controllers/usePrivacyController";
import { useTheme } from "../../../core/theme";

interface DiaryPrivacyScreenProps {
  onBack: () => void;
}

export function DiaryPrivacyScreen({ onBack }: DiaryPrivacyScreenProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { privacy, loading, saving, loadPrivacy, updatePrivacy } = usePrivacyController();

  useFocusEffect(
    React.useCallback(() => {
      loadPrivacy();
    }, [loadPrivacy])
  );

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <AppHeader title="Privacidade do diário" showBack onBackPress={onBack} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-5 pt-2 gap-5">
          <View className="gap-1">
            <AppText variant="body" color="muted" className="leading-6">
              Escolha quem poderá visualizar seus registros emocionais.
            </AppText>
          </View>

          {loading ? (
            <ActivityIndicator color={colors.secondary} />
          ) : (
            <PrivacyOptionSelector value={privacy} onChange={updatePrivacy} />
          )}

          {saving && (
            <AppText variant="small" color="muted" className="text-center">
              Salvando...
            </AppText>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
