import React, { useRef } from "react";
import {
  View,
  GestureResponderEvent,
  LayoutChangeEvent,
} from "react-native";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";

interface StressSliderProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}

export function StressSlider({
  value,
  min = 0,
  max = 10,
  onChange,
}: StressSliderProps) {
  const { colors } = useTheme();
  const trackWidthRef = useRef(1);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const fillPercent = ((value - min) / (max - min)) * 100;
  const thumbLeft = `${fillPercent}%`;

  const handleLayout = (e: LayoutChangeEvent) => {
    trackWidthRef.current = e.nativeEvent.layout.width;
  };

  const computeValue = (x: number): number => {
    const w = trackWidthRef.current;
    const raw = (Math.max(0, Math.min(x, w)) / w) * (max - min) + min;
    return Math.round(raw);
  };

  const handleTouch = (e: GestureResponderEvent) => {
    onChangeRef.current(computeValue(e.nativeEvent.locationX));
  };

  return (
    <View className="gap-3">
      {/* Track + thumb */}
      <View
        className="h-12 justify-center"
        onLayout={handleLayout}
        onStartShouldSetResponder={() => true}
        onMoveShouldSetResponder={() => true}
        onResponderGrant={handleTouch}
        onResponderMove={handleTouch}
      >
        {/* Track background */}
        <View className="h-2 rounded-full bg-muted dark:bg-muted-dark overflow-hidden">
          {/* Fill */}
          <View
            className="h-full rounded-full bg-secondary dark:bg-secondary-dark"
            style={{ width: `${fillPercent}%` }}
          />
        </View>

        {/* Thumb */}
        <View
          className="absolute w-6 h-6 rounded-full bg-secondary dark:bg-secondary-dark border-2 border-white"
          style={{
            left: `${fillPercent}%`,
            marginLeft: -12,
            top: "50%",
            marginTop: -12,
            shadowColor: colors.secondary,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.4,
            shadowRadius: 5,
            elevation: 5,
          }}
        />
      </View>

      {/* Labels row */}
      <View className="flex-row justify-between">
        <AppText variant="caption" color="muted">
          0 (Calmo)
        </AppText>
        <AppText variant="caption" color="muted">
          10 (Alto)
        </AppText>
      </View>

      {/* Current value */}
      <AppText
        variant="bodyMedium"
        color="secondary"
        className="font-bold text-center"
      >
        Nível {value}
      </AppText>
    </View>
  );
}
