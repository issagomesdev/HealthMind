import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TopBar } from "../../../components/navigation/TopBar";
import { AppText } from "../../../components/ui/AppText";
import { AppCard } from "../../../components/ui/AppCard";
import { LoadingState } from "../../../components/ui/LoadingState";
import { ConfirmActionModal } from "../../../components/ui/ConfirmActionModal";
import { ObservationPriorityBadge } from "../../../components/professional/patients/ObservationPriorityBadge";
import { useTheme } from "../../../../core/theme";
import { patientObservationService } from "../../../../services/patients/patientObservationService";
import { PatientObservation } from "../../../../types/patient";

const CATEGORY_COLORS: Record<string, string> = {
  Evolução:          "#6DBF7B",
  Sessão:            "#60A5FA",
  Alerta:            "#EF4444",
  "Plano terapêutico": "#6B7EF5",
  Comportamento:     "#F59E0B",
  Pagamento:         "#9CA3AF",
  Geral:             "#C084FC",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <AppCard>
      <AppText style={{ fontSize: 11, fontWeight: "700", color: colors.subtle, letterSpacing: 0.8, marginBottom: 12 }}>
        {title}
      </AppText>
      {children}
    </AppCard>
  );
}

export function PatientObservationDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();

  const [observation, setObservation] = useState<PatientObservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPinning, setIsPinning] = useState(false);

  useEffect(() => {
    if (!id) return;
    patientObservationService.getObservationById(id).then((o) => {
      setObservation(o);
      setIsLoading(false);
    });
  }, [id]);

  const handleDelete = async () => {
    if (!observation) return;
    setIsDeleting(true);
    await patientObservationService.deleteObservation(observation.id);
    setIsDeleting(false);
    setShowDeleteConfirm(false);
    router.back();
  };

  const handleTogglePin = async () => {
    if (!observation) return;
    setIsPinning(true);
    await patientObservationService.togglePin(observation.id);
    const updated = await patientObservationService.getObservationById(observation.id);
    setObservation(updated);
    setIsPinning(false);
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        <TopBar title="Observação" onBackPress={() => router.back()} showMenu={false} />
        <LoadingState message="Carregando..." fullScreen />
      </View>
    );
  }

  if (!observation) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        <TopBar title="Observação" onBackPress={() => router.back()} showMenu={false} />
        <View className="flex-1 items-center justify-center">
          <Ionicons name="pencil-outline" size={48} color={colors.subtle} />
          <AppText style={{ color: colors.subtle, marginTop: 12 }}>Observação não encontrada</AppText>
        </View>
      </View>
    );
  }

  const catColor = CATEGORY_COLORS[observation.category] ?? colors.secondary;
  const createdDate = new Date(observation.createdAt).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <TopBar
        title="Observação"
        onBackPress={() => router.back()}
        showMenu={false}
        rightAction={
          <TouchableOpacity
            onPress={handleTogglePin}
            disabled={isPinning}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: observation.isPinned ? colors.secondary + "20" : colors.muted + "50",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons
              name={observation.isPinned ? "pin" : "pin-outline"}
              size={18}
              color={observation.isPinned ? colors.secondary : colors.subtle}
            />
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 48, gap: 12 }}
      >
        {/* Header */}
        <AppCard>
          <View style={{ gap: 10 }}>
            {observation.isPinned && (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                <Ionicons name="pin-outline" size={13} color={colors.secondary} />
                <AppText style={{ fontSize: 11, color: colors.secondary, fontWeight: "600" }}>Fixada</AppText>
              </View>
            )}
            <AppText style={{ fontSize: 18, fontWeight: "800", color: colors.content, lineHeight: 24 }}>
              {observation.title}
            </AppText>
            <AppText style={{ fontSize: 12, color: colors.subtle }}>{createdDate}</AppText>

            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <View style={{ backgroundColor: catColor + "18", borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 }}>
                <AppText style={{ fontSize: 12, color: catColor, fontWeight: "600" }}>{observation.category}</AppText>
              </View>
              <ObservationPriorityBadge priority={observation.priority} />
              {observation.isPrivate && (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: colors.muted + "40", borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Ionicons name="lock-closed-outline" size={12} color={colors.subtle} />
                  <AppText style={{ fontSize: 12, color: colors.subtle, fontWeight: "600" }}>Privada</AppText>
                </View>
              )}
              {observation.isImportant && (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#F59E0B15", borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Ionicons name="star-outline" size={12} color="#F59E0B" />
                  <AppText style={{ fontSize: 12, color: "#F59E0B", fontWeight: "600" }}>Importante</AppText>
                </View>
              )}
            </View>
          </View>
        </AppCard>

        {/* Full text */}
        <Section title="TEXTO COMPLETO">
          <AppText style={{ fontSize: 14, color: colors.content, lineHeight: 22 }}>
            {observation.fullText}
          </AppText>
        </Section>

        {/* Tags */}
        {observation.tags.length > 0 && (
          <Section title="TAGS">
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {observation.tags.map((tag) => (
                <View
                  key={tag}
                  style={{ backgroundColor: colors.muted + "60", borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 }}
                >
                  <AppText style={{ fontSize: 12, color: colors.subtle }}>#{tag}</AppText>
                </View>
              ))}
            </View>
          </Section>
        )}

        {/* Meta */}
        <Section title="DETALHES">
          <View style={{ gap: 8 }}>
            {[
              { label: "Autor", value: observation.authorName },
              { label: "Paciente", value: observation.patientName },
              { label: "Visibilidade", value: observation.isPrivate ? "Privada (somente você)" : "Compartilhada" },
            ].map(({ label, value }) => (
              <View key={label} style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <AppText style={{ fontSize: 13, color: colors.subtle }}>{label}</AppText>
                <AppText style={{ fontSize: 13, color: colors.content, fontWeight: "500" }}>{value}</AppText>
              </View>
            ))}
          </View>
        </Section>

        {/* Actions */}
        <TouchableOpacity
          onPress={() => setShowDeleteConfirm(true)}
          activeOpacity={0.8}
          style={{
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: "center",
            backgroundColor: colors.error + "15",
            borderWidth: 1.5,
            borderColor: colors.error + "40",
          }}
        >
          <AppText style={{ color: colors.error, fontWeight: "700", fontSize: 15 }}>
            Excluir observação
          </AppText>
        </TouchableOpacity>
      </ScrollView>

      <ConfirmActionModal
        visible={showDeleteConfirm}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isLoading={isDeleting}
        icon="trash-outline"
        iconColor={colors.error}
        confirmColor={colors.error}
        title="Excluir observação?"
        confirmLabel="Sim, excluir"
        cancelLabel="Cancelar"
        description="Esta ação não pode ser desfeita. A observação será removida permanentemente."
      />
    </View>
  );
}
