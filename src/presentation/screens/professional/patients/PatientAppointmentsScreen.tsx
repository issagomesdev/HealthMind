import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TopBar } from "../../../components/navigation/TopBar";
import { AppText } from "../../../components/ui/AppText";
import { AppCard } from "../../../components/ui/AppCard";
import { LoadingState } from "../../../components/ui/LoadingState";
import { EmptyState } from "../../../components/ui/EmptyState";
import { AppointmentCard } from "../../../components/professional/patients/AppointmentCard";
import { AppointmentStatusBadge } from "../../../components/professional/patients/AppointmentStatusBadge";
import { useTheme } from "../../../../core/theme";
import {
  patientAppointmentService,
  AppointmentTabFilter,
} from "../../../../services/patients/patientAppointmentService";
import { PatientAppointment, AppointmentType, AppointmentFormatType } from "../../../../types/patient";

const TABS: { label: string; value: AppointmentTabFilter }[] = [
  { label: "Próximas", value: "upcoming" },
  { label: "Passadas", value: "past" },
  { label: "Canceladas", value: "cancelled" },
  { label: "Todas", value: "all" },
];

const APPOINTMENT_TYPES: { label: string; value: AppointmentType }[] = [
  { label: "Consulta", value: "consultation" },
  { label: "Retorno", value: "return" },
  { label: "Avaliação inicial", value: "initial_assessment" },
  { label: "Acompanhamento", value: "follow_up" },
];

const APPOINTMENT_FORMATS: { label: string; value: AppointmentFormatType }[] = [
  { label: "Online", value: "online" },
  { label: "Presencial", value: "in_person" },
  { label: "Híbrido", value: "hybrid" },
];

function isToday(iso: string): boolean {
  const d = new Date(iso);
  const today = new Date();
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function NextAppointmentBanner({
  appointment,
  onPress,
}: {
  appointment: PatientAppointment;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  const todayFlag = isToday(appointment.scheduledAt);
  const accentColor = todayFlag ? "#6DBF7B" : colors.secondary;
  const time = new Date(appointment.scheduledAt).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const dateStr = todayFlag
    ? `Hoje às ${time}`
    : new Date(appointment.scheduledAt).toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "2-digit",
        month: "short",
      }) + ` às ${time}`;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: accentColor + "15",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1.5,
        borderColor: accentColor + "40",
        gap: 6,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 2 }}>
        <Ionicons name="calendar-outline" size={16} color={accentColor} />
        <AppText style={{ fontSize: 12, color: accentColor, fontWeight: "700", letterSpacing: 0.5 }}>
          {todayFlag ? "SESSÃO HOJE" : "PRÓXIMA CONSULTA"}
        </AppText>
      </View>
      <AppText style={{ fontSize: 18, fontWeight: "800", color: colors.content }}>{dateStr}</AppText>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <AppText style={{ fontSize: 13, color: colors.subtle }}>{appointment.typeLabel}</AppText>
        <AppText style={{ fontSize: 13, color: colors.subtle }}>•</AppText>
        <AppText style={{ fontSize: 13, color: colors.subtle }}>{appointment.formatLabel}</AppText>
        <AppText style={{ fontSize: 13, color: colors.subtle }}>•</AppText>
        <AppText style={{ fontSize: 13, color: colors.subtle }}>{appointment.durationMinutes} min</AppText>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
        <AppText style={{ fontSize: 12, color: accentColor, fontWeight: "600" }}>Ver detalhes</AppText>
        <Ionicons name="chevron-forward-outline" size={14} color={accentColor} />
      </View>
    </TouchableOpacity>
  );
}

