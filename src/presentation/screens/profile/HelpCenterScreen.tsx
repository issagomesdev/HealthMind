import React from "react";
import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppHeader } from "../../components/ui/AppHeader";
import { AppText } from "../../components/ui/AppText";
import { AppCard } from "../../components/ui/AppCard";
import { FAQAccordion } from "../../components/profile/FAQAccordion";
import { useTheme } from "../../../core/theme";

interface HelpCenterScreenProps {
  onBack: () => void;
}

const FAQ_ITEMS = [
  {
    title: "Como funciona o check-in emocional?",
    content:
      "O check-in emocional permite registrar diariamente como você está se sentindo, ajudando no acompanhamento da sua evolução emocional.",
  },
  {
    title: "Quem pode ver meu diário emocional?",
    content:
      "Você controla a privacidade do diário nas configurações. Pode permitir acesso apenas para você ou para profissionais autorizados.",
  },
  {
    title: "Como funcionam as atividades recomendadas?",
    content:
      "As atividades são sugeridas com base nos seus registros emocionais, hábitos e preferências dentro do app.",
  },
  {
    title: "Posso cancelar o plano Premium?",
    content:
      "Sim. Você pode cancelar sua assinatura a qualquer momento diretamente na área de planos.",
  },
  {
    title: "O app substitui acompanhamento psicológico?",
    content:
      "Não. O HealthMind é um suporte complementar e não substitui acompanhamento profissional.",
  },
];

export function HelpCenterScreen({ onBack }: HelpCenterScreenProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <AppHeader title="Central de ajuda" showBack onBackPress={onBack} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <View className="px-5 pt-2 gap-5">
          {/* Intro */}
          <View className="items-center gap-3 py-4">
            <View
              className="w-16 h-16 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.secondary + "18" }}
            >
              <Ionicons name="help-buoy-outline" size={32} color={colors.secondary} />
            </View>
            <View className="items-center gap-1">
              <AppText variant="heading3" className="font-bold text-center">
                Como podemos ajudar você hoje?
              </AppText>
              <AppText variant="body" color="muted" className="text-center leading-6">
                Perguntas frequentes sobre o HealthMind
              </AppText>
            </View>
          </View>

          {/* FAQ */}
          <AppCard className="p-0">
            <FAQAccordion items={FAQ_ITEMS} />
          </AppCard>

          {/* Contact */}
          <AppCard className="gap-2 items-center">
            <Ionicons name="chatbubble-ellipses-outline" size={24} color={colors.secondary} />
            <AppText variant="bodyMedium" className="font-semibold text-center">
              Ainda tem dúvidas?
            </AppText>
            <AppText variant="small" color="muted" className="text-center">
              Entre em contato com nosso suporte em{" "}
              <AppText variant="small" color="secondary" className="font-semibold">
                suporte@healthmind.com
              </AppText>
            </AppText>
          </AppCard>
        </View>
      </ScrollView>
    </View>
  );
}
