import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../../components/ui/AppText";
import { AppInput } from "../../../components/ui/AppInput";
import { AppButton } from "../../../components/ui/AppButton";
import { AppCard } from "../../../components/ui/AppCard";
import { ScreenContainer } from "../../../components/layout/ScreenContainer";
import { SelectField, SelectOption } from "../../../components/forms/SelectField";
import { ErrorToast, useErrorToast } from "../../../components/ui/ErrorToast";
import { useAuth } from "../../../../core/auth/AuthContext";
import { API_ROUTES } from "../../../../core/constants/api";
import { AuthService } from "../../../../services/auth/AuthService";
import { useTheme } from "../../../../core/theme";
import { GenderType } from "../../../../core/types";

interface PatientOnboardingScreenProps {
  onComplete: () => void;
}

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

function maskCep(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

function maskDate(v: string): string {
  const d = v.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 4;

const GENDER_OPTIONS: SelectOption[] = [
  { value: "female", label: "Feminino" },
  { value: "male", label: "Masculino" },
  { value: "non_binary", label: "Não-binário" },
  { value: "other", label: "Outro" },
  { value: "prefer_not_to_say", label: "Prefiro não informar" },
];

const UF_OPTIONS: SelectOption[] = [
  { value: "AC", label: "AC" },
  { value: "AL", label: "AL" },
  { value: "AP", label: "AP" },
  { value: "AM", label: "AM" },
  { value: "BA", label: "BA" },
  { value: "CE", label: "CE" },
  { value: "DF", label: "DF" },
  { value: "ES", label: "ES" },
  { value: "GO", label: "GO" },
  { value: "MA", label: "MA" },
  { value: "MT", label: "MT" },
  { value: "MS", label: "MS" },
  { value: "MG", label: "MG" },
  { value: "PA", label: "PA" },
  { value: "PB", label: "PB" },
  { value: "PR", label: "PR" },
  { value: "PE", label: "PE" },
  { value: "PI", label: "PI" },
  { value: "RJ", label: "RJ" },
  { value: "RN", label: "RN" },
  { value: "RS", label: "RS" },
  { value: "RO", label: "RO" },
  { value: "RR", label: "RR" },
  { value: "SC", label: "SC" },
  { value: "SP", label: "SP" },
  { value: "SE", label: "SE" },
  { value: "TO", label: "TO" },
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

const STEP_META = [
  {
    title: "Vamos nos conhecer melhor",
    subtitle: "Para começarmos a personalizar seu acompanhamento, precisamos de alguns dados básicos.",
  },
  {
    title: "Onde você mora?",
    subtitle: "Essas informações nos ajudam a encontrar profissionais próximos a você.",
  },
  {
    title: "Contato de segurança",
    subtitle: "Quem devemos avisar em caso de necessidade? Sua segurança é nossa prioridade.",
  },
  {
    title: "O que te trouxe aqui?",
    subtitle: "Conte-nos um pouco sobre sua jornada para personalizarmos seu acolhimento.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SecurityNote({ text, icon = "shield-checkmark-outline" as const }: {
  text: string;
  icon?: keyof typeof Ionicons.glyphMap;
}) {
  const { colors } = useTheme();
  return (
    <View
      className="flex-row items-start gap-2 p-3 rounded-xl border"
      style={{
        backgroundColor: colors.secondary + "0D",
        borderColor: colors.secondary + "25",
      }}
    >
      <Ionicons name={icon} size={15} color={colors.secondary} style={{ marginTop: 1 }} />
      <AppText variant="caption" color="muted" className="flex-1" style={{ lineHeight: 18 }}>
        {text}
      </AppText>
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

// ─── Main Screen ──────────────────────────────────────────────────────────────

export function PatientOnboardingScreen({ onComplete }: PatientOnboardingScreenProps) {
  const { refreshUser } = useAuth();
  const { colors } = useTheme();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { error, showError, clearError } = useErrorToast();

  // Animated progress bar
  const progressAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: step / TOTAL_STEPS,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [step]);

  // Step 1 — Dados pessoais
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");

  // Step 2 — Endereço
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState<string | null>(null);
  const [cepLoading, setCepLoading] = useState(false);

  // Step 3 — Contato de emergência
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState<string | null>(null);

  // Step 4 — Cuidados e objetivos
  const [mainComplaint, setMainComplaint] = useState("");
  const [therapyGoals, setTherapyGoals] = useState<string[]>([]);
  const [medicationInput, setMedicationInput] = useState("");
  const [medicationList, setMedicationList] = useState<string[]>([]);
  const [hasPreviousTherapy, setHasPreviousTherapy] = useState<boolean | null>(null);
  const [hasPsychiatrist, setHasPsychiatrist] = useState<boolean | null>(null);
  const [hasHealthPlan, setHasHealthPlan] = useState<boolean | null>(null);
  const [healthPlanName, setHealthPlanName] = useState("");

  const toggleGoal = (goal: string) => {
    setTherapyGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const addMedication = () => {
    const trimmed = medicationInput.trim();
    if (!trimmed || medicationList.includes(trimmed)) return;
    setMedicationList((prev) => [...prev, trimmed]);
    setMedicationInput("");
  };

  const removeMedication = (med: string) => {
    setMedicationList((prev) => prev.filter((m) => m !== med));
  };

  const fetchCep = useCallback(async (rawCep: string) => {
    const digits = rawCep.replace(/\D/g, "");
    if (digits.length !== 8) return;
    setCepLoading(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setRua(data.logradouro || "");
        setBairro(data.bairro || "");
        setCidade(data.localidade || "");
        setEstado(data.uf || null);
      }
    } catch {
      // silent — user can fill manually
    } finally {
      setCepLoading(false);
    }
  }, []);

  const goNext = () => {
    if (step === 1) {
      if (!birthDate || birthDate.length < 10) { showError("Informe uma data de nascimento válida (DD/MM/AAAA)."); return; }
      if (!gender) { showError("Selecione seu gênero."); return; }
      if (phone.replace(/\D/g, "").length < 10) { showError("Informe um telefone válido."); return; }
      const cpfDigits = cpf.replace(/\D/g, "");
      if (cpfDigits.length > 0 && cpfDigits.length < 11) { showError("CPF inválido. Informe todos os 11 dígitos."); return; }
      setStep(2);
    } else if (step === 2) {
      if (cep.replace(/\D/g, "").length < 8) { showError("Informe um CEP válido."); return; }
      if (!rua.trim()) { showError("Informe o logradouro/rua."); return; }
      if (!numero.trim()) { showError("Informe o número."); return; }
      if (!bairro.trim()) { showError("Informe o bairro."); return; }
      if (!cidade.trim()) { showError("Informe a cidade."); return; }
      if (!estado) { showError("Selecione o estado (UF)."); return; }
      setStep(3);
    } else if (step === 3) {
      if (!emergencyName.trim()) { showError("Informe o nome do contato de emergência."); return; }
      if (emergencyPhone.replace(/\D/g, "").length < 10) { showError("Informe um telefone de emergência válido."); return; }
      if (!emergencyRelation) { showError("Selecione a relação com o contato."); return; }
      setStep(4);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!mainComplaint.trim()) { showError("Descreva sua queixa principal."); return; }
    if (therapyGoals.length === 0) { showError("Selecione ao menos um objetivo terapêutico."); return; }
    if (hasPreviousTherapy === null) { showError("Informe se já fez terapia anteriormente."); return; }
    if (hasPsychiatrist === null) { showError("Informe se acompanha um psiquiatra."); return; }
    if (hasHealthPlan === null) { showError("Informe se possui plano de saúde."); return; }
    if (hasHealthPlan && !healthPlanName.trim()) { showError("Informe o nome do plano de saúde."); return; }

    setLoading(true);
    try {
      const token = await AuthService.getToken();
      if (!token) throw new Error("Sessão expirada. Faça login novamente.");

      let birth_date: string | undefined;
      if (birthDate.length === 10) {
        const [day, month, year] = birthDate.split("/");
        if (day && month && year) {
          birth_date = new Date(`${year}-${month}-${day}T12:00:00.000Z`).toISOString();
        }
      }

      const body: Record<string, unknown> = {};
      if (birth_date) body.birth_date = birth_date;
      if (gender) body.gender = gender as GenderType;
      if (phone) body.phone = phone.replace(/\D/g, "");
      const cpfDigits = cpf.replace(/\D/g, "");
      if (cpfDigits.length === 11) body.cpf = cpfDigits;
      if (mainComplaint.trim()) body.main_complaint = mainComplaint.trim();
      if (therapyGoals.length) body.therapy_goals = therapyGoals.join(", ");
      if (medicationList.length) body.medications = medicationList.join(", ");
      if (hasPreviousTherapy !== null) body.has_previous_therapy = hasPreviousTherapy;

      const response = await fetch(API_ROUTES.patients.me, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const raw = await response.text();
        const err = JSON.parse(raw || "{}");
        throw new Error(err.message ?? "Erro ao salvar perfil.");
      }

      await refreshUser();
      onComplete();
    } catch (err) {
      showError(err instanceof Error ? err.message : "Erro ao salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [birthDate, gender, phone, cpf, mainComplaint, therapyGoals, medicationList, hasPreviousTherapy, hasPsychiatrist, hasHealthPlan, healthPlanName, refreshUser, onComplete]);

  const percent = Math.round((step / TOTAL_STEPS) * 100);
  const meta = STEP_META[step - 1];

  return (
    <ScreenContainer avoidKeyboard>
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow px-5 pt-6 pb-12 gap-5"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Progress header ── */}
        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <AppText variant="caption" color="muted" className="font-semibold uppercase tracking-widest">
              Etapa {step} de {TOTAL_STEPS}
            </AppText>
            <AppText variant="caption" color="secondary" className="font-bold">
              {percent}%
            </AppText>
          </View>

          <View
            className="h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: colors.border }}
          >
            <Animated.View
              style={{
                height: "100%",
                borderRadius: 999,
                backgroundColor: colors.secondary,
                width: progressAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ["0%", "100%"],
                }),
              }}
            />
          </View>

          <View className="gap-1 mt-1">
            <AppText variant="heading1" className="font-bold">{meta.title}</AppText>
            <AppText variant="body" color="muted">{meta.subtitle}</AppText>
          </View>
        </View>

        {/* ── Step 1: Dados pessoais ── */}
        {step === 1 && (
          <>
            <AppCard className="gap-4">
              <AppInput
                label="Data de nascimento *"
                placeholder="DD/MM/AAAA"
                value={birthDate}
                onChangeText={(v) => setBirthDate(maskDate(v))}
                icon="calendar-outline"
                keyboardType="numeric"
              />

              <SelectField
                label="Gênero *"
                placeholder="Selecione seu gênero"
                icon="people-outline"
                options={GENDER_OPTIONS}
                value={gender}
                onChange={setGender}
              />

              <AppInput
                label="Telefone *"
                placeholder="(11) 99999-9999"
                value={phone}
                onChangeText={(v) => setPhone(maskPhone(v))}
                icon="call-outline"
                keyboardType="phone-pad"
              />

              <AppInput
                label="CPF (opcional)"
                placeholder="000.000.000-00"
                value={cpf}
                onChangeText={(v) => setCpf(maskCpf(v))}
                icon="card-outline"
                keyboardType="numeric"
              />
            </AppCard>

            <SecurityNote text="Seus dados pessoais são criptografados e nunca compartilhados com terceiros." />
          </>
        )}

        {/* ── Step 2: Endereço ── */}
        {step === 2 && (
          <AppCard className="gap-4">
            <View className="gap-1.5">
              <AppText variant="label" color="muted" className="uppercase tracking-[0.8px]">CEP *</AppText>
              <View
                className="flex-row items-center rounded-xl border min-h-[52px] px-3.5 bg-surface dark:bg-surface-dark border-border dark:border-border-dark gap-2"
              >
                <Ionicons name="search-outline" size={20} color={colors.subtle} />
                <TextInput
                  className="flex-1 text-[15px] py-3.5 text-content dark:text-content-dark"
                  placeholderTextColor={colors.subtle}
                  placeholder="00000-000"
                  value={cep}
                  onChangeText={(v) => {
                    const masked = maskCep(v);
                    setCep(masked);
                    fetchCep(masked);
                  }}
                  keyboardType="numeric"
                  autoCapitalize="none"
                />
                {cepLoading && (
                  <Ionicons name="sync-outline" size={18} color={colors.subtle} />
                )}
              </View>
            </View>

            <AppInput
              label="Logradouro *"
              placeholder="Ex: Rua das Flores"
              value={rua}
              onChangeText={setRua}
              icon="map-outline"
              autoCapitalize="words"
            />

            <View className="flex-row gap-3">
              <View style={{ flex: 1 }}>
                <AppInput
                  label="Número *"
                  placeholder="Ex: 123"
                  value={numero}
                  onChangeText={setNumero}
                  icon="home-outline"
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <AppInput
                  label="Complemento"
                  placeholder="Apto, bloco..."
                  value={complemento}
                  onChangeText={setComplemento}
                  icon="layers-outline"
                  autoCapitalize="sentences"
                />
              </View>
            </View>

            <AppInput
              label="Bairro *"
              placeholder="Ex: Centro"
              value={bairro}
              onChangeText={setBairro}
              icon="business-outline"
              autoCapitalize="words"
            />

            <View className="flex-row gap-3">
              <View style={{ flex: 2 }}>
                <AppInput
                  label="Cidade *"
                  placeholder="Ex: São Paulo"
                  value={cidade}
                  onChangeText={setCidade}
                  icon="location-outline"
                  autoCapitalize="words"
                />
              </View>
              <View style={{ flex: 1 }}>
                <SelectField
                  label="UF *"
                  placeholder="UF"
                  options={UF_OPTIONS}
                  value={estado}
                  onChange={setEstado}
                />
              </View>
            </View>
          </AppCard>
        )}

        {/* ── Step 3: Contato de emergência ── */}
        {step === 3 && (
          <>
            <AppCard className="gap-4">
              <AppInput
                label="Nome completo *"
                placeholder="Ex: Maria Silva"
                value={emergencyName}
                onChangeText={setEmergencyName}
                icon="person-outline"
                autoCapitalize="words"
              />

              <AppInput
                label="Telefone *"
                placeholder="(11) 99999-9999"
                value={emergencyPhone}
                onChangeText={(v) => setEmergencyPhone(maskPhone(v))}
                icon="call-outline"
                keyboardType="phone-pad"
              />

              <SelectField
                label="Relação *"
                placeholder="Selecione a relação"
                icon="heart-outline"
                options={EMERGENCY_RELATION_OPTIONS}
                value={emergencyRelation}
                onChange={setEmergencyRelation}
              />
            </AppCard>

            <SecurityNote
              icon="lock-closed-outline"
              text="Essas informações são usadas apenas em situações de emergência e nunca são compartilhadas."
            />
          </>
        )}

        {/* ── Step 4: Cuidados e objetivos ── */}
        {step === 4 && (
          <View className="gap-5">

            <AppCard className="gap-4">
              <View className="gap-2">
                <View className="gap-1">
                  <AppText variant="label" color="muted" className="uppercase tracking-[0.8px]">
                    Queixa principal *
                  </AppText>
                  <AppText variant="caption" color="muted">
                    Sinta-se à vontade para compartilhar o que tem te incomodado.
                  </AppText>
                </View>
                <TextInput
                  placeholder="Sinto que ultimamente..."
                  placeholderTextColor={colors.subtle}
                  value={mainComplaint}
                  onChangeText={setMainComplaint}
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

              <View className="gap-3">
                <View className="gap-1">
                  <AppText variant="label" color="muted" className="uppercase tracking-[0.8px]">
                    Objetivos terapêuticos *
                  </AppText>
                  <AppText variant="caption" color="muted">
                    Selecione as áreas que você deseja focar neste momento.
                  </AppText>
                </View>
                <View className="flex-row flex-wrap gap-2">
                  {THERAPY_GOALS.map((goal) => {
                    const selected = therapyGoals.includes(goal);
                    return (
                      <TouchableOpacity
                        key={goal}
                        onPress={() => toggleGoal(goal)}
                        activeOpacity={0.8}
                        className="px-3 py-2 rounded-full border"
                        style={{
                          backgroundColor: selected ? colors.secondary : colors.surface,
                          borderColor: selected ? colors.secondary : colors.border,
                        }}
                      >
                        <AppText
                          variant="small"
                          style={{
                            color: selected ? "#fff" : colors.subtle,
                            fontWeight: selected ? "600" : "400",
                          }}
                        >
                          {selected ? "✓ " : ""}{goal}
                        </AppText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </AppCard>


            <AppCard className="gap-2">
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
                    value={medicationInput}
                    onChangeText={setMedicationInput}
                    onSubmitEditing={addMedication}
                    returnKeyType="done"
                    blurOnSubmit={false}
                  />
                </View>
                <TouchableOpacity
                  onPress={addMedication}
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

              {medicationList.length > 0 && (
                <View className="flex-row flex-wrap gap-2 mt-1">
                  {medicationList.map((med) => (
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
                        onPress={() => removeMedication(med)}
                        hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                        activeOpacity={0.7}
                      >
                        <Ionicons name="close-circle" size={16} color={colors.secondary} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </AppCard>

            <AppCard className="gap-4">
              <YesNoToggle
                label="Já fez terapia anteriormente?"
                value={hasPreviousTherapy}
                onChange={setHasPreviousTherapy}
              />
              <YesNoToggle
                label="Faz acompanhamento psiquiátrico?"
                value={hasPsychiatrist}
                onChange={setHasPsychiatrist}
              />
              <YesNoToggle
                label="Possui plano de saúde?"
                value={hasHealthPlan}
                onChange={setHasHealthPlan}
              />

            {hasHealthPlan === true && (
              <AppInput
                label="Nome do plano *"
                placeholder="Ex: Unimed, Bradesco Saúde..."
                value={healthPlanName}
                onChangeText={setHealthPlanName}
                icon="medkit-outline"
                autoCapitalize="words"
              />
            )}
            </AppCard>
                <SecurityNote text="Suas respostas são confidenciais e protegidas por sigilo clínico." />
          </View>
        )}

        {/* ── Navigation ── */}
        {step === 1 ? (
          <View className="gap-3">
            <AppButton
              label="Continuar"
              onPress={goNext}
              variant="primary"
            />
          </View>
        ) : step < TOTAL_STEPS ? (
          <View className="flex-row gap-3">
            <AppButton
              label="Voltar"
              onPress={() => { clearError(); setStep(step - 1); }}
              variant="outline"
              style={{ flex: 2 }}
            />
            <AppButton
              label="Continuar"
              onPress={goNext}
              variant="primary"
              style={{ flex: 3 }}
            />
          </View>
        ) : (
          <View className="gap-3">
            <View className="flex-row gap-3">
              <AppButton
                label="Voltar"
                onPress={() => { clearError(); setStep(step - 1); }}
                variant="outline"
                style={{ flex: 2 }}
              />
              <AppButton
                label="Concluir Cadastro"
                onPress={handleSubmit}
                loading={loading}
                variant="primary"
                style={{ flex: 3 }}
              />
            </View>
            <TouchableOpacity onPress={onComplete} className="items-center py-1" activeOpacity={0.7}>
              <AppText variant="small" color="muted">Pular por enquanto</AppText>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      <ErrorToast message={error} />
    </ScreenContainer>
  );
}
