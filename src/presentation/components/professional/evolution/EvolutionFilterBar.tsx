import React from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../ui/AppText";
import { useTheme } from "../../../../core/theme";
import type { PeriodFilter, SortFilter, RiskFilter } from "../../../../types/evolution";

const PERIOD_LABELS: Record<PeriodFilter, string> = {
  "7d": "7D",
  "30d": "30D",
  "3m": "3M",
  "6m": "6M",
  "1y": "1A",
};

const SORT_LABELS: Record<SortFilter, string> = {
  most_active: "Mais ativos",
  in_alert: "Em alerta",
  best_evolution: "Melhor evolução",
  least_engagement: "Menor engajamento",
};

const RISK_LABELS: Record<RiskFilter, string> = {
  all: "Todos",
  stable: "Estável",
  attention: "Atenção",
  high_risk: "Risco Alto",
  critical: "Crítico",
};

interface Props {
  period?: PeriodFilter;
  onPeriodChange?: (p: PeriodFilter) => void;
  sort?: SortFilter;
  onSortChange?: (s: SortFilter) => void;
  risk?: RiskFilter;
  onRiskChange?: (r: RiskFilter) => void;
  showSort?: boolean;
  showRisk?: boolean;
}

export function EvolutionFilterBar({
  period,
  onPeriodChange,
  sort,
  onSortChange,
  risk,
  onRiskChange,
  showSort = false,
  showRisk = false,
}: Props) {
  const { colors } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 8, gap: 8 }}
    >
      {/* Period chips */}
      {onPeriodChange &&
        (Object.keys(PERIOD_LABELS) as PeriodFilter[]).map((p) => {
          const active = period === p;
          return (
            <TouchableOpacity
              key={p}
              onPress={() => onPeriodChange(p)}
              className="rounded-full px-4 py-1.5"
              style={{
                backgroundColor: active ? colors.secondary : "transparent",
                borderWidth: 1.5,
                borderColor: active ? colors.secondary : colors.border,
              }}
            >
              <AppText
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: active ? "#fff" : colors.subtle,
                }}
              >
                {PERIOD_LABELS[p]}
              </AppText>
            </TouchableOpacity>
          );
        })}

      {/* Sort tag */}
      {showSort && sort && sort !== "in_alert" && onSortChange ? (
        <TouchableOpacity
          onPress={() => onSortChange("in_alert")}
          className="flex-row items-center rounded-full px-3 py-1.5"
          style={{ backgroundColor: colors.secondary + "22", gap: 4 }}
        >
          <AppText style={{ fontSize: 12, fontWeight: "700", color: colors.secondary }}>
            {SORT_LABELS[sort]}
          </AppText>
          <Ionicons name="close-circle" size={14} color={colors.secondary} />
        </TouchableOpacity>
      ) : null}

      {/* Risk tag */}
      {showRisk && risk && risk !== "all" && onRiskChange ? (
        <TouchableOpacity
          onPress={() => onRiskChange("all")}
          className="flex-row items-center rounded-full px-3 py-1.5"
          style={{ backgroundColor: colors.accent + "22", gap: 4 }}
        >
          <AppText style={{ fontSize: 12, fontWeight: "700", color: colors.accent }}>
            {RISK_LABELS[risk]}
          </AppText>
          <Ionicons name="close-circle" size={14} color={colors.accent} />
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
}
