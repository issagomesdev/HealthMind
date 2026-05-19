import React, { useState } from "react";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TopBar } from "../../../components/navigation/TopBar";
import { AppText } from "../../../components/ui/AppText";
import { ConfirmActionModal } from "../../../components/ui/ConfirmActionModal";
import { ObservationPriorityBadge } from "../../../components/professional/patients/ObservationPriorityBadge";
import { useTheme } from "../../../../core/theme";
import { patientObservationService } from "../../../../services/patients/patientObservationService";
import { ObservationCategory, ObservationPriority } from "../../../../types/patient";

const CATEGORIES: ObservationCategory[] = [
  "Evolução",
  "Sessão",
  "Alerta",
  "Plano terapêutico",
  "Comportamento",
  "Pagamento",
  "Geral",
];

const PRIORITIES: ObservationPriority[] = ["Baixa", "Média", "Alta", "Urgente"];

const CATEGORY_COLORS: Record<ObservationCategory, string> = {
  Evolução:          "#6DBF7B",
  Sessão:            "#60A5FA",
  Alerta:            "#EF4444",
  "Plano terapêutico": "#6B7EF5",
  Comportamento:     "#F59E0B",
  Pagamento:         "#9CA3AF",
  Geral:             "#C084FC",
};

function ChipOption<T extends string>({
  label,
  value,
  selected,
  onPress,
  color,
}: {
  label: string;
  value: T;
  selected: boolean;
  onPress: (v: T) => void;
  color?: string;
}) {
  const { colors } = useTheme();
  const activeColor = color ?? colors.secondary;
  return (
    <TouchableOpacity
      onPress={() => onPress(value)}
      activeOpacity={0.75}
      style={{
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 99,
        backgroundColor: selected ? activeColor : colors.muted + "50",
        borderWidth: selected ? 0 : 1,
        borderColor: colors.border,
      }}
    >
      <AppText style={{ fontSize: 13, fontWeight: "600", color: selected ? "#fff" : colors.subtle }}>
        {label}
      </AppText>
    </TouchableOpacity>
  );
}

