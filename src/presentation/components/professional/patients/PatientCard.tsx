import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppCard } from "../../ui/AppCard";
import { AppText } from "../../ui/AppText";
import { useTheme } from "../../../../core/theme";
import { ProfessionalPatient } from "../../../../types/patient";
import {
  getInitials,
  getRiskConfig,
  formatLastInteraction,
  formatNextAppointment,
} from "../../../../utils/patient";

interface PatientCardProps {
  patient: ProfessionalPatient;
  onPress: () => void;
}

const PLAN_TAG_LABELS: Record<string, string> = {
  premium: "Premium",
  free: "Free",
  cbt: "TCC",
  mindfulness: "Mindfulness",
  coaching: "Coaching",
  grief_support: "Grief Support",
  trauma: "Trauma",
  anxiety: "Ansiedade",
};

export function PatientCard({ patient, onPress }: PatientCardProps) {
  const { colors } = useTheme();
  const risk = getRiskConfig(patient.riskLevel, patient.status);
  const isPending = patient.status === "pending";

  return (
    <AppCard style={{ marginBottom: 12, marginHorizontal: 16, padding: 16 }}>
      {/* Header: avatar + name/check-in + risk badge */}
      <View className="flex-row items-start gap-3">
        <View
          className="shrink-0 items-center justify-center rounded-full"
          style={{ width: 52, height: 52, backgroundColor: colors.secondary + "20" }}
        >
          <AppText style={{ color: colors.secondary, fontWeight: "700", fontSize: 18 }}>
            {getInitials(patient.name)}
          </AppText>
        </View>

        <View className="flex-1">
          <View className="flex-row items-start justify-between gap-2">
            <AppText
              className="flex-1"
              numberOfLines={1}
              style={{ fontWeight: "700", fontSize: 16, color: colors.content }}
            >
              {patient.name}
            </AppText>
            <View
              className="flex-row items-center shrink-0 rounded-full"
              style={{
                gap: 4,
                backgroundColor: risk.bg,
                paddingHorizontal: 8,
                paddingVertical: 3,
              }}
            >
              <Ionicons
                name={risk.icon as keyof typeof Ionicons.glyphMap}
                size={12}
                color={risk.text}
              />
              <AppText style={{ color: risk.text, fontWeight: "600", fontSize: 11 }}>
                {risk.label}
              </AppText>
            </View>
          </View>
          <AppText style={{ color: colors.subtle, fontSize: 13, marginTop: 2 }}>
            Último check-in: {formatLastInteraction(patient.lastInteraction)}
          </AppText>
        </View>
      </View>

      {/* Pending state OR two-column feeling + appointment */}
      {isPending ? (
        <View
          className="flex-row items-center mt-3 rounded-xl"
          style={{ backgroundColor: "#9CA3AF12", padding: 10, gap: 8 }}
        >
          <Ionicons name="time-outline" size={15} color="#9CA3AF" />
          <AppText style={{ color: "#9CA3AF", fontWeight: "600", fontSize: 13 }}>
            Aguardando aceitação do paciente
          </AppText>
        </View>
      ) : (
        <View className="flex-row mt-[14px] gap-3">
          <View className="flex-1">
            <AppText style={{ color: colors.subtle, fontSize: 11, fontWeight: "500", marginBottom: 4 }}>
              Sentimento Predominante
            </AppText>
            <View className="flex-row items-center gap-[6px]">
              <Ionicons name="happy-outline" size={17} color={colors.secondary} />
              <AppText style={{ color: colors.content, fontWeight: "600", fontSize: 14 }}>
                {patient.dominantFeeling !== "—" ? patient.dominantFeeling : "—"}
              </AppText>
            </View>
          </View>

          <View className="w-px" style={{ backgroundColor: colors.border }} />

          <View className="flex-1">
            <AppText style={{ color: colors.subtle, fontSize: 11, fontWeight: "500", marginBottom: 4 }}>
              Próxima Consulta
            </AppText>
            {patient.nextAppointment ? (
              <View className="flex-row items-start gap-[6px]">
                <Ionicons
                  name="calendar-outline"
                  size={15}
                  color={colors.secondary}
                  style={{ marginTop: 1 }}
                />
                <AppText
                  className="flex-1"
                  numberOfLines={2}
                  style={{ color: colors.content, fontWeight: "500", fontSize: 13 }}
                >
                  {formatNextAppointment(patient.nextAppointment)}
                </AppText>
              </View>
            ) : (
              <AppText style={{ color: colors.subtle, fontSize: 13 }}>Não agendada</AppText>
            )}
          </View>
        </View>
      )}

      {/* Plan tags */}
      {patient.planTags.length > 0 && (
        <View className="flex-row flex-wrap mt-3 gap-[6px]">
          {patient.planTags.map((tag) => (
            <View
              key={tag}
              className="rounded-[6px]"
              style={{
                backgroundColor: tag === "premium" ? "#FEF3C720" : colors.surface,
                paddingHorizontal: 8,
                paddingVertical: 3,
                borderWidth: 1,
                borderColor: tag === "premium" ? "#F59E0B50" : colors.border,
              }}
            >
              <AppText
                style={{
                  color: tag === "premium" ? "#D97706" : colors.subtle,
                  fontWeight: "500",
                  fontSize: 12,
                }}
              >
                {PLAN_TAG_LABELS[tag] ?? tag}
              </AppText>
            </View>
          ))}
        </View>
      )}

      {/* Footer */}
      <View className="flex-row items-center justify-between mt-3">
        <View className="flex-1">
          {patient.emotionalAlerts.length > 0 && (
            <View className="flex-row items-center gap-1">
              <Ionicons name="warning-outline" size={13} color={colors.error} />
              <AppText
                numberOfLines={1}
                style={{ color: colors.error, fontSize: 12, fontWeight: "500" }}
              >
                {patient.emotionalAlerts[0]}
              </AppText>
            </View>
          )}
        </View>
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={0.7}
          className="flex-row items-center gap-0.5"
        >
          <AppText style={{ color: colors.secondary, fontWeight: "600", fontSize: 14 }}>
            Ver detalhes
          </AppText>
          <Ionicons name="arrow-forward" size={14} color={colors.secondary} />
        </TouchableOpacity>
      </View>
    </AppCard>
  );
}
