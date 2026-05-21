import React from "react";
import { ScrollView, KeyboardAvoidingView, ViewStyle, ScrollViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface KeyboardSafeScrollViewProps extends Omit<ScrollViewProps, "style" | "contentContainerStyle"> {
  children: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  extraBottomPadding?: number;
}

/**
 * Drop-in ScrollView replacement that handles keyboard avoidance and
 * safe-area bottom inset automatically. Uses behavior="padding" so it
 * works with edgeToEdgeEnabled: true on Android New Architecture.
 */
export function KeyboardSafeScrollView({
  children,
  style,
  contentContainerStyle,
  extraBottomPadding = 0,
  ...rest
}: KeyboardSafeScrollViewProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView style={[{ flex: 1 }, style]} behavior="padding">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          { paddingBottom: insets.bottom + 24 + extraBottomPadding },
          contentContainerStyle,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        {...rest}
      >
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
