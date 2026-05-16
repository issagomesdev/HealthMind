import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Linking } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TopBar } from "../../../components/navigation/TopBar";
import { AppText } from "../../../components/ui/AppText";
import { AppCard } from "../../../components/ui/AppCard";
import { LoadingState } from "../../../components/ui/LoadingState";
import { AppointmentStatusBadge } from "../../../components/professional/patients/AppointmentStatusBadge";
import { useTheme } from "../../../../core/theme";
import { patientAppointmentService } from "../../../../services/patients/patientAppointmentService";
import { PatientAppointment } from "../../../../types/patient";

function InfoRow({ label, value }: { label: string; value: string }) {
  const { colors } = useTheme();
  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
      <AppText style={{ fontSize: 13, color: colors.subtle, flex: 1 }}>{label}</AppText>
      <AppText style={{ fontSize: 13, color: colors.content, fontWeight: "500", flex: 1.5, textAlign: "right" }}>
        {value}
      </AppText>
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <AppCard>
      <AppText
        style={{ fontSize: 11, fontWeight: "700", color: colors.subtle, letterSpacing: 0.8, marginBottom: 12 }}
      >
        {title}
      </AppText>
      {children}
    </AppCard>
  );
}

export function PatientAppointmentDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();

  const [appointment, setAppointment] = useState<PatientAppointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;
    patientAppointmentService.getAppointmentById(id).then((a) => {
      setAppointment(a);
      setIsLoading(false);
    });
  }, [id]);

  const handleCancel = async () => {
    if (!appointment) return;
    setIsCancelling(true);
    await patientAppointmentService.cancelAppointment(appointment.id);
    const updated = await patientAppointmentService.getAppointmentById(appointment.id);
    setAppointment(updated);
    setIsCancelling(false);
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        <TopBar title="Detalhes da Sessão" onBackPress={() => router.back()} showMenu={false} />
        <LoadingState message="Carregando..." fullScreen />
      </View>
    );
  }

  if (!appointment) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        <TopBar title="Detalhes da Sessão" onBackPress={() => router.back()} showMenu={false} />
        <View className="flex-1 items-center justify-center">
          <Ionicons name="calendar-outline" size={48} color={colors.subtle} />
          <AppText style={{ color: colors.subtle, marginTop: 12 }}>Agendamento não encontrado</AppText>
        </View>
      </View>
    );
  }

  const scheduledDate = new Date(appointment.scheduledAt).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const isCancellable = appointment.status === "scheduled" || appointment.status === "rescheduled";

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <TopBar title="Detalhes da Sessão" onBackPress={() => router.back()} showMenu={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 48, gap: 12 }}
      >
        {/* Header */}
        <AppCard>
          <View style={{ gap: 10 }}>
            <AppText style={{ fontSize: 13, color: colors.subtle }}>{scheduledDate}</AppText>
            <AppointmentStatusBadge status={appointment.status} />
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
              <View style={{ backgroundColor: colors.secondary + "18", borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 }}>
                <AppText style={{ fontSize: 12, color: colors.secondary, fontWeight: "600" }}>{appointment.typeLabel}</AppText>
              </View>
              <View style={{ backgroundColor: colors.muted + "50", borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 }}>
                <AppText style={{ fontSize: 12, color: colors.subtle, fontWeight: "600" }}>{appointment.formatLabel}</AppText>
              </View>
              <View style={{ backgroundColor: colors.muted + "50", borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 }}>
                <AppText style={{ fontSize: 12, color: colors.subtle, fontWeight: "600" }}>{appointment.durationMinutes} min</AppText>
              </View>
            </View>
          </View>
        </AppCard>

        {/* Session info */}
        <Section title="INFORMAÇÕES">
          <InfoRow label="Tipo" value={appointment.typeLabel} />
          <InfoRow label="Formato" value={appointment.formatLabel} />
          <InfoRow label="Duração" value={`${appointment.durationMinutes} minutos`} />
          {appointment.value != null && (
            <InfoRow
              label="Valor"
              value={`R$ ${appointment.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            />
          )}
          <InfoRow label="Cobrança" value={appointment.hasCharge ? (appointment.charged ? "Cobrado" : "Pendente") : "Sem cobrança"} />
        </Section>

        {/* Location/link */}
        {appointment.callLink && (
          <Section title="LINK DA CHAMADA">
            <TouchableOpacity
              onPress={() => Linking.openURL(appointment.callLink!)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                backgroundColor: "#3B82F615",
                borderRadius: 12,
                padding: 14,
              }}
            >
              <Ionicons name="videocam-outline" size={20} color="#3B82F6" />
              <View style={{ flex: 1 }}>
                <AppText style={{ fontSize: 13, fontWeight: "600", color: "#3B82F6" }}>
                  Entrar na chamada
                </AppText>
                <AppText style={{ fontSize: 11, color: "#3B82F680" }} numberOfLines={1}>
                  {appointment.callLink}
                </AppText>
              </View>
              <Ionicons name="open-outline" size={16} color="#3B82F6" />
            </TouchableOpacity>
          </Section>
        )}

        {appointment.address && (
          <Section title="ENDEREÇO">
            <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
              <Ionicons name="location-outline" size={16} color={colors.secondary} style={{ marginTop: 1 }} />
              <AppText style={{ fontSize: 13, color: colors.content, flex: 1, lineHeight: 19 }}>
                {appointment.address}
              </AppText>
            </View>
          </Section>
        )}

        {/* Note */}
        {appointment.shortNote !== "" && (
          <Section title="OBSERVAÇÃO">
            <AppText style={{ fontSize: 14, color: colors.content, lineHeight: 21 }}>
              {appointment.shortNote}
            </AppText>
          </Section>
        )}

        {/* Session notes */}
        {appointment.sessionNotes !== "" && (
          <Section title="NOTAS DA SESSÃO">
            <AppText style={{ fontSize: 14, color: colors.content, lineHeight: 21 }}>
              {appointment.sessionNotes}
            </AppText>
          </Section>
        )}

        {/* Objectives */}
        {appointment.objectives.length > 0 && (
          <Section title="OBJETIVOS">
            <View style={{ gap: 6 }}>
              {appointment.objectives.map((obj, i) => (
                <View key={i} style={{ flexDirection: "row", gap: 8, alignItems: "flex-start" }}>
                  <Ionicons name="checkmark-circle-outline" size={16} color={colors.secondary} style={{ marginTop: 1 }} />
                  <AppText style={{ fontSize: 13, color: colors.content, flex: 1, lineHeight: 19 }}>
                    {obj}
                  </AppText>
                </View>
              ))}
            </View>
          </Section>
        )}

        {/* Referrals */}
        {appointment.referrals.length > 0 && (
          <Section title="ENCAMINHAMENTOS">
            <View style={{ gap: 6 }}>
              {appointment.referrals.map((ref, i) => (
                <View key={i} style={{ flexDirection: "row", gap: 8, alignItems: "flex-start" }}>
                  <Ionicons name="arrow-forward-circle-outline" size={16} color="#F59E0B" style={{ marginTop: 1 }} />
                  <AppText style={{ fontSize: 13, color: colors.content, flex: 1, lineHeight: 19 }}>
                    {ref}
                  </AppText>
                </View>
              ))}
            </View>
          </Section>
        )}

        {/* Actions */}
        {isCancellable && (
          <View style={{ gap: 8 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: "center",
                backgroundColor: colors.error + "15",
                borderWidth: 1.5,
                borderColor: colors.error + "40",
              }}
              onPress={handleCancel}
              disabled={isCancelling}
            >
              <AppText style={{ color: colors.error, fontWeight: "700", fontSize: 15 }}>
                {isCancelling ? "Cancelando..." : "Cancelar agendamento"}
              </AppText>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
