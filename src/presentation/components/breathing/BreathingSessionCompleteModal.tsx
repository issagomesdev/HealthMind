import React, { useEffect, useRef } from "react";
import {
  View,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { AppButton } from "../ui/AppButton";
import { useTheme } from "../../../core/theme";

interface BreathingSessionCompleteModalProps {
  visible: boolean;
  onDone: () => void;
  onRepeat: () => void;
}

export function BreathingSessionCompleteModal({
  visible,
  onDone,
  onRepeat,
}: BreathingSessionCompleteModalProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          damping: 18,
          stiffness: 220,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.85);
      fadeAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onDone}
    >
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 28,
          opacity: fadeAnim,
        }}
      >
        <Animated.View
          style={{
            width: "100%",
            backgroundColor: colors.surface,
            borderRadius: 28,
            padding: 28,
            alignItems: "center",
            gap: 20,
            transform: [{ scale: scaleAnim }],
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 16 },
            shadowOpacity: 0.2,
            shadowRadius: 32,
            elevation: 24,
          }}
        >
          {/* Icon */}
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.secondary + "18",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="leaf-outline" size={36} color={colors.secondary} />
          </View>

          {/* Text */}
          <View style={{ alignItems: "center", gap: 10 }}>
            <AppText variant="heading3" className="font-bold text-center">
              Você conseguiu desacelerar.
            </AppText>
            <AppText variant="body" color="muted" className="text-center leading-7">
              Respire fundo.{"\n"}Pequenas pausas também são autocuidado.
            </AppText>
          </View>

          {/* Stats row */}
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              width: "100%",
              padding: 16,
              borderRadius: 16,
              backgroundColor: colors.secondary + "0e",
            }}
          >
            <View style={{ flex: 1, alignItems: "center", gap: 3 }}>
              <Ionicons name="time-outline" size={20} color={colors.secondary} />
              <AppText variant="caption" color="secondary" className="font-bold">
                Sessão concluída
              </AppText>
            </View>
            <View style={{ width: 1, backgroundColor: colors.border }} />
            <View style={{ flex: 1, alignItems: "center", gap: 3 }}>
              <Ionicons name="heart-outline" size={20} color={colors.secondary} />
              <AppText variant="caption" color="secondary" className="font-bold">
                Bem-estar +
              </AppText>
            </View>
          </View>

          {/* Buttons */}
          <View style={{ width: "100%", gap: 10 }}>
            <AppButton label="Fazer novamente" onPress={onRepeat} variant="primary" />
            <AppButton label="Finalizar" onPress={onDone} variant="outline" />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
