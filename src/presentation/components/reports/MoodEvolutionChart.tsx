import React from "react";
import { View, useWindowDimensions } from "react-native";
import Svg, { Path, Polyline, Circle, Line, Text as SvgText, Rect } from "react-native-svg";
import { useTheme } from "../../../core/theme";
import type { MoodChartPoint } from "../../../types/reports";

interface MoodEvolutionChartProps {
  data: MoodChartPoint[];
  height?: number;
}

export function MoodEvolutionChart({ data, height = 160 }: MoodEvolutionChartProps) {
  const { colors } = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  if (!data || data.length < 2) {
    return <View style={{ height }} />;
  }

  const paddingLeft = 32;
  const paddingRight = 12;
  const paddingTop = 12;
  const paddingBottom = 36;

  const svgWidth = screenWidth - 64;
  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const values = data.map((d) => d.value);
  const minVal = Math.max(0, Math.min(...values) - 0.5);
  const maxVal = Math.min(10, Math.max(...values) + 0.5);
  const range = maxVal - minVal || 1;

  const getX = (index: number) =>
    paddingLeft + (index / (data.length - 1)) * chartWidth;

  const getY = (value: number) =>
    paddingTop + chartHeight - ((value - minVal) / range) * chartHeight;

  const baseline = paddingTop + chartHeight;

  // Polyline points
  const polylinePoints = data
    .map((d, i) => `${getX(i).toFixed(1)},${getY(d.value).toFixed(1)}`)
    .join(" ");

  // Area path: M x0,y0 L x1,y1 ... L xN,yN L xN,baseline L x0,baseline Z
  const firstX = getX(0).toFixed(1);
  const lastX = getX(data.length - 1).toFixed(1);
  const areaPath =
    `M ${firstX},${getY(data[0].value).toFixed(1)} ` +
    data
      .slice(1)
      .map((d, i) => `L ${getX(i + 1).toFixed(1)},${getY(d.value).toFixed(1)}`)
      .join(" ") +
    ` L ${lastX},${baseline} L ${firstX},${baseline} Z`;

  // Grid lines at 25%, 50%, 75%
  const gridLines = [0.25, 0.5, 0.75].map((ratio) => ({
    y: paddingTop + chartHeight * (1 - ratio),
    value: (minVal + range * ratio).toFixed(1),
  }));

  // Show last 7 labels
  const labelStep = data.length <= 7 ? 1 : Math.ceil(data.length / 7);
  const labelIndices: number[] = [];
  for (let i = 0; i < data.length; i += labelStep) {
    labelIndices.push(i);
  }
  if (labelIndices[labelIndices.length - 1] !== data.length - 1) {
    labelIndices.push(data.length - 1);
  }

  return (
    <View>
      <Svg width={svgWidth} height={height}>
        <Rect x={0} y={0} width={svgWidth} height={height} fill="transparent" />

        {/* Grid lines */}
        {gridLines.map((gl, i) => (
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

        {/* Area fill */}
        <Path d={areaPath} fill={colors.secondary} fillOpacity={0.12} />

        {/* Line */}
        <Polyline
          points={polylinePoints}
          fill="none"
          stroke={colors.secondary}
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dots */}
        {data.map((d, i) => {
          const isLast = i === data.length - 1;
          return (
            <Circle
              key={i}
              cx={getX(i)}
              cy={getY(d.value)}
              r={isLast ? 5 : 3}
              fill={isLast ? colors.secondary : colors.surface}
              stroke={colors.secondary}
              strokeWidth={isLast ? 0 : 2}
            />
          );
        })}

        {/* X-axis labels */}
        {labelIndices.map((i) => (
          <SvgText
            key={i}
            x={getX(i)}
            y={height - 6}
            fontSize={9}
            fill={colors.subtle}
            textAnchor="middle"
          >
            {data[i].date}
          </SvgText>
        ))}
      </Svg>
    </View>
  );
}
