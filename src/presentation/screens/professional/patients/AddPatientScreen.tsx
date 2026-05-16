import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TopBar } from "../../../components/navigation/TopBar";
import { AppText } from "../../../components/ui/AppText";
import { AppCard } from "../../../components/ui/AppCard";
import { LoadingState } from "../../../components/ui/LoadingState";
import { useTheme } from "../../../../core/theme";
import { patientsService } from "../../../../services/patients/PatientsService";
import { UserToInvite, TherapyCategory } from "../../../../types/patient";
import { getInitials } from "../../../../utils/patient";

type Colors = ReturnType<typeof import("../../../../core/theme").useTheme>["colors"];

const THERAPY_CATEGORIES: TherapyCategory[] = [
  "Ansiedade",
  "Trauma",
  "Estresse",
  "Raiva",
  "Insônia",
  "Depressão",
  "Luto",
  "Relacionamentos",
  "Autoestima",
  "Foco",
  "Burnout",
];

const STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
  "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
  "SP", "SE", "TO",
];

// ─── SearchInput ─────────────────────────────────────────────────────────────

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
  colors: Colors;
}

function SearchInput({ value, onChangeText, onClear, colors }: SearchInputProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        paddingHorizontal: 14,
        height: 52,
        gap: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 8,
        elevation: 3,
      }}
    >
      <Ionicons name="search" size={20} color={colors.subtle} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Buscar por nome, e-mail ou @usuário"
        placeholderTextColor={colors.subtle}
        style={{ flex: 1, color: colors.content, fontSize: 15 }}
        returnKeyType="search"
        autoCapitalize="none"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} activeOpacity={0.7}>
          <Ionicons name="close-circle" size={20} color={colors.subtle} />
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── FilterChip ───────────────────────────────────────────────────────────────

interface FilterChipProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  onRemove?: () => void;
  colors: Colors;
}

