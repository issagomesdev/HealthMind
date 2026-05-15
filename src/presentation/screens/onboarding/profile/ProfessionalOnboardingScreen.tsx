import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
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
import { GenderType, RegisterType } from "../../../../core/types";

interface ProfessionalOnboardingScreenProps {
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

function maskCurrency(v: string): string {
  const digits = v.replace(/\D/g, "").slice(0, 10);
  if (!digits.length) return "";
  const num = parseInt(digits, 10) / 100;
  return num.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOTAL_STEPS = 5;

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

const REGISTER_TYPE_OPTIONS: { value: RegisterType; label: string; icon: string }[] = [
  { value: "CRP", label: "CRP", icon: "🧠" },
  { value: "CRM", label: "CRM", icon: "🏥" },
  { value: "OTHER", label: "Outro", icon: "📋" },
];

const STEP_META = [
  {
    title: "Vamos nos conhecer melhor",
    subtitle: "Para começarmos a personalizar seu acompanhamento, precisamos de alguns dados básicos.",
  },
  {
    title: "Suas credenciais",
    subtitle: "Informações sobre sua formação e atuação profissional.",
  },
  {
    title: "Apresente-se",
    subtitle: "Compartilhe com os pacientes quem você é e como você trabalha.",
  },
  {
    title: "Endereço Profissional",
    subtitle: "Onde você realiza atendimentos presenciais.",
  },
  {
    title: "Verificação",
    subtitle: "Confirme sua identidade para transmitir mais confiança.",
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


// ─── Main Screen ──────────────────────────────────────────────────────────────

export function ProfessionalOnboardingScreen({ onComplete }: ProfessionalOnboardingScreenProps) {
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

  // Step 2 — Dados profissionais
  const [registerType, setRegisterType] = useState<RegisterType | null>(null);
  const [professionalRegister, setProfessionalRegister] = useState("");
  const [registerState, setRegisterState] = useState<string | null>(null);
  const [specialty, setSpecialty] = useState("");
  const [approach, setApproach] = useState<string | null>(null);
  const [experienceYears, setExperienceYears] = useState(0);

  // Step 3 — Apresentação
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  const [onlineAppointments, setOnlineAppointments] = useState(false);
  const [inPersonAppointments, setInPersonAppointments] = useState(false);

  // Step 4 — Endereço profissional
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState<string | null>(null);
  const [cepLoading, setCepLoading] = useState(false);

  // Step 5 — Verificação
  const [documentUri, setDocumentUri] = useState<string | null>(null);

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

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) setProfilePhoto(result.assets[0].uri);
  };

  const pickDocument = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.9,
    });
    if (!result.canceled) setDocumentUri(result.assets[0].uri);
  };

  const goNext = () => {
    if (step === 1) {
      if (!birthDate || birthDate.length < 10) { showError("Informe uma data de nascimento válida (DD/MM/AAAA)."); return; }
      if (!gender) { showError("Selecione seu gênero."); return; }
      if (phone.replace(/\D/g, "").length < 10) { showError("Informe um telefone válido."); return; }
      const cpfDigits = cpf.replace(/\D/g, "");
      if (cpfDigits.length > 0 && cpfDigits.length < 11) { showError("CPF inválido. Informe todos os 11 dígitos."); return; }
      setStep(2);
    } else if (step === 2) {
      if (!registerType) { showError("Selecione o tipo de registro profissional."); return; }
      if (!professionalRegister.trim()) { showError("Informe o número do registro."); return; }
      if (!registerState) { showError("Selecione o estado do registro."); return; }
      if (!specialty.trim()) { showError("Informe sua especialidade."); return; }
      setStep(3);
    } else if (step === 3) {
      if (!bio.trim()) { showError("Escreva uma bio para seu perfil."); return; }
      if (!onlineAppointments && !inPersonAppointments) {
        showError("Selecione ao menos uma modalidade de atendimento.");
        return;
      }
      setStep(4);
    } else if (step === 4) {
      if (cep.replace(/\D/g, "").length < 8) { showError("Informe um CEP válido."); return; }
      if (!rua.trim()) { showError("Informe o logradouro/rua."); return; }
      if (!numero.trim()) { showError("Informe o número."); return; }
      if (!bairro.trim()) { showError("Informe o bairro."); return; }
      if (!cidade.trim()) { showError("Informe a cidade."); return; }
      if (!estado) { showError("Selecione o estado (UF)."); return; }
      setStep(5);
    }
  };

  const handleSubmit = useCallback(async () => {
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
      if (registerType) body.register_type = registerType;
      if (professionalRegister.trim()) body.professional_register = professionalRegister.trim();
      if (registerState) body.register_state = registerState;
      if (specialty.trim()) body.specialty = specialty.trim();
      if (approach) body.approach = approach;
      if (experienceYears >= 0) body.experience_years = experienceYears;
      if (bio.trim()) body.bio = bio.trim();
      if (clinicName.trim()) body.clinic_name = clinicName.trim();
      const fee = parseFloat(consultationFee.replace(/./g, "").replace(",", "."));
      if (!isNaN(fee) && fee > 0) body.consultation_fee = fee;
      body.online_appointments = onlineAppointments;
      body.in_person_appointments = inPersonAppointments;

      const response = await fetch(API_ROUTES.professionals.me, {
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
  }, [birthDate, gender, phone, cpf, registerType, professionalRegister, registerState, specialty, approach, experienceYears, bio, clinicName, consultationFee, onlineAppointments, inPersonAppointments, refreshUser, onComplete]);

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
                keyboardType="numeric" />

              <SelectField
                label="Gênero *"
                placeholder="Selecione seu gênero"
                icon="people-outline"
                options={GENDER_OPTIONS}
                value={gender}
                onChange={setGender} />

              <AppInput
                label="Telefone *"
                placeholder="(11) 99999-9999"
                value={phone}
                onChangeText={(v) => setPhone(maskPhone(v))}
                icon="call-outline"
                keyboardType="phone-pad" />

              <AppInput
                label="CPF (opcional)"
                placeholder="000.000.000-00"
                value={cpf}
                onChangeText={(v) => setCpf(maskCpf(v))}
                icon="card-outline"
                keyboardType="numeric" />
            </AppCard><SecurityNote text="Seus dados pessoais são criptografados e nunca compartilhados com terceiros." />
          </>
        )}

        {/* ── Step 2: Dados profissionais ── */}
        {step === 2 && (
          <>
            <AppCard className="gap-4">
              <View className="gap-2">
                <AppText variant="label" color="muted" className="uppercase tracking-[0.8px]">
                  Tipo de registro *
                </AppText>
                <View className="flex-row gap-2">
                  {REGISTER_TYPE_OPTIONS.map((opt) => (
                    <TouchableOpacity
                      key={opt.value}
                      onPress={() => setRegisterType(opt.value)}
                      activeOpacity={0.8}
                      style={{
                        flex: 1,
                        paddingVertical: 14,
                        borderRadius: 16,
                        alignItems: "center",
                        gap: 4,
                        borderWidth: 2,
                        borderColor: registerType === opt.value ? colors.secondary : colors.border,
                        backgroundColor: registerType === opt.value
                          ? colors.secondary + "15"
                          : colors.surface,
                      }}
                    >
                      {/* <AppText variant="body">{opt.icon}</AppText> */}
                      <AppText
                        variant="smallMedium"
                        style={{
                          fontWeight: "700",
                          color: registerType === opt.value ? colors.secondary : colors.subtle,
                        }}
                      >
                        {opt.label}
                      </AppText>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <AppInput
                label="Número do registro *"
                placeholder="Ex: 123456"
                value={professionalRegister}
                onChangeText={setProfessionalRegister}
                icon="document-text-outline" />

              <SelectField
                label="Estado do registro *"
                placeholder="Selecione o estado"
                icon="location-outline"
                options={UF_OPTIONS}
                value={registerState}
                onChange={setRegisterState} />

              <AppInput
                label="Especialidade *"
                placeholder="Ex: Psicologia clínica"
                value={specialty}
                onChangeText={setSpecialty}
                icon="ribbon-outline"
                autoCapitalize="sentences" />

              <SelectField
                label="Abordagem terapêutica"
                placeholder="Selecione sua abordagem"
                icon="school-outline"
                options={APPROACH_OPTIONS}
                value={approach}
                onChange={setApproach} />

              <View className="gap-2">
                <AppText variant="label" color="muted" className="uppercase tracking-[0.8px]">
                  Anos de experiência
                </AppText>
                <View className="flex-row items-center gap-5">
                  <TouchableOpacity
                    onPress={() => setExperienceYears((p) => Math.max(0, p - 1))}
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
                    {experienceYears}
                  </AppText>
                  <TouchableOpacity
                    onPress={() => setExperienceYears((p) => p + 1)}
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
            </AppCard><SecurityNote text="Suas credenciais são verificadas pela equipe HealthMind antes de aparecerem no app." />
          </>
        )}

        {/* ── Step 3: Apresentação ── */}
        {step === 3 && (
          <AppCard className="gap-5">
            {/* Profile photo */}
            <View className="items-center gap-2">
              <TouchableOpacity onPress={pickPhoto} activeOpacity={0.8}>
                {profilePhoto ? (
                  <Image
                    source={{ uri: profilePhoto }}
                    style={{ width: 96, height: 96, borderRadius: 48 }}
                  />
                ) : (
                  <View
                    style={{
                      width: 96,
                      height: 96,
                      borderRadius: 48,
                      backgroundColor: colors.background,
                      borderWidth: 2,
                      borderStyle: "dashed",
                      borderColor: colors.border,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="camera-outline" size={28} color={colors.subtle} />
                  </View>
                )}
              </TouchableOpacity>
              <AppText variant="small" color="muted">
                {profilePhoto ? "Toque para alterar a foto" : "Adicionar foto de perfil (opcional)"}
              </AppText>
            </View>

            <View className="gap-2">
              <View className="flex-row items-center justify-between">
                <AppText variant="label" color="muted" className="uppercase tracking-[0.8px]">
                  Bio *
                </AppText>
                <AppText variant="caption" color="muted">{bio.length}/500</AppText>
              </View>
              <TextInput
                placeholder="Conte sobre você, sua abordagem e como pode ajudar seus pacientes..."
                placeholderTextColor={colors.subtle}
                value={bio}
                onChangeText={setBio}
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
              value={clinicName}
              onChangeText={setClinicName}
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
                  value={consultationFee}
                  onChangeText={(v) => setConsultationFee(maskCurrency(v))}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View className="gap-3">
              <AppText variant="label" color="muted" className="uppercase tracking-[0.8px]">
                Modalidade de atendimento *
              </AppText>
              {([
                { key: "online", label: "Online", icon: "desktop-outline" as const, value: onlineAppointments, onChange: setOnlineAppointments },
                { key: "inPerson", label: "Presencial", icon: "business-outline" as const, value: inPersonAppointments, onChange: setInPersonAppointments },
              ]).map((opt) => (
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
                  <Ionicons name={opt.icon} size={20} color={opt.value ? colors.secondary : colors.subtle} />
                  <AppText
                    variant="body"
                    style={{ color: opt.value ? colors.secondary : colors.content, fontWeight: opt.value ? "600" : "400" }}
                  >
                    {opt.label}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
          </AppCard>
        )}

        {/* ── Step 4: Endereço profissional ── */}
        {step === 4 && (
          <AppCard className="gap-4">
            <View className="gap-1.5">
              <AppText variant="label" color="muted" className="uppercase tracking-[0.8px]">CEP *</AppText>
              <View
                className="flex-row items-center rounded-xl border min-h-[52px] px-3.5 border-border dark:border-border-dark gap-2"
                style={{ backgroundColor: colors.surface }}
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
              placeholder="Ex: Av. Paulista"
              value={rua}
              onChangeText={setRua}
              icon="map-outline"
              autoCapitalize="words"
            />

            <View className="flex-row gap-3">
              <View style={{ flex: 1 }}>
                <AppInput
                  label="Número *"
                  placeholder="Ex: 1500"
                  value={numero}
                  onChangeText={setNumero}
                  icon="home-outline"
                  keyboardType="numeric"
                />
              </View>
              <View style={{ flex: 1 }}>
                <AppInput
                  label="Complemento"
                  placeholder="Sala, andar..."
                  value={complemento}
                  onChangeText={setComplemento}
                  icon="layers-outline"
                  autoCapitalize="sentences"
                />
              </View>
            </View>

            <AppInput
              label="Bairro *"
              placeholder="Ex: Bela Vista"
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

        {/* ── Step 5: Verificação ── */}
        {step === 5 && (
          <View className="gap-4">
            {/* Upload area */}
            <AppCard className="gap-4">
              <View className="gap-1">
                <AppText variant="bodyMedium" className="font-semibold">
                  Documento profissional
                </AppText>
                <AppText variant="small" color="muted" style={{ lineHeight: 18 }}>
                  Envie uma foto do seu CRP, CRM ou outro documento oficial. Isso é opcional, mas aumenta sua credibilidade com os pacientes.
                </AppText>
              </View>

              <TouchableOpacity
                onPress={pickDocument}
                activeOpacity={0.8}
                style={{
                  borderWidth: 2,
                  borderStyle: "dashed",
                  borderColor: documentUri ? colors.secondary : colors.border,
                  borderRadius: 16,
                  padding: 28,
                  alignItems: "center",
                  gap: 12,
                  backgroundColor: documentUri ? colors.secondary + "08" : colors.background,
                }}
              >
                {documentUri ? (
                  <>
                    <Image
                      source={{ uri: documentUri }}
                      style={{ width: 120, height: 90, borderRadius: 10 }}
                      resizeMode="cover"
                    />
                    <AppText variant="small" color="secondary">Toque para substituir</AppText>
                  </>
                ) : (
                  <>
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 28,
                        backgroundColor: colors.secondary + "15",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name="cloud-upload-outline" size={28} color={colors.secondary} />
                    </View>
                    <View className="items-center gap-1">
                      <AppText variant="bodyMedium" color="muted" className="text-center font-medium">
                        Toque para selecionar
                      </AppText>
                      <AppText variant="caption" color="muted" className="text-center">
                        CRM, CRP ou outro documento (opcional)
                      </AppText>
                    </View>
                  </>
                )}
              </TouchableOpacity>

              {documentUri && (
                <View
                  className="flex-row items-center gap-2 p-3 rounded-xl"
                  style={{ backgroundColor: colors.secondary + "10" }}
                >
                  <Ionicons name="time-outline" size={18} color={colors.secondary} />
                  <View className="flex-1">
                    <AppText variant="smallMedium" color="secondary" className="font-semibold">
                      Aguardando verificação
                    </AppText>
                    <AppText variant="caption" color="muted">
                      A análise pode levar até 48 horas úteis.
                    </AppText>
                  </View>
                </View>
              )}
            </AppCard>

            {/* Security card */}
            <AppCard className="gap-3">
              <View className="flex-row items-center gap-2">
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: colors.secondary + "15",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons name="shield-checkmark" size={20} color={colors.secondary} />
                </View>
                <AppText variant="bodyMedium" className="font-semibold flex-1">
                  Segurança de nível bancário
                </AppText>
              </View>
              <AppText variant="small" color="muted" style={{ lineHeight: 18 }}>
                Seus documentos são criptografados com tecnologia de ponta, garantindo a mesma proteção usada pelos maiores bancos do Brasil.
              </AppText>
            </AppCard>
          </View>
        )}

        {/* ── Navigation ── */}
        {step === 1 ? (
          <View className="gap-3">
            <AppButton label="Continuar" onPress={goNext} variant="primary" />
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
                label="Finalizar configuração"
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
