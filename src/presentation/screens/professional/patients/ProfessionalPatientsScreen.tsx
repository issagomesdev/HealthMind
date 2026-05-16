import React, { useEffect } from "react";
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TopBar } from "../../../components/navigation/TopBar";
import { PatientCard } from "../../../components/professional/patients/PatientCard";
import { LoadingState } from "../../../components/ui/LoadingState";
import { AppText } from "../../../components/ui/AppText";
import { useTheme } from "../../../../core/theme";
import { useNavigationContext } from "../../../context/NavigationContext";
import {
  usePatientsController,
  PatientFilter,
  PatientSort,
} from "../../../controllers/usePatientsController";
import { ProfessionalPatient } from "../../../../types/patient";

const FILTER_LABELS: { key: PatientFilter; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "high_risk", label: "Alto risco" },
  { key: "critical", label: "Crítico" },
  { key: "recent", label: "Recentes" },
  { key: "premium", label: "Premium" },
  { key: "free", label: "Free" },
  { key: "active", label: "Ativos" },
  { key: "pending", label: "Pendentes" },
  { key: "stable", label: "Estável" },
  { key: "attention", label: "Atenção" },
];

const SORT_OPTIONS: { key: PatientSort; label: string }[] = [
  { key: "risk_level", label: "Nível de risco" },
  { key: "last_interaction", label: "Última interação" },
  { key: "next_appointment", label: "Próxima consulta" },
  { key: "name_asc", label: "Nome A-Z" },
  { key: "name_desc", label: "Nome Z-A" },
];

