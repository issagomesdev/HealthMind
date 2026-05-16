import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TopBar } from "../../../components/navigation/TopBar";
import { AppText } from "../../../components/ui/AppText";
import { AppCard } from "../../../components/ui/AppCard";
import { LoadingState } from "../../../components/ui/LoadingState";
import { DiaryMoodBadge, getMoodColor } from "../../../components/professional/patients/DiaryMoodBadge";
import { useTheme } from "../../../../core/theme";
import { patientDiaryService } from "../../../../services/patients/patientDiaryService";
import { DiaryRecord } from "../../../../types/patient";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <AppCard>
      <AppText
        style={{
          fontSize: 11,
          fontWeight: "700",
          color: colors.subtle,
          letterSpacing: 0.8,
          marginBottom: 12,
        }}
      >
        {title}
      </AppText>
      {children}
    </AppCard>
  );
}

function TagRow({ items, color }: { items: string[]; color: string }) {
  const { colors } = useTheme();
  if (items.length === 0) {
    return <AppText style={{ fontSize: 13, color: colors.subtle }}>Nenhum</AppText>;
  }
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
      {items.map((item, i) => (
        <View
          key={i}
          style={{
            backgroundColor: color + "18",
            borderRadius: 99,
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
        >
          <AppText style={{ fontSize: 12, color, fontWeight: "600" }}>{item}</AppText>
        </View>
      ))}
    </View>
  );
}

export function PatientDiaryDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();

  const [record, setRecord] = useState<DiaryRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showObsModal, setShowObsModal] = useState(false);
  const [obsText, setObsText] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    patientDiaryService.getDiaryById(id).then((r) => {
      setRecord(r);
      setObsText(r?.professionalObservation ?? "");
      setIsLoading(false);
    });
  }, [id]);

  const handleSaveObservation = async () => {
    if (!record || !obsText.trim()) return;
    setIsSaving(true);
    const updated = await patientDiaryService.addProfessionalObservation(record.id, obsText.trim());
    setRecord(updated);
    setIsSaving(false);
    setShowObsModal(false);
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        <TopBar title="Registro do Diário" onBackPress={() => router.back()} showMenu={false} />
        <LoadingState message="Carregando registro..." fullScreen />
      </View>
    );
  }

  if (!record) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        <TopBar title="Registro do Diário" onBackPress={() => router.back()} showMenu={false} />
        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="journal-outline" size={48} color={colors.subtle} />
          <AppText style={{ color: colors.subtle, marginTop: 12, textAlign: "center" }}>
            Registro não encontrado
          </AppText>
        </View>
      </View>
    );
  }

  const moodColor = getMoodColor(record.mood);
  const recordedDate = new Date(record.recordedAt).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <TopBar title="Registro do Diário" onBackPress={() => router.back()} showMenu={false} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 48, gap: 12 }}
      >
        {/* Header card */}
        <AppCard>
          <View style={{ gap: 10 }}>
            <AppText style={{ fontSize: 13, color: colors.subtle }}>{recordedDate}</AppText>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <DiaryMoodBadge mood={record.moodLabel} moodScore={record.mood} />
              {!record.sharedWithProfessional && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    backgroundColor: colors.muted + "40",
                    borderRadius: 99,
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                  }}
                >
                  <Ionicons name="lock-closed-outline" size={12} color={colors.subtle} />
                  <AppText style={{ fontSize: 12, color: colors.subtle, fontWeight: "600" }}>Privado</AppText>
                </View>
              )}
            </View>

            {/* Intensity bar */}
            <View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 6 }}>
                <AppText style={{ fontSize: 12, color: colors.subtle }}>Intensidade emocional</AppText>
                <AppText style={{ fontSize: 12, fontWeight: "700", color: moodColor }}>
                  {record.emotionalIntensity}/10
                </AppText>
              </View>
              <View style={{ height: 6, backgroundColor: colors.border, borderRadius: 99, overflow: "hidden" }}>
                <View
                  style={{
                    height: "100%",
                    width: `${(record.emotionalIntensity / 10) * 100}%` as `${number}%`,
                    backgroundColor: moodColor,
                    borderRadius: 99,
                  }}
                />
              </View>
            </View>
          </View>
        </AppCard>

        {/* Alert */}
        {record.hasAlert && record.alertMessage && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              gap: 8,
              backgroundColor: "#EF444415",
              borderRadius: 12,
              padding: 14,
              borderWidth: 1,
              borderColor: "#EF444440",
            }}
          >
            <Ionicons name="warning-outline" size={18} color="#EF4444" style={{ marginTop: 1 }} />
            <View style={{ flex: 1, gap: 2 }}>
              <AppText style={{ fontSize: 13, fontWeight: "700", color: "#EF4444" }}>Alerta detectado</AppText>
              <AppText style={{ fontSize: 13, color: "#EF4444", lineHeight: 18 }}>{record.alertMessage}</AppText>
            </View>
          </View>
        )}

        {/* Emotions */}
        <Section title="EMOÇÕES RELATADAS">
          <TagRow items={record.emotions} color={colors.secondary} />
        </Section>

        {/* Full text */}
        <Section title="RELATO COMPLETO">
          <AppText style={{ fontSize: 14, color: colors.content, lineHeight: 22 }}>
            {record.fullText}
          </AppText>
        </Section>

        {/* Triggers */}
        <Section title="GATILHOS MENCIONADOS">
          <TagRow items={record.triggers} color="#F59E0B" />
        </Section>

        {/* Recurring thoughts */}
        <Section title="PENSAMENTOS RECORRENTES">
          {record.recurringThoughts.length === 0 ? (
            <AppText style={{ fontSize: 13, color: colors.subtle }}>Nenhum relatado</AppText>
          ) : (
            <View style={{ gap: 6 }}>
              {record.recurringThoughts.map((thought, i) => (
                <View key={i} style={{ flexDirection: "row", gap: 8, alignItems: "flex-start" }}>
                  <AppText style={{ color: colors.secondary, fontWeight: "700", fontSize: 14 }}>"</AppText>
                  <AppText style={{ fontSize: 13, color: colors.content, flex: 1, fontStyle: "italic", lineHeight: 19 }}>
                    {thought}
                  </AppText>
                </View>
              ))}
            </View>
          )}
        </Section>

        {/* Emotion tags */}
        <Section title="TAGS EMOCIONAIS">
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            {record.emotionTags.map((tag) => (
              <View
                key={tag}
                style={{
                  backgroundColor: colors.muted + "60",
                  borderRadius: 99,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <AppText style={{ fontSize: 12, color: colors.subtle }}>#{tag}</AppText>
              </View>
            ))}
          </View>
        </Section>

        {/* App notes */}
        {record.appNotes !== "" && (
          <Section title="ANÁLISE DO APP">
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 8,
                backgroundColor: colors.secondary + "12",
                borderRadius: 10,
                padding: 12,
              }}
            >
              <Ionicons name="sparkles-outline" size={16} color={colors.secondary} style={{ marginTop: 1 }} />
              <AppText style={{ fontSize: 13, color: colors.secondary, flex: 1, lineHeight: 19 }}>
                {record.appNotes}
              </AppText>
            </View>
          </Section>
        )}

        {/* Professional observation */}
        <Section title="OBSERVAÇÃO PROFISSIONAL">
          {record.professionalObservation ? (
            <View style={{ gap: 10 }}>
              <AppText style={{ fontSize: 14, color: colors.content, lineHeight: 21 }}>
                {record.professionalObservation}
              </AppText>
              <TouchableOpacity
                onPress={() => {
                  setObsText(record.professionalObservation ?? "");
                  setShowObsModal(true);
                }}
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Ionicons name="pencil-outline" size={14} color={colors.secondary} />
                <AppText style={{ fontSize: 13, color: colors.secondary, fontWeight: "600" }}>Editar observação</AppText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => { setObsText(""); setShowObsModal(true); }}
              activeOpacity={0.8}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                backgroundColor: colors.secondary + "15",
                borderRadius: 12,
                paddingVertical: 14,
                borderWidth: 1.5,
                borderColor: colors.secondary + "40",
                borderStyle: "dashed",
              }}
            >
              <Ionicons name="add-circle-outline" size={18} color={colors.secondary} />
              <AppText style={{ fontSize: 14, color: colors.secondary, fontWeight: "600" }}>
                Adicionar observação profissional
              </AppText>
            </TouchableOpacity>
          )}
        </Section>
      </ScrollView>

      {/* Observation Modal */}
      <Modal
        visible={showObsModal}
        transparent
        animationType="slide"
        onRequestClose={() => !isSaving && setShowObsModal(false)}
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
            <AppText style={{ fontSize: 17, fontWeight: "700", color: colors.content }}>
              Observação profissional
            </AppText>
            <TextInput
              value={obsText}
              onChangeText={setObsText}
              placeholder="Escreva sua observação sobre este registro..."
              placeholderTextColor={colors.subtle}
              multiline
              numberOfLines={5}
              style={{
                backgroundColor: colors.muted + "40",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                padding: 14,
                color: colors.content,
                fontSize: 14,
                minHeight: 120,
                textAlignVertical: "top",
              }}
            />
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                onPress={() => setShowObsModal(false)}
                disabled={isSaving}
                style={{
                  flex: 1,
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: "center",
                  borderWidth: 1.5,
                  borderColor: colors.border,
                }}
              >
                <AppText style={{ color: colors.subtle, fontWeight: "600" }}>Cancelar</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSaveObservation}
                disabled={!obsText.trim() || isSaving}
                style={{
                  flex: 1,
                  borderRadius: 12,
                  paddingVertical: 14,
                  alignItems: "center",
                  backgroundColor: colors.secondary,
                  opacity: !obsText.trim() || isSaving ? 0.6 : 1,
                }}
              >
                {isSaving ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <AppText style={{ color: "#fff", fontWeight: "700" }}>Salvar</AppText>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
