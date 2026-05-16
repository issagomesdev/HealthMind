import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TopBar } from "../../../components/navigation/TopBar";
import { AppText } from "../../../components/ui/AppText";
import { LoadingState } from "../../../components/ui/LoadingState";
import { EmptyState } from "../../../components/ui/EmptyState";
import { PatientDiaryCard } from "../../../components/professional/patients/PatientDiaryCard";
import { DiaryMoodBadge } from "../../../components/professional/patients/DiaryMoodBadge";
import { useTheme } from "../../../../core/theme";
import { patientDiaryService, DiaryPeriodFilter, DiaryMoodFilter } from "../../../../services/patients/patientDiaryService";
import { patientsService } from "../../../../services/patients/PatientsService";
import { DiaryRecord, ProfessionalPatient } from "../../../../types/patient";

const PERIOD_OPTIONS: { label: string; value: DiaryPeriodFilter }[] = [
  { label: "Todos", value: "all" },
  { label: "7 dias", value: "7d" },
  { label: "30 dias", value: "30d" },
  { label: "Este mês", value: "month" },
];

const MOOD_OPTIONS: { label: string; value: DiaryMoodFilter }[] = [
  { label: "Todos", value: "all" },
  { label: "Estável", value: "Estável" },
  { label: "Ansioso", value: "Ansioso" },
  { label: "Triste", value: "Triste" },
  { label: "Irritado", value: "Irritado" },
  { label: "Cansado", value: "Cansado" },
];

function FilterChip({
  label,
  active,
  onPress,
  color,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  color?: string;
}) {
  const { colors } = useTheme();
  const activeColor = color ?? colors.secondary;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 99,
        backgroundColor: active ? activeColor : colors.muted + "50",
        borderWidth: active ? 0 : 1,
        borderColor: colors.border,
      }}
    >
      <AppText
        style={{
          fontSize: 13,
          fontWeight: "600",
          color: active ? "#fff" : colors.subtle,
        }}
      >
        {label}
      </AppText>
    </TouchableOpacity>
  );
}

function SummaryCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.surface,
        borderRadius: 14,
        padding: 12,
        alignItems: "flex-start",
        gap: 6,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
      }}
    >
      <View
        style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          backgroundColor: color + "20",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={icon} size={15} color={color} />
      </View>
      <AppText style={{ fontSize: 16, fontWeight: "800", color: colors.content }}>{value}</AppText>
      <AppText style={{ fontSize: 11, color: colors.subtle, lineHeight: 14 }}>{label}</AppText>
    </View>
  );
}

