import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { AppText } from "../ui/AppText";
import { useTheme } from "../../../core/theme";

interface TypingIndicatorProps {
  name: string;
}

export function TypingIndicator({ name }: TypingIndicatorProps) {
  const { colors } = useTheme();
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev >= 3 ? 1 : prev + 1));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const dots = "•".repeat(dotCount);

  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingVertical: 6,
      }}
    >
      <AppText
        style={{
          fontSize: 12,
          color: colors.subtle,
          fontStyle: "italic",
        }}
      >
        {name} está digitando {dots}
      </AppText>
    </View>
  );
}
