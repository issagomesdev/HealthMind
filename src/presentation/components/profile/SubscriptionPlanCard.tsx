import React from "react";
import { View } from "react-native";
import { AppText } from "../ui/AppText";
import { AppButton } from "../ui/AppButton";
import { FeatureListItem } from "./FeatureListItem";
import { useTheme } from "../../../core/theme";

interface PlanFeature {
  label: string;
  enabled: boolean;
}

interface SubscriptionPlanCardProps {
  title: string;
  price: string;
  priceSubtext: string;
  features: PlanFeature[];
  isCurrent?: boolean;
  isRecommended?: boolean;
  onPress: () => void;
  buttonLabel: string;
}

export function SubscriptionPlanCard({
  title,
  price,
  priceSubtext,
  features,
  isCurrent = false,
  isRecommended = false,
  onPress,
  buttonLabel,
}: SubscriptionPlanCardProps) {
  const { colors } = useTheme();

  return (
    <View
      className="rounded-3xl overflow-hidden"
      style={{
        borderWidth: isRecommended ? 2 : 1,
        borderColor: isRecommended ? colors.secondary : colors.border,
        backgroundColor: "transparent",
        shadowColor: isRecommended ? colors.secondary : "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: isRecommended ? 0.2 : 0.07,
        shadowRadius: 14,
        elevation: isRecommended ? 8 : 3,
      }}
    >
      {/* Recommended badge */}
      {isRecommended && (
        <View className="bg-secondary dark:bg-secondary-dark items-center py-1.5">
          <AppText variant="caption" className="font-bold tracking-widest text-white">
            RECOMENDADO
          </AppText>
        </View>
      )}

      <View className="bg-surface dark:bg-surface-dark p-6 gap-4">
        {/* Title row */}
        <View className="gap-1">
          <AppText variant="heading3" className="font-bold">
            {title}
          </AppText>
          <View className="flex-row items-baseline gap-1">
            <AppText
              variant="heading1"
              className="font-bold"
              style={{ fontSize: 32 }}
              color={isRecommended ? "secondary" : "default"}
            >
              {price}
            </AppText>
            <AppText variant="body" color="muted">
              /mês
            </AppText>
          </View>
          <AppText variant="small" color="muted">
            {priceSubtext}
          </AppText>
        </View>

        {/* Features */}
        <View className="gap-2.5">
          {features.map((f) => (
            <FeatureListItem
              key={f.label}
              label={f.label}
              enabled={f.enabled}
              premium={isRecommended}
            />
          ))}
        </View>

        {/* Button */}
        <View className="pt-1">
          {isRecommended ? (
            <AppButton label={buttonLabel} onPress={onPress} variant="gradient" />
          ) : (
            <AppButton label={buttonLabel} onPress={onPress} variant="outline" />
          )}
        </View>
      </View>
    </View>
  );
}
