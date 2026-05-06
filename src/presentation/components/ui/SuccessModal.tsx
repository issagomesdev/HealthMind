import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "./AppText";
import { AppButton } from "./AppButton";

type FeedbackType = "success" | "error" | "warning" | "info";

const TYPE_CONFIG: Record<
  FeedbackType,
  {
    icon: keyof typeof Ionicons.glyphMap;
    colors: [string, string];
  }
> = {
  success: { icon: "checkmark",       colors: ["#2A9D8F", "#4C78D9"] },
  error:   { icon: "close",           colors: ["#EF4444", "#DC2626"] },
  warning: { icon: "warning-outline", colors: ["#F59E0B", "#D97706"] },
  info:    { icon: "information",     colors: ["#4C78D9", "#6366F1"] },
};

interface FeedbackModalProps {
  visible: boolean;
  type?: FeedbackType;
  title?: string;
  message?: string;
  actionLabel?: string;
  /** Optional second action (e.g. "Cancel") */
  secondaryLabel?: string;
  onClose: () => void;
  onSecondary?: () => void;
}

export function SuccessModal({
  visible,
  type = "success",
  title = "Tudo certo!",
  message,
  actionLabel = "OK",
  secondaryLabel,
  onClose,
  onSecondary,
}: FeedbackModalProps) {
  const cfg = TYPE_CONFIG[type];
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim   = useRef(new Animated.Value(0.82)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 1, duration: 240, useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1, tension: 65, friction: 9, useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1, duration: 200, useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(backdropAnim, {
          toValue: 0, duration: 180, useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0, duration: 160, useNativeDriver: true,
        }),
      ]).start();
      scaleAnim.setValue(0.82);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          className="flex-1 items-center justify-center px-8"
          style={{ backgroundColor: "rgba(0,0,0,0.55)", opacity: backdropAnim }}
        >
          {/* Prevent tap-through on the card itself */}
          <TouchableWithoutFeedback>
            <Animated.View
              className="w-full bg-surface dark:bg-surface-dark rounded-3xl overflow-hidden"
              style={{
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.22,
                shadowRadius: 24,
                elevation: 20,
              }}
            >
              {/* Gradient header */}
              <LinearGradient
                colors={cfg.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="items-center pt-8 pb-7"
              >
                <View className="w-20 h-20 rounded-full bg-white/20 items-center justify-center">
                  <View className="w-[60px] h-[60px] rounded-full bg-white/30 items-center justify-center">
                    <Ionicons name={cfg.icon} size={36} color="#fff" />
                  </View>
                </View>
              </LinearGradient>

              {/* Text + actions */}
              <View className="px-7 pt-6 pb-7 gap-2 items-center">
                <AppText variant="heading3" className="font-bold text-center">
                  {title}
                </AppText>
                {message && (
                  <AppText
                    variant="body"
                    color="muted"
                    className="text-center leading-6 mt-0.5"
                  >
                    {message}
                  </AppText>
                )}

                <View className="w-full gap-2.5 mt-5">
                  <AppButton
                    label={actionLabel}
                    onPress={onClose}
                    variant="gradient"
                  />
                  {secondaryLabel && onSecondary && (
                    <AppButton
                      label={secondaryLabel}
                      onPress={onSecondary}
                      variant="outline"
                    />
                  )}
                </View>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
