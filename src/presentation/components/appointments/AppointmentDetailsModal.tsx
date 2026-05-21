import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../ui/AppText";
import { ConfirmActionModal } from "../ui/ConfirmActionModal";
import { SessionTopicsTags } from "./SessionTopicsTags";
import { AppointmentInfo } from "../../../core/types";
import { useTheme } from "../../../core/theme";

const DEFAULT_TOPICS = [
  "Ansiedade",
  "Estresse",
  "Sono",
  "Organização emocional",
  "Autoconhecimento",
];

interface AppointmentDetailsModalProps {
  visible: boolean;
  appointment: AppointmentInfo | null;
  onClose: () => void;
  onCancel: () => void;
  onReschedule: () => void;
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  const { colors } = useTheme();
  return (
    <View className="flex-row items-center gap-3">
      <View
        className="w-8 h-8 rounded-xl items-center justify-center"
        style={{ backgroundColor: colors.secondary + "16" }}
      >
        <Ionicons name={icon} size={15} color={colors.secondary} />
      </View>
      <View className="flex-1">
        <AppText variant="caption" color="muted">
          {label}
        </AppText>
        <AppText variant="smallMedium" className="font-medium">
          {value}
        </AppText>
      </View>
    </View>
  );
}

export function AppointmentDetailsModal({
  visible,
  appointment,
  onClose,
  onCancel,
  onReschedule,
}: AppointmentDetailsModalProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(600)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          damping: 22,
          stiffness: 220,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 600,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleCancel = () => setShowCancelConfirm(true);

  const handleReschedule = () => {
    onReschedule();
    onClose();
  };

  if (!appointment) return null;

  return (
    <>
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.45)",
            justifyContent: "flex-end",
            opacity: fadeAnim,
          }}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              style={{
                transform: [{ translateY: slideAnim }],
                backgroundColor: colors.surface,
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
                paddingBottom: insets.bottom + 20,
                maxHeight: "90%",
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
              <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
                <AppText variant="heading3" className="font-bold">
                  Detalhes da consulta
                </AppText>
                <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                  <Ionicons name="close-circle-outline" size={26} color={colors.subtle} />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 20, paddingBottom: 4 }}
              >
                {/* Professional avatar + name */}
                <View className="flex-row items-center gap-4">
                  <View
                    className="w-14 h-14 rounded-full items-center justify-center"
                    style={{ backgroundColor: colors.secondary + "20" }}
                  >
                    <Ionicons name="person" size={26} color={colors.secondary} />
                  </View>
                  <View className="flex-1">
                    <AppText variant="bodyMedium" className="font-bold">
                      {appointment.professionalName}
                    </AppText>
                    <AppText variant="small" color="muted">
                      {appointment.specialty}
                    </AppText>
                  </View>
                </View>

                {/* Details */}
                <View
                  className="rounded-2xl p-4 gap-3"
                  style={{ backgroundColor: colors.secondary + "08" }}
                >
                  <DetailRow icon="calendar-outline" label="Data" value={appointment.dateLabel} />
                  <View className="h-px" style={{ backgroundColor: colors.border }} />
                  <DetailRow icon="time-outline" label="Horário" value={appointment.time} />
                  <View className="h-px" style={{ backgroundColor: colors.border }} />
                  <DetailRow icon="hourglass-outline" label="Duração estimada" value="50 minutos" />
                  <View className="h-px" style={{ backgroundColor: colors.border }} />
                  <DetailRow icon="videocam-outline" label="Modalidade" value="Online" />
                </View>

                {/* Session topics */}
                <View className="gap-3">
                  <AppText variant="bodyMedium" className="font-semibold">
                    Temas da sessão
                  </AppText>
                  <SessionTopicsTags topics={DEFAULT_TOPICS} />
                </View>

                {/* Divider */}
                <View className="h-px" style={{ backgroundColor: colors.border }} />

                {/* Actions */}
                <View className="gap-2">
                  <TouchableOpacity
                    onPress={handleReschedule}
                    activeOpacity={0.75}
                    className="flex-row items-center justify-center gap-2 py-3.5 rounded-2xl border"
                    style={{ borderColor: colors.border }}
                  >
                    <Ionicons name="calendar-outline" size={17} color={colors.subtle} />
                    <AppText variant="bodyMedium" color="muted" className="font-medium">
                      Adiar consulta
                    </AppText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleCancel}
                    activeOpacity={0.75}
                    className="flex-row items-center justify-center gap-2 py-3.5 rounded-2xl"
                    style={{ backgroundColor: colors.error + "10" }}
                  >
                    <Ionicons name="close-circle-outline" size={17} color={colors.error} />
                    <AppText variant="bodyMedium" color="error" className="font-medium">
                      Cancelar consulta
                    </AppText>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>

    <ConfirmActionModal
      visible={showCancelConfirm}
      icon="calendar-outline"
      iconColor="#EF4444"
      confirmColor="#EF4444"
      title="Cancelar consulta"
      description="Confirmar cancelamento da consulta? Esta ação não pode ser desfeita."
      confirmLabel="Cancelar consulta"
      cancelLabel="Voltar"
      onConfirm={() => { setShowCancelConfirm(false); onClose(); onCancel(); }}
      onCancel={() => setShowCancelConfirm(false)}
    />
    </>
  );
}
