import React from "react";
import { View, TouchableOpacity } from "react-native";
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop, Circle } from "react-native-svg";
import { AppText } from "../ui/AppText";
import { AppCard } from "../ui/AppCard";
import { WeeklyMetric } from "../../../core/types";
import { useTheme } from "../../../core/theme";

interface WeeklyMoodChartProps {
  data: WeeklyMetric[];
  onViewHistory?: () => void;
}

const CHART_HEIGHT = 80;
const CHART_WIDTH = 280;
const PADDING = 12;

function buildLinePath(data: WeeklyMetric[]): { linePath: string; areaPath: string } {
  if (data.length === 0) return { linePath: "", areaPath: "" };

  const maxVal = Math.max(...data.map((d) => d.value), 0.01);
  const step = (CHART_WIDTH - PADDING * 2) / (data.length - 1);

  const points = data.map((d, i) => ({
    x: PADDING + i * step,
    y: PADDING + (1 - d.value / maxVal) * (CHART_HEIGHT - PADDING * 2),
  }));

  // Build smooth bezier path
  let linePath = `M ${points[0].x} ${points[0].y}`;
  let areaPath = `M ${points[0].x} ${CHART_HEIGHT} L ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const cp1x = (points[i - 1].x + points[i].x) / 2;
    const cp1y = points[i - 1].y;
    const cp2x = (points[i - 1].x + points[i].x) / 2;
    const cp2y = points[i].y;
    linePath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i].x} ${points[i].y}`;
    areaPath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${points[i].x} ${points[i].y}`;
  }

  areaPath += ` L ${points[points.length - 1].x} ${CHART_HEIGHT} Z`;

  return { linePath, areaPath };
}

export function WeeklyMoodChart({ data, onViewHistory }: WeeklyMoodChartProps) {
  const { colors } = useTheme();
  const { linePath, areaPath } = buildLinePath(data);

  return (
    <AppCard className="gap-3">
      <View className="flex-row items-center justify-between">
        <AppText variant="bodyMedium" className="font-semibold">
          Humor Semanal
        </AppText>
        {onViewHistory && (
          <TouchableOpacity onPress={onViewHistory} activeOpacity={0.7}>
            <AppText variant="caption" color="secondary" className="font-semibold">
              Ver histórico ›
            </AppText>
          </TouchableOpacity>
        )}
      </View>

      <View className="items-center">
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          <Defs>
            <SvgGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0%" stopColor={colors.secondary} stopOpacity="0.25" />
              <Stop offset="100%" stopColor={colors.secondary} stopOpacity="0.02" />
            </SvgGradient>
          </Defs>

          {/* Area fill */}
          <Path d={areaPath} fill="url(#areaGrad)" />

          {/* Line */}
          <Path
            d={linePath}
            fill="none"
            stroke={colors.secondary}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dots */}
          {data.map((d, i) => {
            const step = (CHART_WIDTH - PADDING * 2) / (data.length - 1);
            const maxVal = Math.max(...data.map((m) => m.value), 0.01);
            const x = PADDING + i * step;
            const y = PADDING + (1 - d.value / maxVal) * (CHART_HEIGHT - PADDING * 2);
            return (
              <Circle
                key={i}
                cx={x}
                cy={y}
                r={4}
                fill="#fff"
                stroke={colors.secondary}
                strokeWidth={2}
              />
            );
          })}
        </Svg>
      </View>

      {/* Day labels */}
      <View className="flex-row justify-between px-2">
        {data.map((d) => (
          <AppText key={d.day} variant="caption" color="muted" className="text-center">
            {d.day}
          </AppText>
        ))}
      </View>
    </AppCard>
  );
}