export function AddPatientObservationScreen() {
  const router = useRouter();
  const { patientId, patientName } = useLocalSearchParams<{ patientId: string; patientName: string }>();
  const { colors } = useTheme();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ObservationCategory>("Geral");
  const [priority, setPriority] = useState<ObservationPriority>("Média");
  const [fullText, setFullText] = useState("");
  const [tagsRaw, setTagsRaw] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [isImportant, setIsImportant] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const canSave = title.trim().length > 0 && fullText.trim().length > 0;

  const handleSave = async () => {
    if (!patientId || !canSave) return;
    setIsSaving(true);
    const tags = tagsRaw
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    await patientObservationService.createObservation(
      patientId,
      decodeURIComponent(patientName ?? ""),
      { title: title.trim(), category, priority, fullText: fullText.trim(), tags, isPrivate, isImportant }
    );
    setIsSaving(false);
    setShowSuccess(true);
  };

  const handleSuccessConfirm = () => {
    setShowSuccess(false);
    router.back();
  };

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <TopBar
        title="Nova Observação"
        onBackPress={() => router.back()}
        showMenu={false}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 60, gap: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Title */}
        <View style={{ gap: 6 }}>
          <AppText style={{ fontSize: 13, fontWeight: "600", color: colors.subtle }}>
            TÍTULO <AppText style={{ color: colors.error }}>*</AppText>
          </AppText>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Ex: Progresso nas técnicas de TCC"
            placeholderTextColor={colors.subtle}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: title.length > 0 ? colors.secondary + "60" : colors.border,
              padding: 14,
              color: colors.content,
              fontSize: 15,
            }}
          />
        </View>

        {/* Category */}
        <View style={{ gap: 10 }}>
          <AppText style={{ fontSize: 13, fontWeight: "600", color: colors.subtle }}>CATEGORIA</AppText>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {CATEGORIES.map((cat) => (
              <ChipOption
                key={cat}
                label={cat}
                value={cat}
                selected={category === cat}
                onPress={setCategory}
                color={CATEGORY_COLORS[cat]}
              />
            ))}
          </View>
        </View>

        {/* Priority */}
        <View style={{ gap: 10 }}>
          <AppText style={{ fontSize: 13, fontWeight: "600", color: colors.subtle }}>PRIORIDADE</AppText>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {PRIORITIES.map((prio) => (
              <ChipOption
                key={prio}
                label={prio}
                value={prio}
                selected={priority === prio}
                onPress={setPriority}
                color={prio === "Urgente" ? "#EF4444" : prio === "Alta" ? "#F59E0B" : prio === "Média" ? "#60A5FA" : "#6DBF7B"}
              />
            ))}
          </View>
        </View>

        {/* Full text */}
        <View style={{ gap: 6 }}>
          <AppText style={{ fontSize: 13, fontWeight: "600", color: colors.subtle }}>
            TEXTO COMPLETO <AppText style={{ color: colors.error }}>*</AppText>
          </AppText>
          <TextInput
            value={fullText}
            onChangeText={setFullText}
            placeholder="Descreva detalhadamente sua observação clínica..."
            placeholderTextColor={colors.subtle}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: fullText.length > 0 ? colors.secondary + "60" : colors.border,
              padding: 14,
              color: colors.content,
              fontSize: 15,
              minHeight: 140,
            }}
          />
        </View>

        {/* Tags */}
        <View style={{ gap: 6 }}>
          <AppText style={{ fontSize: 13, fontWeight: "600", color: colors.subtle }}>
            TAGS <AppText style={{ fontSize: 11, color: colors.subtle, fontWeight: "400" }}>(separadas por vírgula)</AppText>
          </AppText>
          <TextInput
            value={tagsRaw}
            onChangeText={setTagsRaw}
            placeholder="Ex: progresso, tcc, ansiedade"
            placeholderTextColor={colors.subtle}
            style={{
              backgroundColor: colors.surface,
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: colors.border,
              padding: 14,
              color: colors.content,
              fontSize: 15,
            }}
          />
        </View>

        {/* Toggles */}
        <View
          style={{
            backgroundColor: colors.surface,
            borderRadius: 16,
            padding: 16,
            gap: 0,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: colors.border,
            }}
          >
            <View style={{ gap: 2 }}>
              <AppText style={{ fontSize: 15, fontWeight: "600", color: colors.content }}>
                Observação privada
              </AppText>
              <AppText style={{ fontSize: 12, color: colors.subtle }}>
                Visível apenas para você
              </AppText>
            </View>
            <Switch
              value={isPrivate}
              onValueChange={setIsPrivate}
              trackColor={{ false: colors.border, true: colors.secondary }}
              thumbColor="#fff"
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingVertical: 12,
            }}
          >
            <View style={{ gap: 2 }}>
              <AppText style={{ fontSize: 15, fontWeight: "600", color: colors.content }}>
                Marcar como importante
              </AppText>
              <AppText style={{ fontSize: 12, color: colors.subtle }}>
                Destaque especial na lista
              </AppText>
            </View>
            <Switch
              value={isImportant}
              onValueChange={setIsImportant}
              trackColor={{ false: colors.border, true: "#F59E0B" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Save button */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={!canSave || isSaving}
          activeOpacity={0.85}
          style={{
            backgroundColor: colors.secondary,
            borderRadius: 14,
            paddingVertical: 16,
            alignItems: "center",
            opacity: !canSave ? 0.5 : 1,
            shadowColor: colors.secondary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <AppText style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>
              Salvar observação
            </AppText>
          )}
        </TouchableOpacity>
      </ScrollView>

      <ConfirmActionModal
        visible={showSuccess}
        onConfirm={handleSuccessConfirm}
        onCancel={handleSuccessConfirm}
        icon="checkmark-circle-outline"
        iconColor="#6DBF7B"
        confirmColor="#6DBF7B"
        title="Observação salva!"
        confirmLabel="Voltar para a lista"
        cancelLabel={false}
        description="Sua observação foi registrada com sucesso."
      />
    </View>
  );
}
