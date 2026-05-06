import React from "react";
import { View, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppHeader } from "../../components/ui/AppHeader";
import { AppText } from "../../components/ui/AppText";
import { PremiumHeroBanner } from "../../components/profile/PremiumHeroBanner";
import { SubscriptionPlanCard } from "../../components/profile/SubscriptionPlanCard";

interface SubscriptionScreenProps {
  onBack: () => void;
}

const ESSENTIAL_FEATURES = [
  { label: "Diário de humor básico",             enabled: true  },
  { label: "Atividades de respiração (limitadas)",enabled: true  },
  { label: "Acesso à comunidade aberta",          enabled: true  },
  { label: "Conteúdo personalizado com IA",       enabled: false },
  { label: "Relatórios detalhados",               enabled: false },
];

const PREMIUM_FEATURES = [
  { label: "Conteúdo IA Personalizado",           enabled: true },
  { label: "Relatórios de humor detalhados",      enabled: true },
  { label: "Atividades exclusivas ilimitadas",    enabled: true },
  { label: "Consultas com desconto",              enabled: true },
  { label: "Suporte prioritário 24/7",            enabled: true },
];

export function SubscriptionScreen({ onBack }: SubscriptionScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <AppHeader title="Plano atual" showBack onBackPress={onBack} />

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <View className="px-5 pt-2 gap-5">
          {/* Hero */}
          <PremiumHeroBanner />

          {/* Essencial */}
          <SubscriptionPlanCard
            title="Essencial"
            price="R$ 0"
            priceSubtext="O ponto de partida para o seu bem-estar."
            features={ESSENTIAL_FEATURES}
            isCurrent
            buttonLabel="Seu Plano Atual"
            onPress={() => {}}
          />

          {/* Premium */}
          <SubscriptionPlanCard
            title="Premium"
            price="R$ 29,90"
            priceSubtext="Acesso total para uma mente mais clara."
            features={PREMIUM_FEATURES}
            isRecommended
            buttonLabel="Assinar Premium"
            onPress={() => {}}
          />

          {/* Footer */}
          <View className="flex-row items-center justify-center gap-2 pb-2">
            <Ionicons name="lock-closed-outline" size={14} color="#9CA3AF" />
            <AppText variant="small" color="muted" className="text-center flex-1">
              Pagamento seguro e criptografado. Cancele a qualquer momento.
            </AppText>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
