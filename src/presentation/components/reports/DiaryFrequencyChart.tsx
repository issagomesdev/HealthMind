import React from "react";
import { View, useWindowDimensions } from "react-native";
import Svg, { Rect, Text as SvgText, Line } from "react-native-svg";
import { useTheme } from "../../../core/theme";

interface DiaryFrequencyChartProps {
  data: Array<{ week: string; count: number }>;
  height?: number;
}

export function DiaryFrequencyChart({ data, height = 120 }: DiaryFrequencyChartProps) {
  const { colors } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const chartWidth = screenWidth - 64;

  if (!data || data.length === 0) return null;

  const maxCount = Math.max(...data.map((d) => d.count));
  const n = data.length;
  const labelAreaHeight = 28;
  const countLabelHeight = 20;
  const paddingTop = countLabelHeight + 4;
  const barAreaHeight = height - labelAreaHeight - paddingTop;
  const baseline = paddingTop + barAreaHeight;

  const barWidth = (chartWidth / n) * 0.6;
  const gap = (chartWidth / n) * 0.4;
  const slotWidth = chartWidth / n;

  return (
    <View>
      <Svg width={chartWidth} height={height + 4}>
        <Line
          x1={0}
          y1={baseline}
          x2={chartWidth}
          y2={baseline}
          stroke={colors.border}
          strokeWidth={1}
        />

        {data.map((d, i) => {
          const proportion = maxCount > 0 ? d.count / maxCount : 0;
          const barH = Math.max(proportion * barAreaHeight, 4);
          const x = i * slotWidth + gap / 2;
          const y = baseline - barH;

          return (
            <React.Fragment key={i}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barH}
                rx={6}
                ry={6}
                fill={colors.secondary + "99"}
              />
              <SvgText
                x={x + barWidth / 2}
                y={y - 5}
                textAnchor="middle"
                fontSize={10}
                fontWeight="600"
                fill={colors.content}
              >
                {d.count}
              </SvgText>
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