export function ProfessionalPatientsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { openMenu } = useNavigationContext();
  const controller = usePatientsController();
  const [sortMenuOpen, setSortMenuOpen] = React.useState(false);

  useEffect(() => {
    controller.loadPatients();
  }, []);

  const handlePatientPress = (patient: ProfessionalPatient) => {
    router.push(`/(protected)/patient-details?id=${patient.id}` as never);
  };

  const handleAddPatient = () => {
    router.push("/(protected)/add-patient" as never);
  };

  const currentSortLabel =
    SORT_OPTIONS.find((s) => s.key === controller.activeSorting)?.label ?? "Ordenar";

  const ListHeader = (
    <>
      {/* Dashboard grid */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 }}>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <DashCard
            label="Total"
            value={controller.totalCount}
            icon="people"
            color={colors.secondary}
            colors={colors}
            style={{ flex: 1 }}
          />
          <DashCard
            label="Críticos"
            value={controller.criticalCount}
            icon="warning"
            color={colors.error}
            colors={colors}
            style={{ flex: 1 }}
          />
        </View>
        <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
          <DashCard
            label="Pendentes"
            value={controller.pendingCount}
            icon="time"
            color="#9CA3AF"
            colors={colors}
            style={{ flex: 1 }}
          />
          <DashCard
            label="Consultas Hoje"
            value={controller.todayAppointmentsCount}
            icon="calendar"
            color="#F59E0B"
            colors={colors}
            style={{ flex: 1 }}
          />
        </View>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, paddingRight: 16 }}
      >
        {FILTER_LABELS.map((f) => {
          const isActive = controller.activeFilter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              onPress={() => controller.setFilter(f.key)}
              activeOpacity={0.7}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 5,
                borderRadius: 99,
                backgroundColor: isActive ? colors.secondary : "transparent",
                borderWidth: 1.5,
                borderColor: isActive ? colors.secondary : colors.border,
                marginRight: 8,
                height: 35,
              }}
            >
              <AppText
                style={{
                  fontSize: 13,
                  color: isActive ? "#fff" : colors.subtle,
                  fontWeight: isActive ? "600" : "400",
                }}
              >
                {f.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </>
  );

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <TopBar title="HealthMind" onMenuPress={openMenu} />

      {/* Page title + round add button — fixed */}
      <View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingTop: 4, paddingBottom: 10 }}>
        <AppText style={{ flex: 1, fontSize: 26, fontWeight: "800", color: colors.content }}>
          Lista de Pacientes
        </AppText>
        <TouchableOpacity
          onPress={handleAddPatient}
          activeOpacity={0.85}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: colors.secondary,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: colors.secondary,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.35,
            shadowRadius: 6,
            elevation: 4,
          }}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search — fixed */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.surface,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: 12,
            height: 44,
            gap: 8,
          }}
        >
          <Ionicons name="search-outline" size={18} color={colors.subtle} />
          <TextInput
            value={controller.searchQuery}
            onChangeText={controller.setSearchQuery}
            placeholder="Buscar paciente..."
            placeholderTextColor={colors.subtle}
            style={{ flex: 1, color: colors.content, fontSize: 15 }}
            returnKeyType="search"
          />
          {controller.searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => controller.setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color={colors.subtle} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Sort row — fixed */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingBottom: 4,
        }}
      >
        <AppText variant="small" color="muted">
          {controller.filteredPatients.length} paciente
          {controller.filteredPatients.length !== 1 ? "s" : ""}
        </AppText>
        <View>
          <TouchableOpacity
            onPress={() => setSortMenuOpen((v) => !v)}
            activeOpacity={0.7}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor: colors.surface,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Ionicons name="funnel-outline" size={14} color={colors.subtle} />
            <AppText variant="small" color="muted">
              {currentSortLabel}
            </AppText>
            <Ionicons
              name={sortMenuOpen ? "chevron-up" : "chevron-down"}
              size={12}
              color={colors.subtle}
            />
          </TouchableOpacity>
          {sortMenuOpen && (
            <View
              style={{
                position: "absolute",
                top: 36,
                right: 0,
                zIndex: 100,
                backgroundColor: colors.surface,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                minWidth: 180,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.12,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              {SORT_OPTIONS.map((s) => (
                <TouchableOpacity
                  key={s.key}
                  onPress={() => {
                    controller.setSorting(s.key);
                    setSortMenuOpen(false);
                  }}
                  activeOpacity={0.7}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <AppText
                    variant="small"
                    style={{
                      color:
                        controller.activeSorting === s.key
                          ? colors.secondary
                          : colors.content,
                      fontWeight: controller.activeSorting === s.key ? "600" : "400",
                    }}
                  >
                    {s.label}
                  </AppText>
                  {controller.activeSorting === s.key && (
                    <Ionicons name="checkmark" size={16} color={colors.secondary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Scrollable list — dashboard + filters scroll with it */}
      {controller.isLoading ? (
        <LoadingState message="Carregando pacientes..." fullScreen />
      ) : (
        <FlatList
          data={controller.filteredPatients}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={ListHeader}
          renderItem={({ item }) => (
            <PatientCard patient={item} onPress={() => handlePatientPress(item)} />
          )}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-16 px-8">
              <Ionicons name="people-outline" size={48} color={colors.subtle} />
              <AppText variant="heading3" color="muted" className="text-center mt-4 mb-2">
                Nenhum paciente encontrado
              </AppText>
              <AppText variant="body" color="muted" className="text-center">
                {controller.searchQuery
                  ? "Tente buscar por outro termo."
                  : "Adicione seu primeiro paciente tocando no botão abaixo."}
              </AppText>
            </View>
          }
        />
      )}
    </View>
  );
}

type Colors = ReturnType<typeof import("../../../../core/theme").useTheme>["colors"];

interface DashCardProps {
  label: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  colors: Colors;
  style?: object;
}

function DashCard({ label, value, icon, color, colors, style }: DashCardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: 16,
          padding: 14,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 4,
          elevation: 2,
          borderLeftWidth: 3,
          borderLeftColor: color,
        },
        style,
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <AppText style={{ fontSize: 13, color: colors.subtle, fontWeight: "500" }}>
          {label}
        </AppText>
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            backgroundColor: color + "18",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name={icon} size={15} color={color} />
        </View>
      </View>
      <AppText style={{ fontSize: 32, fontWeight: "800", color: colors.content, lineHeight: 36 }}>
        {value}
      </AppText>
    </View>
  );
}
