import React from "react";
import { View, useWindowDimensions } from "react-native";
import Svg, { Rect, Text as SvgText, Line } from "react-native-svg";
import { useTheme } from "../../../core/theme";

interface EarningsChartProps {
  data: Array<{ label: string; amount: number }>;
  height?: number;
}

export function EarningsChart({ data, height = 160 }: EarningsChartProps) {
  const { colors } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const chartWidth = screenWidth - 40;

  if (!data || data.length === 0) return null;

  const maxAmount = Math.max(...data.map((d) => d.amount));
  const n = data.length;

  const labelAreaHeight = 28;
  const amountLabelHeight = 18;
  const paddingTop = amountLabelHeight + 4;
  const barAreaHeight = height - labelAreaHeight - paddingTop;
  const baseline = paddingTop + barAreaHeight;

  const barWidth = (chartWidth / n) * 0.65;
  const gap = (chartWidth / n) * 0.35;
  const slotWidth = chartWidth / n;

  return (
    <View style={{ paddingHorizontal: 0 }}>
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
          const proportion = maxAmount > 0 ? d.amount / maxAmount : 0;
          const barH = Math.max(proportion * barAreaHeight, 4);
          const x = i * slotWidth + gap / 2;
          const y = baseline - barH;
          const isHighest = d.amount === maxAmount;
          const barColor = isHighest
            ? colors.secondary
            : colors.secondary + "CC";

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
              {/* Amount label above bar */}
              <SvgText
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                fontSize={10}
                fontWeight="600"
                fill={colors.subtle}
              >
                {d.amount >= 1000
                  ? `${(d.amount / 1000).toFixed(1)}k`
                  : String(d.amount)}
              </SvgText>
              {/* Week label below */}
              <SvgText
                x={x + barWidth / 2}
                y={baseline + 18}
                textAnchor="middle"
                fontSize={10}
                fill={colors.subtle}
              >
                {d.label}
              </SvgText>
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}
