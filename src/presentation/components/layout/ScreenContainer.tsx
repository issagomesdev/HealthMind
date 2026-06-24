import React from "react";
import {
  View,
  KeyboardAvoidingView,
  StatusBar,
  ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../core/theme";

interface ScreenContainerProps {
  children: React.ReactNode;
  className?: string;
  avoidKeyboard?: boolean;
  keyboardVerticalOffset?: number;
  safeArea?: boolean;
  edges?: Array<"top" | "bottom" | "left" | "right">;
  style?: ViewStyle;
}

export function ScreenContainer({
  children,
  className,
  avoidKeyboard = false,
  keyboardVerticalOffset = 0,
  safeArea = true,
  edges = ["bottom"],
  style,
}: ScreenContainerProps) {
  const { colors, isDark } = useTheme();

  const inner = (
    <View
      className={`flex-1 bg-background dark:bg-background-dark ${className ?? ""}`}
      style={style}
    >
      {children}
    </View>
  );

  const withKeyboard = avoidKeyboard ? (
    <KeyboardAvoidingView
      className="flex-1"
      behavior="padding"
      keyboardVerticalOffset={keyboardVerticalOffset}
    >
      {inner}
    </KeyboardAvoidingView>
  ) : (
    inner
  );

  if (safeArea) {
    return (
      <SafeAreaView
        edges={edges}
        className="flex-1 bg-background dark:bg-background-dark"
      >
        <StatusBar
          barStyle={isDark ? "light-content" : "dark-content"}
          backgroundColor={colors.background}
        />
        {withKeyboard}
      </SafeAreaView>
    );
  }

  return (
    <>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />
      {withKeyboard}
    </>
  );
}
