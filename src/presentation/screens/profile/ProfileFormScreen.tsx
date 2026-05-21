import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../components/ui/AppText";
import { AppInput } from "../../components/ui/AppInput";
import { AppCard } from "../../components/ui/AppCard";
import { SelectField, SelectOption } from "../../components/forms/SelectField";
import { TopBar } from "../../components/navigation/TopBar";
import { useTheme } from "../../../core/theme";
import { useAuth } from "../../../core/auth/AuthContext";
import { GenderType, RegisterType } from "../../../core/types";
import { usePatientProfileForm, useProfessionalProfileForm } from "../../../hooks/useProfileForm";
import { AppHeader } from "../../components/ui/AppHeader";
import { ConfirmActionModal } from "../../components/ui/ConfirmActionModal";

// ─── Masks ────────────────────────────────────────────────────────────────────

function maskPhone(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (!d.length) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function maskCpf(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function maskDate(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

function maskCep(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

function maskCurrency(v: string): string {
  const digits = v.replace(/\D/g, "").slice(0, 10);
  if (!digits.length) return "";
  const num = parseInt(digits, 10) / 100;
  return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GENDER_OPTIONS: SelectOption[] = [
  { value: "female", label: "Feminino" },
  { value: "male", label: "Masculino" },
  { value: "non_binary", label: "Não-binário" },
  { value: "other", label: "Outro" },
  { value: "prefer_not_to_say", label: "Prefiro não informar" },
];

const UF_OPTIONS: SelectOption[] = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
].map((uf) => ({ value: uf, label: uf }));

const APPROACH_OPTIONS: SelectOption[] = [
  { value: "TCC", label: "TCC — Terapia Cognitivo-Comportamental" },
  { value: "Psicanálise", label: "Psicanálise" },
  { value: "Humanista", label: "Humanista" },
  { value: "Gestalt", label: "Gestalt" },
  { value: "EMDR", label: "EMDR" },
  { value: "DBT", label: "DBT — Terapia Dialético-Comportamental" },
  { value: "ACT", label: "ACT — Aceitação e Compromisso" },
  { value: "Sistêmica", label: "Sistêmica" },
  { value: "Outro", label: "Outro" },
];

const REGISTER_TYPE_OPTIONS: { value: RegisterType; label: string }[] = [
  { value: "CRP", label: "CRP" },
  { value: "CRM", label: "CRM" },
  { value: "OTHER", label: "Outro" },
];

const EMERGENCY_RELATION_OPTIONS: SelectOption[] = [
  { value: "Cônjuge/Parceiro(a)", label: "Cônjuge / Parceiro(a)" },
  { value: "Pai/Mãe", label: "Pai / Mãe" },
  { value: "Filho(a)", label: "Filho(a)" },
  { value: "Irmão/Irmã", label: "Irmão / Irmã" },
  { value: "Amigo(a)", label: "Amigo(a)" },
  { value: "Outro", label: "Outro" },
];

const THERAPY_GOALS = [
  "Reduzir ansiedade",
  "Melhorar autoestima",
  "Lidar com relacionamentos",
  "Superar trauma",
  "Desenvolvimento pessoal",
  "Equilíbrio emocional",
  "Gestão do estresse",
  "Melhorar o sono",
  "Foco e produtividade",
];

// ─── Shared sub-components ───────────────────────────────────────────────────

function SectionCard({
  title,
  icon,
  children,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-2 px-1">
        <Ionicons name={icon} size={16} color={colors.secondary} />
        <AppText variant="bodyMedium" className="font-bold" color="secondary">
          {title}
        </AppText>
      </View>
      <AppCard className="gap-4">{children}</AppCard>
    </View>
  );
}

function YesNoToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  const { colors } = useTheme();
  return (
    <View className="gap-2">
      <AppText variant="bodyMedium" className="font-medium">{label}</AppText>
      <View className="flex-row gap-3">
        {([true, false] as const).map((v) => (
          <TouchableOpacity
            key={String(v)}
            onPress={() => onChange(v)}
            activeOpacity={0.8}
            className="flex-1 py-3 rounded-xl border items-center"
            style={{
              backgroundColor: value === v ? colors.secondary : colors.surface,
              borderColor: value === v ? colors.secondary : colors.border,
            }}
          >
            <AppText
              variant="bodyMedium"
              style={{
                color: value === v ? "#fff" : colors.subtle,
                fontWeight: value === v ? "600" : "400",
              }}
            >
              {v ? "Sim" : "Não"}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

function MultiChips({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  const { colors } = useTheme();
  return (
    <View className="gap-2">
      <AppText variant="label" color="muted" className="uppercase tracking-[0.8px]">
        {label}
      </AppText>
      <View className="flex-row flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <TouchableOpacity
              key={opt}
              onPress={() => onToggle(opt)}
              activeOpacity={0.8}
              className="px-3 py-2 rounded-full border"
              style={{
                backgroundColor: active ? colors.secondary : colors.surface,
                borderColor: active ? colors.secondary : colors.border,
              }}
            >
              <AppText
                variant="small"
                style={{
                  color: active ? "#fff" : colors.subtle,
                  fontWeight: active ? "600" : "400",
                }}
              >
                {active ? `✓ ${opt}` : opt}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function MedicationField({
  medications,
  onChange,
}: {
  medications: string[];
  onChange: (v: string[]) => void;
}) {
  const { colors } = useTheme();
  const [input, setInput] = useState("");

  const add = () => {
    const t = input.trim();
    if (!t || medications.includes(t)) return;
    onChange([...medications, t]);
    setInput("");
  };

  const remove = (med: string) => onChange(medications.filter((m) => m !== med));

  return (
    <View className="gap-2">
      <AppText variant="label" color="muted" className="uppercase tracking-[0.8px]">
        Medicamentos em uso (opcional)
      </AppText>
      <View className="flex-row gap-2">
        <View
          className="flex-1 flex-row items-center rounded-xl border min-h-[52px] px-3.5 border-border dark:border-border-dark"
          style={{ backgroundColor: colors.background }}
        >
          <Ionicons name="medkit-outline" size={18} color={colors.subtle} style={{ marginRight: 10 }} />
          <TextInput
            className="flex-1 text-[15px] py-3.5 text-content dark:text-content-dark"
            placeholder="Ex: Fluoxetina 20mg"
            placeholderTextColor={colors.subtle}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={add}
            returnKeyType="done"
            blurOnSubmit={false}
          />
        </View>
        <TouchableOpacity
          onPress={add}
          activeOpacity={0.8}
          style={{
            height: 52,
            paddingHorizontal: 16,
            borderRadius: 12,
            backgroundColor: colors.secondary,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AppText variant="smallMedium" style={{ color: "#fff", fontWeight: "600" }}>
            Adicionar
          </AppText>
        </TouchableOpacity>
      </View>
      {medications.length > 0 && (
        <View className="flex-row flex-wrap gap-2 mt-1">
          {medications.map((med) => (
            <View
              key={med}
              className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full border"
              style={{
                backgroundColor: colors.secondary + "12",
                borderColor: colors.secondary + "40",
              }}
            >
              <AppText variant="small" style={{ color: colors.secondary, fontWeight: "500" }}>
                {med}
              </AppText>
              <TouchableOpacity
                onPress={() => remove(med)}
                hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={16} color={colors.secondary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Address section ──────────────────────────────────────────────────────────

interface AddressProps {
  cep: string;
  setCep: (v: string) => void;
  addressStreet: string;
  setAddressStreet: (v: string) => void;
  addressNumber: string;
  setAddressNumber: (v: string) => void;
  addressComplement: string;
  setAddressComplement: (v: string) => void;
  addressNeighborhood: string;
  setAddressNeighborhood: (v: string) => void;
  addressCity: string;
  setAddressCity: (v: string) => void;
  addressUf: string;
  setAddressUf: (v: string) => void;
  isLookingUpCep: boolean;
  cepError: string | null;
  lookupCep: (cep: string) => void;
}

function AddressSection(props: AddressProps) {
  const { colors } = useTheme();

  const handleCepChange = (v: string) => {
    const masked = maskCep(v);
    props.setCep(masked);
    if (masked.replace(/\D/g, "").length === 8) {
      props.lookupCep(masked);
    }
  };

  return (
    <SectionCard title="Endereço" icon="location-outline">
      {/* CEP */}
      <View className="gap-1.5">
        <AppText variant="label" color="muted" className="uppercase tracking-[0.8px]">CEP</AppText>
        <View
          className="flex-row items-center rounded-xl border min-h-[52px] px-3.5 border-border dark:border-border-dark"
          style={{ backgroundColor: colors.background }}
        >
          <Ionicons name="location-outline" size={18} color={colors.subtle} style={{ marginRight: 10 }} />
          <TextInput
            className="flex-1 text-[15px] py-3.5 text-content dark:text-content-dark"
            placeholder="00000-000"
            placeholderTextColor={colors.subtle}
            value={props.cep}
            onChangeText={handleCepChange}
            keyboardType="numeric"
            maxLength={9}
          />
          {props.isLookingUpCep && (
            <ActivityIndicator size="small" color={colors.secondary} />
          )}
        </View>
        {props.cepError && (
          <AppText variant="caption" style={{ color: "#DC2626" }}>{props.cepError}</AppText>
        )}
      </View>

      {/* Street */}
      <AppInput
        label="Rua / Avenida"
        placeholder="Nome da rua"
        value={props.addressStreet}
        onChangeText={props.setAddressStreet}
        icon="home-outline"
        autoCapitalize="words"
      />

      {/* Number + Complement */}
      <View className="flex-row gap-3">
        <View className="flex-1">
          <AppInput
            label="Número"
            placeholder="Ex: 123"
            value={props.addressNumber}
            onChangeText={props.setAddressNumber}
            keyboardType="numeric"
          />
        </View>
        <View className="flex-1">
          <AppInput
            label="Complemento"
            placeholder="Apto, sala..."
            value={props.addressComplement}
            onChangeText={props.setAddressComplement}
            autoCapitalize="sentences"
          />
        </View>
      </View>

      {/* Neighborhood */}
      <AppInput
        label="Bairro"
        placeholder="Nome do bairro"
        value={props.addressNeighborhood}
        onChangeText={props.setAddressNeighborhood}
        icon="map-outline"
        autoCapitalize="words"
      />

      {/* City + UF */}
      <View className="flex-row gap-3">
        <View style={{ flex: 2 }}>
          <AppInput
            label="Cidade"
            placeholder="Cidade"
            value={props.addressCity}
            onChangeText={props.setAddressCity}
            autoCapitalize="words"
          />
        </View>
        <View style={{ flex: 1 }}>
          <AppInput
            label="UF"
            placeholder="SP"
            value={props.addressUf}
            onChangeText={(v) => props.setAddressUf(v.toUpperCase().slice(0, 2))}
            autoCapitalize="characters"
            maxLength={2}
          />
        </View>
      </View>
    </SectionCard>
  );
}

// ─── Save bar ─────────────────────────────────────────────────────────────────

function SaveBar({
  saving,
  saveSuccess,
  saveError,
  onSave,
  onCancel,
  insetBottom,
}: {
  saving: boolean;
  saveSuccess: boolean;
  saveError: string | null;
  onSave: () => void;
  onCancel: () => void;
  insetBottom: number;
}) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: colors.border,
        backgroundColor: colors.background,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: insetBottom + 12,
        gap: 8,
      }}
    >
      {saveError && (
        <View
          className="flex-row items-center gap-2 px-3 py-2 rounded-xl"
          style={{ backgroundColor: "#FEE2E2" }}
        >
          <Ionicons name="alert-circle-outline" size={16} color="#DC2626" />
          <AppText variant="small" style={{ color: "#DC2626", flex: 1 }}>
            {saveError}
          </AppText>
        </View>
      )}
      {saveSuccess && (
        <View
          className="flex-row items-center gap-2 px-3 py-2 rounded-xl"
          style={{ backgroundColor: "#D1FAE5" }}
        >
          <Ionicons name="checkmark-circle-outline" size={16} color="#059669" />
          <AppText variant="small" style={{ color: "#059669" }}>
            Alterações salvas com sucesso!
          </AppText>
        </View>
      )}
      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={onCancel}
          activeOpacity={0.75}
          style={{
            flex: 1,
            height: 50,
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor: colors.border,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AppText variant="bodyMedium" color="muted" className="font-medium">
            Cancelar
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSave}
          disabled={saving}
          activeOpacity={0.8}
          style={{
            flex: 2,
            height: 50,
            borderRadius: 14,
            backgroundColor: saving ? colors.secondary + "80" : colors.secondary,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {saving ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons name="checkmark" size={18} color="#fff" />
          )}
          <AppText style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>
            {saving ? "Salvando..." : "Salvar alterações"}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── Patient form ─────────────────────────────────────────────────────────────

function FormLoadError({ message, onRetry }: { message: string; onRetry: () => void }) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24, gap: 16 }}>
      <Ionicons name="alert-circle-outline" size={48} color={colors.subtle} />
      <AppText variant="body" color="muted" style={{ textAlign: "center" }}>{message}</AppText>
      <TouchableOpacity
        onPress={onRetry}
        activeOpacity={0.8}
        style={{
          paddingHorizontal: 28,
          paddingVertical: 13,
          borderRadius: 14,
          backgroundColor: colors.secondary,
        }}
      >
        <AppText style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>Tentar novamente</AppText>
      </TouchableOpacity>
    </View>
  );
}

function PatientForm() {
  const form = usePatientProfileForm();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  if (form.isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  if (form.loadError) {
    return <FormLoadError message={form.loadError} onRetry={form.retry} />;
  }

  const handleCancel = () => {
    if (form.isDirty) {
      setShowUnsavedModal(true);
    } else {
      router.back();
    }
  };

  const toggleGoal = (goal: string) => {
    form.setTherapyGoals(
      form.therapyGoals.includes(goal)
        ? form.therapyGoals.filter((g) => g !== goal)
        : [...form.therapyGoals, goal]
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={0}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 8 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Dados pessoais */}
        <SectionCard title="Dados pessoais" icon="person-outline">
          <AppInput
            label="Data de nascimento"
            placeholder="DD/MM/AAAA"
            value={form.birthDate}
            onChangeText={(v) => form.setBirthDate(maskDate(v))}
            icon="calendar-outline"
            keyboardType="numeric"
          />
          <SelectField
            label="Gênero"
            placeholder="Selecione seu gênero"
            icon="people-outline"
            options={GENDER_OPTIONS}
            value={form.gender}
            onChange={(v) => form.setGender(v as GenderType | null)}
          />
          <AppInput
            label="Telefone"
            placeholder="(11) 99999-9999"
            value={form.phone}
            onChangeText={(v) => form.setPhone(maskPhone(v))}
            icon="call-outline"
            keyboardType="phone-pad"
          />
          <AppInput
            label="CPF (opcional)"
            placeholder="000.000.000-00"
            value={form.cpf}
            onChangeText={(v) => form.setCpf(maskCpf(v))}
            icon="card-outline"
            keyboardType="numeric"
          />
        </SectionCard>

        {/* Endereço */}
        <AddressSection
          cep={form.cep}
          setCep={form.setCep}
          addressStreet={form.addressStreet}
          setAddressStreet={form.setAddressStreet}
          addressNumber={form.addressNumber}
          setAddressNumber={form.setAddressNumber}
          addressComplement={form.addressComplement}
          setAddressComplement={form.setAddressComplement}
          addressNeighborhood={form.addressNeighborhood}
          setAddressNeighborhood={form.setAddressNeighborhood}
          addressCity={form.addressCity}
          setAddressCity={form.setAddressCity}
          addressUf={form.addressUf}
          setAddressUf={form.setAddressUf}
          isLookingUpCep={form.isLookingUpCep}
          cepError={form.cepError}
          lookupCep={form.lookupCep}
        />

        {/* Contato de segurança */}
        <SectionCard title="Contato de segurança" icon="shield-checkmark-outline">
          <AppInput
            label="Nome do contato"
            placeholder="Nome completo"
            value={form.emergencyName}
            onChangeText={form.setEmergencyName}
            icon="person-outline"
            autoCapitalize="words"
          />
          <AppInput
            label="Telefone do contato"
            placeholder="(11) 99999-9999"
            value={form.emergencyPhone}
            onChangeText={(v) => form.setEmergencyPhone(maskPhone(v))}
            icon="call-outline"
            keyboardType="phone-pad"
          />
          <SelectField
            label="Relação"
            placeholder="Selecione a relação"
            icon="people-outline"
            options={EMERGENCY_RELATION_OPTIONS}
            value={form.emergencyRelation}
            onChange={form.setEmergencyRelation}
          />
        </SectionCard>

        {/* Saúde e bem-estar */}
        <SectionCard title="Saúde e bem-estar" icon="heart-outline">
          <View className="gap-2">
            <View className="gap-0.5">
              <AppText variant="label" color="muted" className="uppercase tracking-[0.8px]">
                Queixa principal
              </AppText>
              <AppText variant="caption" color="muted">
                Descreva o que tem te incomodado ou motivado a buscar apoio.
              </AppText>
            </View>
            <TextInput
              placeholder="Sinto que ultimamente..."
              placeholderTextColor={colors.subtle}
              value={form.mainComplaint}
              onChangeText={form.setMainComplaint}
              multiline
              textAlignVertical="top"
              style={{
                minHeight: 100,
                borderWidth: 1.5,
                borderColor: colors.border,
                borderRadius: 14,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 15,
                lineHeight: 22,
                color: colors.content,
                backgroundColor: colors.background,
              }}
            />
          </View>

          <YesNoToggle
            label="Já fez terapia anteriormente?"
            value={form.hasPreviousTherapy}
            onChange={form.setHasPreviousTherapy}
          />

          <YesNoToggle
            label="Tem acompanhamento psiquiátrico?"
            value={form.hasPsychiatricFollowUp}
            onChange={form.setHasPsychiatricFollowUp}
          />

          <View className="gap-2">
            <YesNoToggle
              label="Possui plano de saúde?"
              value={form.hasHealthInsurance}
              onChange={form.setHasHealthInsurance}
            />
            {form.hasHealthInsurance === true && (
              <AppInput
                placeholder="Nome do plano de saúde"
                value={form.healthInsuranceName}
                onChangeText={form.setHealthInsuranceName}
                icon="card-outline"
                autoCapitalize="words"
              />
            )}
          </View>

          <MedicationField
            medications={form.medications}
            onChange={form.setMedications}
          />
        </SectionCard>

        {/* Objetivos terapêuticos */}
        <SectionCard title="Objetivos terapêuticos" icon="flag-outline">
          <MultiChips
            label="Selecione as áreas de foco"
            options={THERAPY_GOALS}
            selected={form.therapyGoals}
            onToggle={toggleGoal}
          />
        </SectionCard>
      </ScrollView>

      <SaveBar
        saving={form.saving}
        saveSuccess={form.saveSuccess}
        saveError={form.saveError}
        onSave={form.save}
        onCancel={handleCancel}
        insetBottom={insets.bottom}
      />

      <ConfirmActionModal
        visible={showUnsavedModal}
        onConfirm={() => { setShowUnsavedModal(false); router.back(); }}
        onCancel={() => setShowUnsavedModal(false)}
        icon="warning-outline"
        iconColor="#F59E0B"
        title="Alterações não salvas"
        description="Tem certeza que deseja sair sem salvar?"
        confirmLabel="Sair"
        cancelLabel="Continuar editando"
        confirmColor="#EF4444"
      />
    </KeyboardAvoidingView>
  );
}

// ─── Professional form ────────────────────────────────────────────────────────

function ProfessionalForm() {
  const form = useProfessionalProfileForm();
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);

  if (form.isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color={colors.secondary} />
      </View>
    );
  }

  if (form.loadError) {
    return <FormLoadError message={form.loadError} onRetry={form.retry} />;
  }

  const handleCancel = () => {
    if (form.isDirty) {
      setShowUnsavedModal(true);
    } else {
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={0}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 8 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Dados pessoais */}
        <SectionCard title="Dados pessoais" icon="person-outline">
          <AppInput
            label="Data de nascimento"
            placeholder="DD/MM/AAAA"
            value={form.birthDate}
            onChangeText={(v) => form.setBirthDate(maskDate(v))}
            icon="calendar-outline"
            keyboardType="numeric"
          />
          <SelectField
            label="Gênero"
            placeholder="Selecione seu gênero"
            icon="people-outline"
            options={GENDER_OPTIONS}
            value={form.gender}
            onChange={(v) => form.setGender(v as GenderType | null)}
          />
          <AppInput
            label="Telefone"
            placeholder="(11) 99999-9999"
            value={form.phone}
            onChangeText={(v) => form.setPhone(maskPhone(v))}
            icon="call-outline"
            keyboardType="phone-pad"
          />
          <AppInput
            label="CPF (opcional)"
            placeholder="000.000.000-00"
            value={form.cpf}
            onChangeText={(v) => form.setCpf(maskCpf(v))}
            icon="card-outline"
            keyboardType="numeric"
          />
        </SectionCard>

        {/* Endereço */}
        <AddressSection
          cep={form.cep}
          setCep={form.setCep}
          addressStreet={form.addressStreet}
          setAddressStreet={form.setAddressStreet}
          addressNumber={form.addressNumber}
          setAddressNumber={form.setAddressNumber}
          addressComplement={form.addressComplement}
          setAddressComplement={form.setAddressComplement}
          addressNeighborhood={form.addressNeighborhood}
          setAddressNeighborhood={form.setAddressNeighborhood}
          addressCity={form.addressCity}
          setAddressCity={form.setAddressCity}
          addressUf={form.addressUf}
          setAddressUf={form.setAddressUf}
          isLookingUpCep={form.isLookingUpCep}
          cepError={form.cepError}
          lookupCep={form.lookupCep}
        />

        {/* Credenciais profissionais */}
        <SectionCard title="Credenciais profissionais" icon="document-text-outline">
          <View className="gap-2">
            <AppText variant="label" color="muted" className="uppercase tracking-[0.8px]">
              Tipo de registro
            </AppText>
            <View className="flex-row gap-2">
              {REGISTER_TYPE_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => form.setRegisterType(opt.value)}
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    paddingVertical: 14,
                    borderRadius: 14,
                    alignItems: "center",
                    borderWidth: 2,
                    borderColor:
                      form.registerType === opt.value ? colors.secondary : colors.border,
                    backgroundColor:
                      form.registerType === opt.value
                        ? colors.secondary + "15"
                        : colors.surface,
                  }}
                >
                  <AppText
                    variant="smallMedium"
                    style={{
                      fontWeight: "700",
                      color:
                        form.registerType === opt.value ? colors.secondary : colors.subtle,
                    }}
                  >
                    {opt.label}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <AppInput
            label="Número do registro"
            placeholder="Ex: 123456"
            value={form.professionalRegister}
            onChangeText={form.setProfessionalRegister}
            icon="document-text-outline"
          />

          <SelectField
            label="Estado do registro"
            placeholder="Selecione o estado"
            icon="location-outline"
            options={UF_OPTIONS}
            value={form.registerState}
            onChange={form.setRegisterState}
          />

          <AppInput
            label="Especialidade"
            placeholder="Ex: Psicologia clínica"
            value={form.specialty}
            onChangeText={form.setSpecialty}
            icon="ribbon-outline"
            autoCapitalize="sentences"
          />

          <SelectField
            label="Abordagem terapêutica"
            placeholder="Selecione sua abordagem"
            icon="school-outline"
            options={APPROACH_OPTIONS}
            value={form.approach}
            onChange={form.setApproach}
          />

          <View className="gap-2">
            <AppText variant="label" color="muted" className="uppercase tracking-[0.8px]">
              Anos de experiência
            </AppText>
            <View className="flex-row items-center gap-5">
              <TouchableOpacity
                onPress={() => form.setExperienceYears(Math.max(0, form.experienceYears - 1))}
                activeOpacity={0.8}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="remove" size={22} color={colors.secondary} />
              </TouchableOpacity>
              <AppText variant="heading1" className="font-bold min-w-[40px] text-center">
                {form.experienceYears}
              </AppText>
              <TouchableOpacity
                onPress={() => form.setExperienceYears(form.experienceYears + 1)}
                activeOpacity={0.8}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: colors.secondary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="add" size={22} color="#fff" />
              </TouchableOpacity>
              <AppText variant="body" color="muted">anos</AppText>
            </View>
          </View>
        </SectionCard>

        {/* Apresentação */}
        <SectionCard title="Apresentação" icon="person-circle-outline">
          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <AppText variant="label" color="muted" className="uppercase tracking-[0.8px]">
                Bio
              </AppText>
              <AppText variant="caption" color="muted">{form.bio.length}/500</AppText>
            </View>
            <TextInput
              placeholder="Conte sobre você, sua abordagem e como pode ajudar seus pacientes..."
              placeholderTextColor={colors.subtle}
              value={form.bio}
              onChangeText={form.setBio}
              multiline
              textAlignVertical="top"
              maxLength={500}
              style={{
                minHeight: 120,
                borderWidth: 1.5,
                borderColor: colors.border,
                borderRadius: 14,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 15,
                lineHeight: 22,
                color: colors.content,
                backgroundColor: colors.background,
              }}
            />
          </View>

          <AppInput
            label="Clínica / consultório (opcional)"
            placeholder="Nome da clínica ou consultório"
            value={form.clinicName}
            onChangeText={form.setClinicName}
            icon="business-outline"
            autoCapitalize="words"
          />

          <View className="gap-1.5">
            <AppText variant="label" color="muted" className="uppercase tracking-[0.8px]">
              Valor da consulta (opcional)
            </AppText>
            <View
              className="flex-row items-center rounded-xl border min-h-[52px] px-3.5 border-border dark:border-border-dark"
              style={{ backgroundColor: colors.surface }}
            >
              <AppText variant="body" color="muted" className="mr-2">R$</AppText>
              <TextInput
                className="flex-1 text-[15px] py-3.5 text-content dark:text-content-dark"
                placeholder="0,00"
                placeholderTextColor={colors.subtle}
                value={form.consultationFee}
                onChangeText={(v) => form.setConsultationFee(maskCurrency(v))}
                keyboardType="numeric"
              />
            </View>
          </View>
        </SectionCard>

        {/* Modalidade de atendimento */}
        <SectionCard title="Modalidade de atendimento" icon="desktop-outline">
          {[
            {
              key: "online" as const,
              label: "Online",
              icon: "desktop-outline" as const,
              value: form.onlineAppointments,
              onChange: form.setOnlineAppointments,
            },
            {
              key: "inPerson" as const,
              label: "Presencial",
              icon: "business-outline" as const,
              value: form.inPersonAppointments,
              onChange: form.setInPersonAppointments,
            },
          ].map((opt) => (
            <TouchableOpacity
              key={opt.key}
              onPress={() => opt.onChange(!opt.value)}
              activeOpacity={0.8}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                padding: 16,
                borderRadius: 14,
                borderWidth: 1.5,
                borderColor: opt.value ? colors.secondary : colors.border,
                backgroundColor: opt.value ? colors.secondary + "0D" : colors.surface,
              }}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  borderWidth: 2,
                  borderColor: opt.value ? colors.secondary : colors.border,
                  backgroundColor: opt.value ? colors.secondary : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {opt.value && <Ionicons name="checkmark" size={13} color="#fff" />}
              </View>
              <Ionicons
                name={opt.icon}
                size={20}
                color={opt.value ? colors.secondary : colors.subtle}
              />
              <AppText
                variant="body"
                style={{
                  color: opt.value ? colors.secondary : colors.content,
                  fontWeight: opt.value ? "600" : "400",
                }}
              >
                {opt.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </SectionCard>
      </ScrollView>

      <SaveBar
        saving={form.saving}
        saveSuccess={form.saveSuccess}
        saveError={form.saveError}
        onSave={form.save}
        onCancel={handleCancel}
        insetBottom={insets.bottom}
      />

      <ConfirmActionModal
        visible={showUnsavedModal}
        onConfirm={() => { setShowUnsavedModal(false); router.back(); }}
        onCancel={() => setShowUnsavedModal(false)}
        icon="warning-outline"
        iconColor="#F59E0B"
        title="Alterações não salvas"
        description="Tem certeza que deseja sair sem salvar?"
        confirmLabel="Sair"
        cancelLabel="Continuar editando"
        confirmColor="#EF4444"
      />
    </KeyboardAvoidingView>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

export function ProfileFormScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const isProfessional = user?.role === "professional";
  const title = isProfessional ? "Dados profissionais" : "Minha ficha";
  const subtitle = isProfessional
    ? "Dados profissionais e atendimento"
    : "Dados pessoais e preferências de cuidado";

  return (
    <View style={{ flex: 1 }} className="bg-background dark:bg-background-dark">
      <AppHeader title={title} showBack onBackPress={() => router.back()} />
      <View className="px-5 py-3 border-b border-border dark:border-border-dark">
        <AppText variant="small" color="muted">{subtitle}</AppText>
      </View>
      {isProfessional ? <ProfessionalForm /> : <PatientForm />}
    </View>
  );
}
