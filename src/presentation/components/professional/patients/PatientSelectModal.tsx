import React, { useState, useEffect } from "react";
import {
  View,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../ui/AppText";
import { useTheme } from "../../../../core/theme";
import { patientsService } from "../../../../services/patients/PatientsService";
import { ProfessionalPatient } from "../../../../types/patient";

interface PatientSelectModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectPatient: (patient: ProfessionalPatient) => void;
}

export function PatientSelectModal({
  visible,
  onClose,
  onSelectPatient,
}: PatientSelectModalProps) {
  const { colors } = useTheme();
  const [query, setQuery] = useState("");
  const [patients, setPatients] = useState<ProfessionalPatient[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!visible) return;
    setQuery("");
    setLoading(true);
    patientsService.getProfessionalPatients().then((data) => {
      setPatients(data.filter((p) => p.status !== "pending"));
      setLoading(false);
    });
  }, [visible]);

  const q = query.toLowerCase().trim();
  const filtered =
    q.length === 0
      ? patients
      : patients.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.email.toLowerCase().includes(q) ||
            p.username.toLowerCase().includes(q)
        );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View
        style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}
      >
        <View
          style={{
            backgroundColor: colors.background,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: "80%",
            paddingBottom: 32,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <View style={{ flex: 1, gap: 2 }}>
              <AppText variant="heading3" className="font-bold">
                Selecionar paciente
              </AppText>
              <AppText variant="small" color="muted">
                Escolha um paciente para adicionar uma observação rápida.
              </AppText>
            </View>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7} style={{ paddingLeft: 12 }}>
              <Ionicons name="close" size={24} color={colors.subtle} />
            </TouchableOpacity>
          </View>

          {/* Search input */}
          <View style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                backgroundColor: colors.muted,
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 10,
              }}
            >
              <Ionicons name="search-outline" size={18} color={colors.subtle} />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Nome, e-mail ou username"
                placeholderTextColor={colors.subtle}
                style={{ flex: 1, color: colors.content, fontSize: 15 }}
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery("")} activeOpacity={0.7}>
                  <Ionicons name="close-circle" size={18} color={colors.subtle} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Content */}
          {loading ? (
            <View style={{ padding: 40, alignItems: "center" }}>
              <ActivityIndicator color={colors.secondary} />
            </View>
          ) : filtered.length === 0 ? (
            <View style={{ padding: 40, alignItems: "center", gap: 8 }}>
              <Ionicons name="person-outline" size={32} color={colors.subtle} />
              <AppText color="muted" className="text-center">
                Nenhum paciente encontrado.
              </AppText>
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={(p) => p.id}
              style={{ paddingHorizontal: 20 }}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => onSelectPatient(item)}
                  activeOpacity={0.7}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}
                >
                  <View
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 21,
                      backgroundColor: colors.secondary + "22",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <AppText
                      style={{ fontSize: 14, fontWeight: "700", color: colors.secondary }}
                    >
                      {item.name
                        .split(" ")
                        .slice(0, 2)
                        .map((w) => w[0]?.toUpperCase() ?? "")
                        .join("")}
                    </AppText>
                  </View>
                  <View style={{ flex: 1, gap: 1 }}>
                    <AppText variant="bodyMedium" className="font-semibold">
                      {item.name}
                    </AppText>
                    <AppText variant="small" color="muted" numberOfLines={1}>
                      {item.mainComplaint}
                    </AppText>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.subtle} />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
