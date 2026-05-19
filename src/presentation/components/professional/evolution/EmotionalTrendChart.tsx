import React from "react";
import { View, useWindowDimensions } from "react-native";
import Svg, { Polyline, Circle, Line, Text as SvgText, Rect } from "react-native-svg";
import { useTheme } from "../../../../core/theme";
import type { MoodDataPoint } from "../../../../types/evolution";

interface Props {
  data: MoodDataPoint[];
  height?: number;
  color?: string;
  showDots?: boolean;
  showGrid?: boolean;
  showLabels?: boolean;
}

export function EmotionalTrendChart({
  data,
  height = 160,
  color,
  showDots = true,
  showGrid = true,
  showLabels = true,
}: Props) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const lineColor = color ?? colors.secondary;

  if (!data || data.length < 2) {
    return <View style={{ height }} />;
  }

  const paddingLeft = 32;
  const paddingRight = 12;
  const paddingTop = 12;
  const paddingBottom = showLabels ? 36 : 12;

  const chartWidth = width - 40 - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const values = data.map((d) => d.value);
  const minVal = Math.max(0, Math.min(...values) - 0.5);
  const maxVal = Math.min(10, Math.max(...values) + 0.5);
  const range = maxVal - minVal || 1;

  const getX = (index: number) =>
    paddingLeft + (index / (data.length - 1)) * chartWidth;

  const getY = (value: number) =>
    paddingTop + chartHeight - ((value - minVal) / range) * chartHeight;

  // Build polyline points string
  const points = data
    .map((d, i) => `${getX(i).toFixed(1)},${getY(d.value).toFixed(1)}`)
    .join(" ");

  // Grid lines (3 horizontal)
  const gridLines = [0.25, 0.5, 0.75].map((ratio) => ({
    y: paddingTop + chartHeight * (1 - ratio),
    value: (minVal + range * ratio).toFixed(1),
  }));

  // Labels: show last 7 or every Nth
  const labelStep = data.length <= 7 ? 1 : Math.ceil(data.length / 7);
  const labelIndices: number[] = [];
  for (let i = 0; i < data.length; i += labelStep) {
    labelIndices.push(i);
  }
  // Always include the last one
  if (labelIndices[labelIndices.length - 1] !== data.length - 1) {
    labelIndices.push(data.length - 1);
  }

  const formatLabel = (d: MoodDataPoint) => {
    if (d.label) return d.label;
    // Date formatted as "DD/MM"
    const parts = d.date.split("-");
    if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
    return d.date;
  };

  const svgWidth = width - 40;

  return (
    <View
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: colors.surface }}
    >
      <Svg width={svgWidth} height={height}>
        {/* Background */}
        <Rect x={0} y={0} width={svgWidth} height={height} fill={colors.surface} />

        {/* Grid lines */}
        {showGrid &&
          gridLines.map((gl, i) => (
            <React.Fragment key={i}>
              <Line
                x1={paddingLeft}
                y1={gl.y}
                x2={paddingLeft + chartWidth}
                y2={gl.y}
                stroke={colors.border}
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <SvgText
                x={paddingLeft - 4}
                y={gl.y + 4}
                fontSize={9}
                fill={colors.subtle}
                textAnchor="end"
              >
                {gl.value}
              </SvgText>
            </React.Fragment>
          ))}

        {/* Polyline */}
        <Polyline
          points={points}
          fill="none"
          stroke={lineColor}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots */}
        {showDots &&
          data.map((d, i) => {
            const isHighlighted = i === data.length - 1;
            return (
              <Circle
                key={i}
                cx={getX(i)}
                cy={getY(d.value)}
                r={isHighlighted ? 5 : 3}
                fill={isHighlighted ? lineColor : colors.surface}
                stroke={lineColor}
                strokeWidth={isHighlighted ? 0 : 2}
              />
            );
          })}

        {/* X-axis labels */}
        {showLabels &&
          labelIndices.map((i) => (
            <SvgText
              key={i}
              x={getX(i)}
              y={height - 6}
              fontSize={9}
              fill={colors.subtle}
              textAnchor="middle"
            >
              {formatLabel(data[i])}
            </SvgText>
          ))}
      </Svg>
    </View>
  );
}
