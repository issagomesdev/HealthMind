import React, { useState, useEffect, useCallback } from "react";
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
import { ObservationCard } from "../../../components/professional/patients/ObservationCard";
import { useTheme } from "../../../../core/theme";
import { patientObservationService } from "../../../../services/patients/patientObservationService";
import { PatientObservation, ObservationCategory, ObservationPriority } from "../../../../types/patient";

const CATEGORIES: (ObservationCategory | "Todas")[] = [
  "Todas",
  "Evolução",
  "Sessão",
  "Alerta",
  "Plano terapêutico",
  "Comportamento",
  "Pagamento",
  "Geral",
];

const PRIORITIES: (ObservationPriority | "Todas")[] = ["Todas", "Urgente", "Alta", "Média", "Baixa"];

function FilterChip({
  label,
  active,
  onPress,
  urgentStyle,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  urgentStyle?: boolean;
}) {
  const { colors } = useTheme();
  const activeColor = urgentStyle ? "#EF4444" : colors.secondary;
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
      <AppText style={{ fontSize: 13, fontWeight: "600", color: active ? "#fff" : colors.subtle }}>
        {label}
      </AppText>
    </TouchableOpacity>
  );
}

export function PatientObservationsScreen() {
  const router = useRouter();
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const { colors } = useTheme();

  const [observations, setObservations] = useState<PatientObservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<ObservationCategory | "Todas">("Todas");
  const [priority, setPriority] = useState<ObservationPriority | "Todas">("Todas");

  const loadObservations = useCallback(async () => {
    if (!id) return;
    const result = await patientObservationService.filterObservations(id, category, priority, keyword);
    setObservations(result);
  }, [id, category, priority, keyword]);

  useEffect(() => {
    setIsLoading(true);
    loadObservations().finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setIsFiltering(true);
      await loadObservations();
      setIsFiltering(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [loadObservations]);

  const urgentCount = observations.filter((o) => o.priority === "Urgente").length;

  const ListHeader = (
    <View style={{ gap: 14, marginBottom: 6 }}>
      {/* Urgent banner */}
      {urgentCount > 0 && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            backgroundColor: "#EF444415",
            borderRadius: 12,
            padding: 14,
            borderWidth: 1,
            borderColor: "#EF444440",
          }}
        >
          <Ionicons name="flash-outline" size={18} color="#EF4444" />
          <AppText style={{ fontSize: 13, color: "#EF4444", fontWeight: "700" }}>
            {urgentCount} observaç{urgentCount > 1 ? "ões urgentes" : "ão urgente"} — atenção necessária
          </AppText>
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
          placeholder="Buscar por título, texto ou tag..."
          placeholderTextColor={colors.subtle}
          style={{ flex: 1, fontSize: 14, color: colors.content }}
        />
        {keyword.length > 0 && (
          <TouchableOpacity onPress={() => setKeyword("")}>
            <Ionicons name="close-circle-outline" size={18} color={colors.subtle} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category filter */}
      <View>
        <AppText style={{ fontSize: 11, fontWeight: "600", color: colors.subtle, marginBottom: 8, letterSpacing: 0.5 }}>
          CATEGORIA
        </AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {CATEGORIES.map((cat) => (
            <FilterChip
              key={cat}
              label={cat}
              active={category === cat}
              onPress={() => setCategory(cat)}
            />
          ))}
        </ScrollView>
      </View>

      {/* Priority filter */}
      <View>
        <AppText style={{ fontSize: 11, fontWeight: "600", color: colors.subtle, marginBottom: 8, letterSpacing: 0.5 }}>
          PRIORIDADE
        </AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {PRIORITIES.map((prio) => (
            <FilterChip
              key={prio}
              label={prio}
              active={priority === prio}
              onPress={() => setPriority(prio)}
              urgentStyle={prio === "Urgente"}
            />
          ))}
        </ScrollView>
      </View>

      <AppText style={{ fontSize: 13, color: colors.subtle }}>
        {isFiltering ? "Filtrando..." : `${observations.length} observaç${observations.length !== 1 ? "ões" : "ão"}`}
      </AppText>
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        <TopBar title="Observações" onBackPress={() => router.back()} showMenu={false} />
        <LoadingState message="Carregando observações..." fullScreen />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <TopBar
        title={`Observações — ${name ?? "Paciente"}`}
        onBackPress={() => router.back()}
        showMenu={false}
        rightAction={
          <TouchableOpacity
            onPress={() =>
              router.push(`/(protected)/add-patient-observation?patientId=${id}&patientName=${encodeURIComponent(name ?? "")}` as never)
            }
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
            <AppText style={{ fontSize: 12, color: colors.secondary, fontWeight: "700" }}>Nova</AppText>
          </TouchableOpacity>
        }
      />

      <FlatList
        data={observations}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 48, gap: 10 }}
        ListHeaderComponent={ListHeader}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ObservationCard
            observation={item}
            onPress={() =>
              router.push(`/(protected)/patient-observation-details?id=${item.id}` as never)
            }
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="pencil-outline"
            title="Nenhuma observação"
            description="Registre observações clínicas sobre este paciente."
            actionLabel="Nova observação"
            onAction={() =>
              router.push(`/(protected)/add-patient-observation?patientId=${id}&patientName=${encodeURIComponent(name ?? "")}` as never)
            }
          />
        }
      />
    </View>
  );
}