function FilterChip({ label, isActive, onPress, icon, onRemove, colors }: FilterChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingLeft: icon ? 10 : 12,
        paddingRight: onRemove && isActive ? 8 : 12,
        paddingVertical: 7,
        borderRadius: 99,
        backgroundColor: isActive ? colors.secondary + "15" : colors.surface,
        borderWidth: 1.5,
        borderColor: isActive ? colors.secondary : colors.border,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 1,
      }}
    >
      {icon && (
        <Ionicons name={icon} size={14} color={isActive ? colors.secondary : colors.subtle} />
      )}
      <AppText
        style={{
          fontSize: 13,
          color: isActive ? colors.secondary : colors.subtle,
          fontWeight: isActive ? "600" : "400",
        }}
      >
        {label}
      </AppText>
      {onRemove && isActive && (
        <TouchableOpacity
          onPress={onRemove}
          hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
        >
          <Ionicons name="close-circle" size={15} color={colors.secondary} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

// ─── StateFilterModal ─────────────────────────────────────────────────────────

interface StateFilterModalProps {
  visible: boolean;
  selectedState?: string;
  onSelect: (state: string | undefined) => void;
  onClose: () => void;
  colors: Colors;
}

function StateFilterModal({ visible, selectedState, onSelect, onClose, colors }: StateFilterModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" }}>
        <View
          style={{
            backgroundColor: colors.surface,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingBottom: 36,
            maxHeight: "72%",
          }}
        >
          {/* Drag handle */}
          <View style={{ alignItems: "center", paddingTop: 12, paddingBottom: 4 }}>
            <View
              style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border }}
            />
          </View>

          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingTop: 8,
              paddingBottom: 14,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <AppText style={{ fontSize: 17, fontWeight: "700", color: colors.content }}>
              Selecionar Estado
            </AppText>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={22} color={colors.subtle} />
            </TouchableOpacity>
          </View>

          {/* States grid */}
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
              {STATES.map((s) => {
                const isActive = selectedState === s;
                return (
                  <TouchableOpacity
                    key={s}
                    onPress={() => { onSelect(isActive ? undefined : s); onClose(); }}
                    activeOpacity={0.75}
                    style={{
                      width: 52,
                      height: 40,
                      borderRadius: 10,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isActive ? colors.secondary : colors.muted + "30",
                      borderWidth: 1.5,
                      borderColor: isActive ? colors.secondary : "transparent",
                    }}
                  >
                    <AppText
                      style={{
                        fontSize: 13,
                        fontWeight: "700",
                        color: isActive ? "#fff" : colors.content,
                      }}
                    >
                      {s}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ─── CategoryChips ────────────────────────────────────────────────────────────

interface CategoryChipsProps {
  selected: TherapyCategory[];
  onToggle: (cat: TherapyCategory) => void;
  onClearAll: () => void;
  colors: Colors;
}

function CategoryChips({ selected, onToggle, onClearAll, colors }: CategoryChipsProps) {
  const allSelected = selected.length === 0;

  return (
    <View style={{ paddingBottom: 15 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingRight: 16 }}
      >
        {/* "Todos" chip */}
        <TouchableOpacity
          onPress={onClearAll}
          activeOpacity={0.7}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderRadius: 99,
            backgroundColor: allSelected ? colors.secondary : colors.surface,
            borderWidth: 1.5,
            borderColor: allSelected ? colors.secondary : colors.border,
            marginRight: 8,
          }}
        >
          <AppText
            style={{
              fontSize: 13,
              color: allSelected ? "#fff" : colors.subtle,
              fontWeight: allSelected ? "600" : "400",
            }}
          >
            Todos
          </AppText>
        </TouchableOpacity>

        {THERAPY_CATEGORIES.map((cat) => {
          const isActive = selected.includes(cat);
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => onToggle(cat)}
              activeOpacity={0.7}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 99,
                backgroundColor: isActive ? colors.secondary + "15" : colors.surface,
                borderWidth: 1.5,
                borderColor: isActive ? colors.secondary : colors.border,
                marginRight: 8,
              }}
            >
              <AppText
                style={{
                  fontSize: 13,
                  color: isActive ? colors.secondary : colors.subtle,
                  fontWeight: isActive ? "600" : "400",
                }}
              >
                {cat}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ─── ResultsCounter ───────────────────────────────────────────────────────────


// ─── AddPatientScreen ─────────────────────────────────────────────────────────

export function AddPatientScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState<string | undefined>(undefined);
  const [selectedCategories, setSelectedCategories] = useState<TherapyCategory[]>([]);
  const [stateModalOpen, setStateModalOpen] = useState(false);
  const [users, setUsers] = useState<UserToInvite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasActiveFilters = !!selectedState || selectedCategories.length > 0;

  const performSearch = useCallback(
    async (q: string, state?: string, cats?: TherapyCategory[]) => {
      setIsLoading(true);
      try {
        const results = await patientsService.searchUsersToInvite(
          q,
          state,
          cats && cats.length > 0 ? cats : undefined
        );
        setUsers(results);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      performSearch(searchQuery, selectedState, selectedCategories);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, selectedState, selectedCategories, performSearch]);

  const toggleCategory = (cat: TherapyCategory) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const clearAllFilters = () => {
    setSelectedState(undefined);
    setSelectedCategories([]);
  };

  const handleInvite = (user: UserToInvite) => {
    router.push(`/(protected)/service-contract?userId=${user.id}` as never);
  };

  const stateLabel = selectedState ? `Estado: ${selectedState}` : "Todos os estados";

  const listHeader = (
    <>

      {/* Category chips */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          marginBottom: 8,
        }}
      >
        <AppText style={{ fontSize: 12, fontWeight: "600", color: colors.subtle, letterSpacing: 0.4 }}>
          OBJETIVOS TERAPÊUTICOS
        </AppText>

      </View>
      <CategoryChips
        selected={selectedCategories}
        onToggle={toggleCategory}
        onClearAll={() => setSelectedCategories([])}
        colors={colors}
      />

      {/* Clear all — only when active */}
      {hasActiveFilters && (
        <View style={{ paddingHorizontal: 16, paddingTop: 4, paddingBottom: 8 }}>
          <TouchableOpacity
            onPress={clearAllFilters}
            activeOpacity={0.7}
            style={{
              alignSelf: "flex-start",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 99,
              backgroundColor: colors.error + "10",
              borderWidth: 1.5,
              borderColor: colors.error + "30",
              width: "100%"
            }}
          >
            <AppText style={{ fontSize: 12, textAlign: "center", color: colors.error, fontWeight: "600" }}>
              Limpar filtros
            </AppText>
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <TopBar
        title="Adicionar Paciente"
        onBackPress={() => router.back()}
        showMenu={false}
      />

      {/* filtros */}
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 }}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery("")}
          colors={colors}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 10,
            paddingBottom: 12,
          }}
        >
          <AppText variant="small" color="muted">
            {users.length === 1 ? "1 resultado" : `${users.length} resultados`}
          </AppText>
          <FilterChip
            label={stateLabel}
            isActive={!!selectedState}
            onPress={() => setStateModalOpen(true)}
            icon="location-outline"
            onRemove={() => setSelectedState(undefined)}
            colors={colors}
          />
        </View>
      </View>

      {/* State modal */}
      <StateFilterModal
        visible={stateModalOpen}
        selectedState={selectedState}
        onSelect={setSelectedState}
        onClose={() => setStateModalOpen(false)}
        colors={colors}
      />

      {/* Tudo abaixo do search rola */}
      {isLoading ? (
        <LoadingState message="Buscando usuários..." fullScreen />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={listHeader}
          renderItem={({ item }) => (
            <UserCard user={item} onInvite={() => handleInvite(item)} />
          )}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="items-center justify-center py-12 px-8">
              <Ionicons name="person-outline" size={48} color={colors.subtle} />
              <AppText variant="heading3" color="muted" className="text-center mt-4 mb-2">
                Nenhum usuário encontrado
              </AppText>
              <AppText variant="body" color="muted" className="text-center">
                Tente ajustar os filtros ou buscar por outro termo.
              </AppText>
            </View>
          }
        />
      )}
    </View>
  );
}

