import React, { useRef, useEffect, useState, useCallback } from "react";
import { Animated, View, StyleSheet, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "./AppText";

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useErrorToast() {
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showError = useCallback((message: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setError(message);
    timerRef.current = setTimeout(() => setError(null), 3000);
  }, []);

  const clearError = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { error, showError, clearError };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ErrorToastProps {
  message: string | null;
}

export function ErrorToast({ message }: ErrorToastProps) {
  const translateY = useRef(new Animated.Value(-80)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  // Keeps the last non-null message visible during the hide animation
  const displayMessage = useRef(message ?? "");
  if (message) displayMessage.current = message;

  useEffect(() => {
    if (message) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 320,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -80,
          duration: 260,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [message]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        { transform: [{ translateY }], opacity },
      ]}
    >
      <View style={styles.toast}>
        <Ionicons name="alert-circle" size={18} color="#fff" />
        <AppText
          variant="small"
          style={styles.text}
        >
          {displayMessage.current}
        </AppText>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    zIndex: 9999,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#DC2626",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  text: {
    color: "#fff",
    flex: 1,
    lineHeight: 18,
    fontWeight: "500",
  },
});
