import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";
import type { PaymentMethod } from "../../../types/payment";

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onSetDefault: () => void;
  onRemove: () => void;
  isDefault: boolean;
}

export function PaymentMethodCard({
  method,
  onSetDefault,
  onRemove,
  isDefault,
}: PaymentMethodCardProps) {
  const { colors } = useTheme();

  const iconName = (method.icon as keyof typeof Ionicons.glyphMap) ?? "card-outline";

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: isDefault ? 1.5 : 0,
        borderColor: isDefault ? colors.secondary : "transparent",
      }}
    >
      {/* Icon */}
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          backgroundColor: colors.secondary + "1A",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={iconName} size={20} color={colors.secondary} />
      </View>

      {/* Info */}
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <AppText
            style={{
              fontSize: 14,
              fontWeight: "600",
              color: colors.content,
            }}
          >
            {method.label}
          </AppText>
          {isDefault && (
            <View
              style={{
                backgroundColor: colors.secondary + "22",
                borderRadius: 999,
                paddingHorizontal: 7,
                paddingVertical: 2,
              }}
            >
              <AppText
                style={{
                  fontSize: 10,
                  fontWeight: "700",
                  color: colors.secondary,
                }}
              >
                Principal
              </AppText>
            </View>
          )}
        </View>
        {method.brand ? (
          <AppText style={{ fontSize: 12, color: colors.subtle }}>
            {method.brand}
          </AppText>
        ) : method.bankName ? (
          <AppText style={{ fontSize: 12, color: colors.subtle }}>
            {method.bankName}
          </AppText>
        ) : null}
      </View>

      {/* Actions */}
      <View style={{ flexDirection: "row", gap: 4 }}>
        {!isDefault && (
          <TouchableOpacity
            onPress={onSetDefault}
            activeOpacity={0.7}
            style={{
              padding: 6,
              borderRadius: 8,
              backgroundColor: colors.secondary + "15",
            }}
          >
            <Ionicons name="star-outline" size={16} color={colors.secondary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={onRemove}
          activeOpacity={0.7}
          style={{
            padding: 6,
            borderRadius: 8,
            backgroundColor: colors.error + "15",
          }}
        >
          <Ionicons name="trash-outline" size={16} color={colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
