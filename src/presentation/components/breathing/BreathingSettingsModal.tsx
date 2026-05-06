import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { AppButton } from "../ui/AppButton";
import { BreathingPresetSelector } from "./BreathingPresetSelector";
import { BreathingPreset, BreathingSessionConfig } from "../../../core/types";
import { breathingService } from "../../../services/breathing/BreathingService";
import { useTheme } from "../../../core/theme";

interface BreathingSettingsModalProps {
  visible: boolean;
  config: BreathingSessionConfig;
  onClose: () => void;
  onApply: (config: BreathingSessionConfig) => void;
}

export function BreathingSettingsModal({
  visible,
  config,
  onClose,
  onApply,
}: BreathingSettingsModalProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(500)).current;

  const [draft, setDraft] = useState<BreathingSessionConfig>(config);

  useEffect(() => {
    if (visible) {
      setDraft(config);
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 20,
        stiffness: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 500,
        duration: 220,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const presets = breathingService.getPresets();
  const durations = breathingService.getSessionDurations();

  const handleApply = () => {
    onApply(draft);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.45)",
            justifyContent: "flex-end",
          }}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              style={{
                transform: [{ translateY: slideAnim }],
                backgroundColor: colors.surface,
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
                paddingBottom: insets.bottom + 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -6 },
                shadowOpacity: 0.15,
                shadowRadius: 20,
                elevation: 20,
              }}
            >
              {/* Handle */}
              <View className="items-center pt-3 pb-1">
                <View
                  className="w-10 h-1 rounded-full"
                  style={{ backgroundColor: colors.border }}
                />
              </View>

              {/* Header */}
              <View className="flex-row items-center justify-between px-5 py-3">
                <AppText variant="heading3" className="font-bold">
                  Configurações
                </AppText>
                <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                  <Ionicons name="close-circle-outline" size={26} color={colors.subtle} />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 24, paddingBottom: 8 }}
              >
                {/* Preset */}
                <View className="gap-3">
                  <AppText variant="label" color="muted" className="uppercase tracking-widest">
                    Modo de respiração
                  </AppText>
                  <BreathingPresetSelector
                    presets={presets}
                    selectedId={draft.preset.id}
                    onSelect={(p) => setDraft((d) => ({ ...d, preset: p }))}
                  />
                </View>

                {/* Duration */}
                <View className="gap-3">
                  <AppText variant="label" color="muted" className="uppercase tracking-widest">
                    Duração da sessão
                  </AppText>
                  <View className="flex-row gap-2">
                    {durations.map((min) => {
                      const selected = draft.durationMinutes === min;
                      return (
                        <TouchableOpacity
                          key={min}
                          onPress={() => setDraft((d) => ({ ...d, durationMinutes: min }))}
                          activeOpacity={0.75}
                          style={{
                            flex: 1,
                            paddingVertical: 10,
                            borderRadius: 12,
                            alignItems: "center",
                            borderWidth: 1.5,
                            borderColor: selected ? colors.secondary : colors.border,
                            backgroundColor: selected ? colors.secondary + "14" : "transparent",
                          }}
                        >
                          <AppText
                            variant="smallMedium"
                            color={selected ? "secondary" : "default"}
                            className={selected ? "font-bold" : ""}
                          >
                            {min} min
                          </AppText>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Toggles */}
                <View className="gap-0">
                  <View
                    className="flex-row items-center justify-between py-4"
                    style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}
                  >
                    <View className="flex-row items-center gap-3">
                      <View
                        className="w-8 h-8 rounded-xl items-center justify-center"
                        style={{ backgroundColor: colors.secondary + "18" }}
                      >
                        <Ionicons name="volume-medium-outline" size={16} color={colors.secondary} />
                      </View>
                      <View>
                        <AppText variant="bodyMedium" className="font-medium">Sons ambientes</AppText>
                        <AppText variant="caption" color="muted">Em breve</AppText>
                      </View>
                    </View>
                    <Switch
                      value={draft.soundEnabled}
                      onValueChange={(v) => setDraft((d) => ({ ...d, soundEnabled: v }))}
                      trackColor={{ false: colors.border, true: colors.secondary + "80" }}
                      thumbColor={draft.soundEnabled ? colors.secondary : colors.subtle}
                    />
                  </View>

                  <View className="flex-row items-center justify-between py-4">
                    <View className="flex-row items-center gap-3">
                      <View
                        className="w-8 h-8 rounded-xl items-center justify-center"
                        style={{ backgroundColor: colors.secondary + "18" }}
                      >
                        <Ionicons name="phone-portrait-outline" size={16} color={colors.secondary} />
                      </View>
                      <AppText variant="bodyMedium" className="font-medium">
                        Vibração suave
                      </AppText>
                    </View>
                    <Switch
                      value={draft.vibrationEnabled}
                      onValueChange={(v) => setDraft((d) => ({ ...d, vibrationEnabled: v }))}
                      trackColor={{ false: colors.border, true: colors.secondary + "80" }}
                      thumbColor={draft.vibrationEnabled ? colors.secondary : colors.subtle}
                    />
                  </View>
                </View>

                {/* Apply */}
                <AppButton label="Aplicar" onPress={handleApply} variant="primary" />
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
