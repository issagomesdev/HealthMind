import React from "react";
import { View, ScrollView, KeyboardAvoidingView, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface FormScreenContainerProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  scrollContentStyle?: ViewStyle;
  style?: ViewStyle;
}

/**
 * Canonical layout for screens with scroll content + fixed bottom buttons.
 * KAV(padding) → ScrollView → content / footer stays outside scroll, above gesture bar.
 */
export function FormScreenContainer({
  children,
  footer,
  scrollContentStyle,
  style,
}: FormScreenContainerProps) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView style={[{ flex: 1 }, style]} behavior="padding">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          { paddingBottom: footer ? 8 : insets.bottom + 24 },
          scrollContentStyle,
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>

      {footer && (
        <View style={{ paddingBottom: insets.bottom + 8 }}>
          {footer}
        </View>
      )}
    </KeyboardAvoidingView>
  );
}