// ─── UserCard ─────────────────────────────────────────────────────────────────

interface UserCardProps {
  user: UserToInvite;
  onInvite: () => void;
}

function UserCard({ user, onInvite }: UserCardProps) {
  const { colors } = useTheme();
  return (
    <AppCard style={{ marginBottom: 12, marginHorizontal: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
        {/* Avatar */}
        <View
          style={{
            width: 46,
            height: 46,
            borderRadius: 23,
            backgroundColor: colors.secondary + "20",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <AppText style={{ color: colors.secondary, fontWeight: "700", fontSize: 16 }}>
            {getInitials(user.name)}
          </AppText>
        </View>

        <View style={{ flex: 1 }}>
          <AppText variant="bodyMedium" style={{ fontWeight: "700", color: colors.content }}>
            {user.name}
          </AppText>
          <AppText variant="small" color="muted">
            @{user.username} · {user.age} anos
          </AppText>
          <AppText variant="caption" color="muted">
            {user.city}, {user.state}
          </AppText>
        </View>
      </View>

      {/* Main complaint */}
      <View style={{ marginTop: 10 }}>
        <AppText variant="small" color="muted" numberOfLines={2}>
          {user.mainComplaint}
        </AppText>
      </View>

      {/* Categories */}
      <View style={{ marginTop: 8, flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
        {user.categories.map((cat) => (
          <View
            key={cat}
            style={{
              backgroundColor: colors.secondary + "12",
              borderRadius: 99,
              paddingHorizontal: 10,
              paddingVertical: 3,
              borderWidth: 1,
              borderColor: colors.secondary + "25",
            }}
          >
            <AppText variant="caption" style={{ color: colors.secondary, fontWeight: "600" }}>
              {cat}
            </AppText>
          </View>
        ))}
      </View>

      {/* Invite button */}
      <TouchableOpacity
        onPress={onInvite}
        activeOpacity={0.8}
        style={{
          marginTop: 14,
          backgroundColor: colors.secondary,
          borderRadius: 12,
          paddingVertical: 11,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          gap: 7,
          shadowColor: colors.secondary,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.25,
          shadowRadius: 6,
          elevation: 3,
        }}
      >
        <Ionicons name="paper-plane-outline" size={16} color="#fff" />
        <AppText style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
          Enviar solicitação
        </AppText>
      </TouchableOpacity>
    </AppCard>
  );
}