export function PatientDiaryScreen() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const { colors } = useTheme();

  const [patient, setPatient] = useState<ProfessionalPatient | null>(null);
  const [allDiaries, setAllDiaries] = useState<DiaryRecord[]>([]);
  const [filtered, setFiltered] = useState<DiaryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [period, setPeriod] = useState<DiaryPeriodFilter>("all");
  const [mood, setMood] = useState<DiaryMoodFilter>("all");

  useEffect(() => {
    if (!id) return;
    Promise.all([
      patientsService.getPatientById(id),
      patientDiaryService.getPatientDiaries(id),
    ]).then(([p, diaries]) => {
      setPatient(p);
      setAllDiaries(diaries);
      setFiltered(diaries);
      setIsLoading(false);
    });
  }, [id]);

  const applyFilters = useCallback(async () => {
    if (!id) return;
    setIsFiltering(true);
    const result = await patientDiaryService.filterDiaries(id, period, mood, keyword);
    setFiltered(result);
    setIsFiltering(false);
  }, [id, period, mood, keyword]);

  useEffect(() => {
    const timer = setTimeout(applyFilters, 300);
    return () => clearTimeout(timer);
  }, [applyFilters]);

  const stats = useMemo(() => {
    if (allDiaries.length === 0) return null;
    const alertCount = allDiaries.filter((d) => d.hasAlert).length;
    const emotionFreq: Record<string, number> = {};
    allDiaries.forEach((d) => d.emotions.forEach((e) => { emotionFreq[e] = (emotionFreq[e] ?? 0) + 1; }));
    const topEmotion = Object.entries(emotionFreq).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    const lastRecord = allDiaries[0];
    const lastDate = lastRecord
      ? new Date(lastRecord.recordedAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })
      : "—";
    return { total: allDiaries.length, alertCount, topEmotion, lastDate };
  }, [allDiaries]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        <TopBar title="Diário" onBackPress={() => router.back()} showMenu={false} />
        <LoadingState message="Carregando diário..." fullScreen />
      </View>
    );
  }

  const isPending = patient?.status === "pending";

  if (isPending) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        <TopBar title="Diário" onBackPress={() => router.back()} showMenu={false} />
        <EmptyState
          icon="lock-closed-outline"
          title="Diário indisponível"
          description={`O diário de ${name ?? "paciente"} estará disponível após o aceite da solicitação de atendimento.`}
        />
      </View>
    );
  }

  const ListHeader = (
    <View style={{ gap: 14, paddingBottom: 6 }}>
      {/* Summary cards */}
      {stats && (
        <View style={{ flexDirection: "row", gap: 8 }}>
          <SummaryCard label="Total de registros" value={String(stats.total)} icon="journal-outline" color={colors.secondary} />
          <SummaryCard label="Emoção mais frequente" value={stats.topEmotion} icon="pulse-outline" color="#6B7EF5" />
        </View>
      )}
      {stats && (
        <View style={{ flexDirection: "row", gap: 8 }}>
          <SummaryCard label="Último registro" value={stats.lastDate} icon="calendar-outline" color="#60A5FA" />
          <SummaryCard
            label="Alertas recentes"
            value={stats.alertCount > 0 ? `${stats.alertCount} alerta${stats.alertCount > 1 ? "s" : ""}` : "Nenhum"}
            icon="warning-outline"
            color={stats.alertCount > 0 ? "#EF4444" : "#6DBF7B"}
          />
        </View>
      )}

      {/* Search */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.surface,
          borderRadius: 14,
          paddingHorizontal: 14,
          height: 48,
          gap: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.06,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        <Ionicons name="search-outline" size={18} color={colors.subtle} />
        <TextInput
          value={keyword}
          onChangeText={setKeyword}
          placeholder="Buscar no relato ou tags..."
          placeholderTextColor={colors.subtle}
          style={{ flex: 1, fontSize: 14, color: colors.content }}
        />
        {keyword.length > 0 && (
          <TouchableOpacity onPress={() => setKeyword("")}>
            <Ionicons name="close-circle-outline" size={18} color={colors.subtle} />
          </TouchableOpacity>
        )}
      </View>

      {/* Period filter */}
      <View>
        <AppText style={{ fontSize: 11, fontWeight: "600", color: colors.subtle, marginBottom: 8, letterSpacing: 0.5 }}>
          PERÍODO
        </AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {PERIOD_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.value}
              label={opt.label}
              active={period === opt.value}
              onPress={() => setPeriod(opt.value)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Mood filter */}
      <View>
        <AppText style={{ fontSize: 11, fontWeight: "600", color: colors.subtle, marginBottom: 8, letterSpacing: 0.5 }}>
          HUMOR
        </AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {MOOD_OPTIONS.map((opt) => (
            <FilterChip
              key={opt.value}
              label={opt.label}
              active={mood === opt.value}
              onPress={() => setMood(opt.value as DiaryMoodFilter)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Count */}
      <AppText style={{ fontSize: 13, color: colors.subtle }}>
        {isFiltering ? "Filtrando..." : `${filtered.length} registro${filtered.length !== 1 ? "s" : ""}`}
      </AppText>
    </View>
  );

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <TopBar
        title={`Diário — ${name ?? "Paciente"}`}
        onBackPress={() => router.back()}
        showMenu={false}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 48, gap: 10 }}
        ListHeaderComponent={ListHeader}
        ListHeaderComponentStyle={{ marginBottom: 6 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <PatientDiaryCard
            record={item}
            onPress={() =>
              router.push(
                `/(protected)/patient-diary-details?id=${item.id}&patientId=${id}` as never
              )
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="journal-outline"
            title="Nenhum registro encontrado"
            description="Tente ajustar os filtros ou aguarde novos registros do paciente."
          />
        }
      />
    </View>
  );
}
