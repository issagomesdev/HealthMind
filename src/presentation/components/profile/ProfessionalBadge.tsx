import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";

interface ProfessionalBadgeProps {
  specialty?: string | null;
  registerType?: string | null;
  registerNumber?: string | null;
  registerState?: string | null;
  verified?: boolean;
}

export function ProfessionalBadge({
  specialty,
  registerType,
  registerNumber,
  registerState,
  verified = true,
}: ProfessionalBadgeProps) {
  const { colors } = useTheme();

  const hasRegister = registerType && registerNumber;
  const registerLabel = hasRegister
    ? `${registerType} ${registerState ?? ""}/${registerNumber}`.trim()
    : null;

  return (
    <View style={{ alignItems: "center", gap: 6 }}>
      {specialty && (
        <AppText style={{ fontSize: 15, fontWeight: "600", color: colors.subtle }}>
          {specialty}
        </AppText>
      )}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        {verified && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              backgroundColor: colors.secondary + "18",
              borderRadius: 99,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderWidth: 1,
              borderColor: colors.secondary + "40",
            }}
          >
            <Ionicons name="shield-checkmark" size={13} color={colors.secondary} />
            <AppText style={{ fontSize: 12, fontWeight: "700", color: colors.secondary }}>
              Profissional verificado
            </AppText>
          </View>
        )}
        {registerLabel && (
          <View
            style={{
              backgroundColor: colors.muted,
              borderRadius: 99,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <AppText style={{ fontSize: 11, fontWeight: "600", color: colors.subtle }}>
              {registerLabel}
            </AppText>
          </View>
        )}
      </View>
    </View>
  );
}
