import React, { useState, useEffect } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppHeader } from "../../components/ui/AppHeader";
import { AppText } from "../../components/ui/AppText";
import { AppCard } from "../../components/ui/AppCard";
import { FAQAccordion } from "../../components/profile/FAQAccordion";
import { useTheme } from "../../../core/theme";
import { professionalHelpService, HelpFaqItem, HelpSupport } from "../../../services/professionalHelpService";

interface ProfessionalHelpCenterScreenProps {
  onBack: () => void;
}

export function ProfessionalHelpCenterScreen({ onBack }: ProfessionalHelpCenterScreenProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [faq, setFaq] = useState<HelpFaqItem[]>([]);
  const [support, setSupport] = useState<HelpSupport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      professionalHelpService.getFaq(),
      professionalHelpService.getSupport(),
    ]).then(([f, s]) => {
      setFaq(f);
      setSupport(s);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        <AppHeader title="Central de ajuda" showBack onBackPress={onBack} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.secondary} />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <AppHeader title="Central de ajuda" showBack onBackPress={onBack} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <View className="px-5 pt-2 gap-5">
          <View className="items-center gap-3 py-4">
            <View
              className="w-16 h-16 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.secondary + "18" }}
            >
              <Ionicons name="help-buoy-outline" size={32} color={colors.secondary} />
            </View>
            <View className="items-center gap-1">
              <AppText variant="heading3" className="font-bold text-center">
                Como podemos ajudar você?
              </AppText>
              <AppText variant="body" color="muted" className="text-center leading-6">
                Perguntas frequentes para profissionais
              </AppText>
            </View>
          </View>

          <AppCard className="p-0">
            <FAQAccordion items={faq} />
          </AppCard>

          {support && (
            <AppCard className="gap-2 items-center">
              <Ionicons name="chatbubble-ellipses-outline" size={24} color={colors.secondary} />
              <AppText variant="bodyMedium" className="font-semibold text-center">
                {support.description}
              </AppText>
              <AppText variant="small" color="muted" className="text-center">
                Entre em contato com nosso suporte em{" "}
                <AppText variant="small" color="secondary" className="font-semibold">
                  {support.email}
                </AppText>
              </AppText>
            </AppCard>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
