import React from "react";
import { View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";

interface EmptyPaymentsStateProps {
  filter: string;
  userRole: "patient" | "professional";
}

interface EmptyConfig {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
}

function getConfig(
  filter: string,
  userRole: "patient" | "professional"
): EmptyConfig {
  switch (filter) {
    case "pending":
      return {
        icon: "checkmark-done-circle-outline",
        title: "Nenhuma cobrança pendente",
        subtitle: "Você está em dia com seus pagamentos.",
      };
    case "paid":
    case "received":
      return {
        icon: "receipt-outline",
        title: "Nenhum pagamento encontrado",
        subtitle: "Os pagamentos concluídos aparecerão aqui.",
      };
    case "overdue":
      return {
        icon: "checkmark-circle-outline",
        title: "Nenhum pagamento atrasado",
        subtitle: "Ótimo! Tudo em dia.",
      };
    case "plans":
      return {
        icon: "star-outline",
        title: "Nenhum plano encontrado",
        subtitle: "Seu histórico de planos aparecerá aqui.",
      };
    case "appointments":
      return {
        icon: "calendar-outline",
        title: "Nenhuma consulta encontrada",
        subtitle: "Pagamentos de consultas aparecerão aqui.",
      };
    case "extra_charges":
      return {
        icon: "cash-outline",
        title: "Nenhuma cobrança extra",
        subtitle: "Cobranças extras aparecerão aqui.",
      };
    case "payouts":
      return {
        icon: "arrow-up-circle-outline",
        title: "Nenhum repasse encontrado",
        subtitle: "Seus repasses aparecerão aqui.",
      };
    case "this_month":
      return {
        icon: "calendar-number-outline",
        title: "Nenhuma transação este mês",
        subtitle: "As transações deste mês aparecerão aqui.",
      };
    default:
      return {
        icon: "wallet-outline",
        title: "Nenhuma transação encontrada",
        subtitle: "Tente ajustar os filtros.",
      };
  }
}

export function EmptyPaymentsState({ filter, userRole }: EmptyPaymentsStateProps) {
  const { colors } = useTheme();
  const config = getConfig(filter, userRole);

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 40,
        paddingHorizontal: 24,
      }}
    >
      <View
        style={{
          width: 64,
          height: 64,
          borderRadius: 32,
          backgroundColor: colors.secondary + "1A",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <Ionicons name={config.icon} size={30} color={colors.secondary} />
      </View>
      <AppText
        style={{
          fontSize: 16,
          fontWeight: "700",
          color: colors.content,
          textAlign: "center",
          marginBottom: 6,
        }}
      >
        {config.title}
      </AppText>
      <AppText
        style={{
          fontSize: 13,
          color: colors.subtle,
          textAlign: "center",
        }}
      >
        {config.subtitle}
      </AppText>
    </View>
  );
}
