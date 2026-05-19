import React from "react";
import { View, useWindowDimensions } from "react-native";
import Svg, { Rect, Text as SvgText, Line } from "react-native-svg";
import { useTheme } from "../../../core/theme";

interface ActivityAdherenceChartProps {
  data: Array<{ week: string; completedPct: number }>;
  height?: number;
}

function getBarColor(pct: number): string {
  if (pct >= 80) return "#10B981";
  if (pct >= 60) return "#F59E0B";
  return "#EF4444";
}

export function ActivityAdherenceChart({ data, height = 140 }: ActivityAdherenceChartProps) {
  const { colors } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const chartWidth = screenWidth - 64;

  if (!data || data.length === 0) return null;

  const n = data.length;
  const labelAreaHeight = 28;
  const pctLabelHeight = 20;
  const paddingTop = pctLabelHeight + 4;
  const barAreaHeight = height - labelAreaHeight - paddingTop;
  const baseline = paddingTop + barAreaHeight;

  const barWidth = (chartWidth / n) * 0.6;
  const gap = (chartWidth / n) * 0.4;
  const slotWidth = chartWidth / n;

  return (
    <View>
      <Svg width={chartWidth} height={height + 4}>
        {/* Baseline */}
        <Line
          x1={0}
          y1={baseline}
          x2={chartWidth}
          y2={baseline}
          stroke={colors.border}
          strokeWidth={1}
        />

        {data.map((d, i) => {
          const proportion = d.completedPct / 100;
          const barH = Math.max(proportion * barAreaHeight, 4);
          const x = i * slotWidth + gap / 2;
          const y = baseline - barH;
          const barColor = getBarColor(d.completedPct);

          return (
            <React.Fragment key={i}>
              {/* Bar */}
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx={6}
                ry={6}
                fill={barColor}
              />
              {/* Percentage label above bar */}
              <SvgText
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                fontSize={10}
                fontWeight="700"
                fill={colors.content}
              >
                {d.completedPct}%
              </SvgText>
              {/* Week label below */}
              <SvgText
                x={x + barWidth / 2}
                y={baseline + 18}
                textAnchor="middle"
                fontSize={10}
                fill={colors.subtle}
              >
                {d.week}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}