export function PatientAppointmentsScreen() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const { colors } = useTheme();

  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [nextAppointment, setNextAppointment] = useState<PatientAppointment | null>(null);
  const [activeTab, setActiveTab] = useState<AppointmentTabFilter>("upcoming");
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Create form state
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [formType, setFormType] = useState<AppointmentType>("consultation");
  const [formFormat, setFormFormat] = useState<AppointmentFormatType>("online");
  const [formDuration, setFormDuration] = useState("50");
  const [formValue, setFormValue] = useState("");
  const [formNote, setFormNote] = useState("");

  const loadAppointments = useCallback(async () => {
    if (!id) return;
    const [list, next] = await Promise.all([
      patientAppointmentService.getPatientAppointments(id, activeTab),
      patientAppointmentService.getNextAppointment(id),
    ]);
    setAppointments(list);
    setNextAppointment(next);
  }, [id, activeTab]);

  useEffect(() => {
    setIsLoading(true);
    loadAppointments().finally(() => setIsLoading(false));
  }, [loadAppointments]);

  const handleCreate = async () => {
    if (!id || !formDate || !formTime) return;
    setIsCreating(true);
    try {
      const scheduledAt = new Date(`${formDate}T${formTime}:00`).toISOString();
      const digits = formValue.replace(/\D/g, "");
      const value = digits ? parseInt(digits, 10) / 100 : null;
      await patientAppointmentService.createAppointment(id, {
        scheduledAt,
        type: formType,
        format: formFormat,
        durationMinutes: parseInt(formDuration) || 50,
        value,
        shortNote: formNote,
        objectives: [],
      });
      setShowCreateModal(false);
      setFormDate(""); setFormTime(""); setFormNote(""); setFormValue("");
      await loadAppointments();
    } finally {
      setIsCreating(false);
    }
  };

  const ListHeader = (
    <View style={{ gap: 14, marginBottom: 6 }}>
      {nextAppointment && (
        <NextAppointmentBanner
          appointment={nextAppointment}
          onPress={() =>
            router.push(`/(protected)/patient-appointment-details?id=${nextAppointment.id}` as never)
          }
        />
      )}

      {/* Tab bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.value}
            onPress={() => setActiveTab(tab.value)}
            activeOpacity={0.75}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 99,
              backgroundColor: activeTab === tab.value ? colors.secondary : colors.muted + "50",
              borderWidth: activeTab === tab.value ? 0 : 1,
              borderColor: colors.border,
            }}
          >
            <AppText
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: activeTab === tab.value ? "#fff" : colors.subtle,
              }}
            >
              {tab.label}
            </AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <AppText style={{ fontSize: 13, color: colors.subtle }}>
        {appointments.length} agendamento{appointments.length !== 1 ? "s" : ""}
      </AppText>
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        <TopBar title="Agendamentos" onBackPress={() => router.back()} showMenu={false} />
        <LoadingState message="Carregando agendamentos..." fullScreen />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <TopBar
        title={`Agendamentos — ${name ?? "Paciente"}`}
        onBackPress={() => router.back()}
        showMenu={false}
        rightAction={
          <TouchableOpacity
            onPress={() => setShowCreateModal(true)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              backgroundColor: colors.secondary + "20",
              borderRadius: 99,
              paddingHorizontal: 12,
              paddingVertical: 6,
            }}
          >
            <Ionicons name="add-outline" size={16} color={colors.secondary} />
            <AppText style={{ fontSize: 12, color: colors.secondary, fontWeight: "700" }}>Novo</AppText>
          </TouchableOpacity>
        }
      />

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 48, gap: 10 }}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <AppointmentCard
            appointment={item}
            isToday={isToday(item.scheduledAt)}
            onPress={() =>
              router.push(`/(protected)/patient-appointment-details?id=${item.id}` as never)
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="calendar-outline"
            title="Nenhum agendamento"
            description="Crie um novo agendamento para este paciente."
            actionLabel="Criar agendamento"
            onAction={() => setShowCreateModal(true)}
          />
        }
      />

      {/* Create Appointment Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => !isCreating && setShowCreateModal(false)}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
          <View
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              gap: 14,
            }}
          >
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: "center" }} />
            <AppText style={{ fontSize: 17, fontWeight: "700", color: colors.content }}>Novo agendamento</AppText>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={{ flex: 1 }}>
                <AppText style={{ fontSize: 12, color: colors.subtle, marginBottom: 4 }}>Data (AAAA-MM-DD)</AppText>
                <TextInput
                  value={formDate}
                  onChangeText={setFormDate}
                  placeholder="2026-05-25"
                  placeholderTextColor={colors.subtle}
                  keyboardType="numbers-and-punctuation"
                  style={{
                    backgroundColor: colors.muted + "40",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colors.border,
                    padding: 12,
                    color: colors.content,
                    fontSize: 14,
                  }}
                />
              </View>
              <View style={{ width: 90 }}>
                <AppText style={{ fontSize: 12, color: colors.subtle, marginBottom: 4 }}>Hora</AppText>
                <TextInput
                  value={formTime}
                  onChangeText={setFormTime}
                  placeholder="16:00"
                  placeholderTextColor={colors.subtle}
                  keyboardType="numbers-and-punctuation"
                  style={{
                    backgroundColor: colors.muted + "40",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colors.border,
                    padding: 12,
                    color: colors.content,
                    fontSize: 14,
                  }}
                />
              </View>
            </View>

            {/* Type chips */}
            <View>
              <AppText style={{ fontSize: 12, color: colors.subtle, marginBottom: 6 }}>Tipo</AppText>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                {APPOINTMENT_TYPES.map((t) => (
                  <TouchableOpacity
                    key={t.value}
                    onPress={() => setFormType(t.value)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 99,
                      backgroundColor: formType === t.value ? colors.secondary : colors.muted + "50",
                      borderWidth: formType === t.value ? 0 : 1,
                      borderColor: colors.border,
                    }}
                  >
                    <AppText style={{ fontSize: 12, fontWeight: "600", color: formType === t.value ? "#fff" : colors.subtle }}>
                      {t.label}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Format chips */}
            <View>
              <AppText style={{ fontSize: 12, color: colors.subtle, marginBottom: 6 }}>Formato</AppText>
              <View style={{ flexDirection: "row", gap: 8 }}>
                {APPOINTMENT_FORMATS.map((f) => (
                  <TouchableOpacity
                    key={f.value}
                    onPress={() => setFormFormat(f.value)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      borderRadius: 99,
                      backgroundColor: formFormat === f.value ? colors.secondary : colors.muted + "50",
                      borderWidth: formFormat === f.value ? 0 : 1,
                      borderColor: colors.border,
                    }}
                  >
                    <AppText style={{ fontSize: 12, fontWeight: "600", color: formFormat === f.value ? "#fff" : colors.subtle }}>
                      {f.label}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <View style={{ flex: 1 }}>
                <AppText style={{ fontSize: 12, color: colors.subtle, marginBottom: 4 }}>Duração (min)</AppText>
                <TextInput
                  value={formDuration}
                  onChangeText={setFormDuration}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: colors.muted + "40",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colors.border,
                    padding: 12,
                    color: colors.content,
                    fontSize: 14,
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <AppText style={{ fontSize: 12, color: colors.subtle, marginBottom: 4 }}>Valor (R$)</AppText>
                <TextInput
                  value={formValue}
                  onChangeText={setFormValue}
                  placeholder="180,00"
                  placeholderTextColor={colors.subtle}
                  keyboardType="numeric"
                  style={{
                    backgroundColor: colors.muted + "40",
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colors.border,
                    padding: 12,
                    color: colors.content,
                    fontSize: 14,
                  }}
                />
              </View>
            </View>

            <TextInput
              value={formNote}
              onChangeText={setFormNote}
              placeholder="Observação rápida (opcional)"
              placeholderTextColor={colors.subtle}
              style={{
                backgroundColor: colors.muted + "40",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 12,
                color: colors.content,
                fontSize: 14,
              }}
            />

            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => setShowCreateModal(false)}
                disabled={isCreating}
                style={{ flex: 1, borderRadius: 12, paddingVertical: 14, alignItems: "center", borderWidth: 1.5, borderColor: colors.border }}
              >
                <AppText style={{ color: colors.subtle, fontWeight: "600" }}>Cancelar</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreate}
                disabled={!formDate || !formTime || isCreating}
                style={{
                  flex: 1,
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: "center",
                  backgroundColor: colors.secondary,
                  opacity: !formDate || !formTime ? 0.6 : 1,
                }}
              >
                {isCreating ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <AppText style={{ color: "#fff", fontWeight: "700" }}>Criar</AppText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
