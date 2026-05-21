import { useState, useCallback, useEffect } from "react";
import { GenderType, RegisterType, PatientProfile, ProfessionalProfile } from "../core/types";
import {
  profileFormService,
  PatientFormPayload,
  ProfessionalFormPayload,
} from "../services/profile/profileFormService";
import { useAuth } from "../core/auth/AuthContext";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isoToDisplay(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${d.getUTCFullYear()}`;
}

function displayToIso(display: string): string | undefined {
  if (display.length < 10) return undefined;
  const [day, month, year] = display.split("/");
  if (!day || !month || !year) return undefined;
  return new Date(`${year}-${month}-${day}T12:00:00.000Z`).toISOString();
}

function formatPhone(raw: string | null | undefined): string {
  if (!raw) return "";
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

function formatCpf(raw: string | null | undefined): string {
  if (!raw) return "";
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

function formatCep(raw: string | null | undefined): string {
  if (!raw) return "";
  const d = raw.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

function splitCommaList(raw: string | null | undefined): string[] {
  if (!raw) return [];
  return raw.split(",").map((g) => g.trim()).filter(Boolean);
}

function feeToDisplay(fee: number | null | undefined): string {
  if (!fee || fee <= 0) return "";
  return fee.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── CEP lookup ───────────────────────────────────────────────────────────────

interface CepResult {
  street: string;
  neighborhood: string;
  city: string;
  uf: string;
}

async function fetchCep(digits: string): Promise<CepResult | null> {
  const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
  if (!res.ok) return null;
  const data = await res.json();
  if (data.erro) return null;
  return {
    street: data.logradouro ?? "",
    neighborhood: data.bairro ?? "",
    city: data.localidade ?? "",
    uf: data.uf ?? "",
  };
}

// ─── Patient form hook ───────────────────────────────────────────────────────

export function usePatientProfileForm() {
  const { refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<GenderType | null>(null);
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");

  const [cep, setCep] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [addressComplement, setAddressComplement] = useState("");
  const [addressNeighborhood, setAddressNeighborhood] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressUf, setAddressUf] = useState("");
  const [isLookingUpCep, setIsLookingUpCep] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState<string | null>(null);

  const [mainComplaint, setMainComplaint] = useState("");
  const [therapyGoals, setTherapyGoals] = useState<string[]>([]);
  const [medications, setMedications] = useState<string[]>([]);
  const [hasPreviousTherapy, setHasPreviousTherapy] = useState<boolean | null>(null);
  const [hasPsychiatricFollowUp, setHasPsychiatricFollowUp] = useState<boolean | null>(null);
  const [hasHealthInsurance, setHasHealthInsurance] = useState<boolean | null>(null);
  const [healthInsuranceName, setHealthInsuranceName] = useState("");

  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const populate = useCallback((data: PatientProfile) => {
    setBirthDate(isoToDisplay(data.birth_date));
    setGender(data.gender ?? null);
    setPhone(formatPhone(data.phone));
    setCpf(formatCpf(data.cpf));
    setCep(formatCep(data.address_zipcode));
    setAddressStreet(data.address_street ?? "");
    setAddressNumber(data.address_number ?? "");
    setAddressComplement(data.address_complement ?? "");
    setAddressNeighborhood(data.address_neighborhood ?? "");
    setAddressCity(data.address_city ?? "");
    setAddressUf(data.address_state ?? "");
    setEmergencyName(data.emergency_contact_name ?? "");
    setEmergencyPhone(formatPhone(data.emergency_contact_phone));
    setEmergencyRelation(data.emergency_contact_relationship ?? null);
    setMainComplaint(data.main_complaint ?? "");
    setTherapyGoals(splitCommaList(data.therapy_goals));
    setMedications(splitCommaList(data.current_medications));
    setHasPreviousTherapy(data.has_previous_therapy ?? null);
    setHasPsychiatricFollowUp(data.has_psychiatric_follow_up ?? null);
    setHasHealthInsurance(data.has_health_insurance ?? null);
    setHealthInsuranceName(data.health_insurance_name ?? "");
    setIsDirty(false);
  }, []);

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await profileFormService.getPatientProfile();
      populate(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao carregar ficha.";
      setLoadError(msg === "SESSION_EXPIRED" ? "Sessão expirada. Faça login novamente." : msg);
    } finally {
      setIsLoading(false);
    }
  }, [populate]);

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const dirty = useCallback(() => setIsDirty(true), []);

  const lookupCep = useCallback(async (rawCep: string) => {
    const digits = rawCep.replace(/\D/g, "");
    if (digits.length !== 8) return;
    setIsLookingUpCep(true);
    setCepError(null);
    try {
      const result = await fetchCep(digits);
      if (!result) { setCepError("CEP não encontrado."); return; }
      setAddressStreet(result.street);
      setAddressNeighborhood(result.neighborhood);
      setAddressCity(result.city);
      setAddressUf(result.uf);
      dirty();
    } catch {
      setCepError("Erro ao buscar CEP. Verifique sua conexão.");
    } finally {
      setIsLookingUpCep(false);
    }
  }, [dirty]);

  const buildPayload = useCallback((): PatientFormPayload => {
    const payload: PatientFormPayload = {};
    const iso = displayToIso(birthDate);
    if (iso) payload.birth_date = iso;
    if (gender) payload.gender = gender;
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length >= 10) payload.phone = phoneDigits;
    const cpfDigits = cpf.replace(/\D/g, "");
    if (cpfDigits.length === 11) payload.cpf = cpfDigits;
    const cepDigits = cep.replace(/\D/g, "");
    if (cepDigits.length === 8) payload.address_zipcode = cepDigits;
    if (addressStreet.trim()) payload.address_street = addressStreet.trim();
    if (addressNumber.trim()) payload.address_number = addressNumber.trim();
    if (addressComplement.trim()) payload.address_complement = addressComplement.trim();
    if (addressNeighborhood.trim()) payload.address_neighborhood = addressNeighborhood.trim();
    if (addressCity.trim()) payload.address_city = addressCity.trim();
    if (addressUf.trim()) payload.address_state = addressUf.trim();
    if (emergencyName.trim()) payload.emergency_contact_name = emergencyName.trim();
    const emergencyPhoneDigits = emergencyPhone.replace(/\D/g, "");
    if (emergencyPhoneDigits.length >= 10) payload.emergency_contact_phone = emergencyPhoneDigits;
    if (emergencyRelation) payload.emergency_contact_relationship = emergencyRelation;
    if (mainComplaint.trim()) payload.main_complaint = mainComplaint.trim();
    if (therapyGoals.length) payload.therapy_goals = therapyGoals.join(", ");
    payload.current_medications = medications.join(", ");
    if (hasPreviousTherapy !== null) payload.has_previous_therapy = hasPreviousTherapy;
    if (hasPsychiatricFollowUp !== null) payload.has_psychiatric_follow_up = hasPsychiatricFollowUp;
    if (hasHealthInsurance !== null) payload.has_health_insurance = hasHealthInsurance;
    if (hasHealthInsurance && healthInsuranceName.trim()) payload.health_insurance_name = healthInsuranceName.trim();
    return payload;
  }, [birthDate, gender, phone, cpf, cep, addressStreet, addressNumber, addressComplement, addressNeighborhood, addressCity, addressUf, emergencyName, emergencyPhone, emergencyRelation, mainComplaint, therapyGoals, medications, hasPreviousTherapy, hasPsychiatricFollowUp, hasHealthInsurance, healthInsuranceName]);

  const save = useCallback(async () => {
    setSaveError(null);
    setSaveSuccess(false);
    setSaving(true);
    try {
      await profileFormService.updatePatientProfile(buildPayload());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      refreshUser().catch(() => {});
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }, [buildPayload, refreshUser]);

  return {
    isLoading, loadError, retry: load,
    birthDate, setBirthDate: (v: string) => { setBirthDate(v); dirty(); },
    gender, setGender: (v: GenderType | null) => { setGender(v); dirty(); },
    phone, setPhone: (v: string) => { setPhone(v); dirty(); },
    cpf, setCpf: (v: string) => { setCpf(v); dirty(); },
    cep, setCep: (v: string) => { setCep(v); dirty(); },
    addressStreet, setAddressStreet: (v: string) => { setAddressStreet(v); dirty(); },
    addressNumber, setAddressNumber: (v: string) => { setAddressNumber(v); dirty(); },
    addressComplement, setAddressComplement: (v: string) => { setAddressComplement(v); dirty(); },
    addressNeighborhood, setAddressNeighborhood: (v: string) => { setAddressNeighborhood(v); dirty(); },
    addressCity, setAddressCity: (v: string) => { setAddressCity(v); dirty(); },
    addressUf, setAddressUf: (v: string) => { setAddressUf(v); dirty(); },
    isLookingUpCep, cepError, lookupCep,
    emergencyName, setEmergencyName: (v: string) => { setEmergencyName(v); dirty(); },
    emergencyPhone, setEmergencyPhone: (v: string) => { setEmergencyPhone(v); dirty(); },
    emergencyRelation, setEmergencyRelation: (v: string | null) => { setEmergencyRelation(v); dirty(); },
    mainComplaint, setMainComplaint: (v: string) => { setMainComplaint(v); dirty(); },
    therapyGoals, setTherapyGoals: (v: string[]) => { setTherapyGoals(v); dirty(); },
    medications, setMedications: (v: string[]) => { setMedications(v); dirty(); },
    hasPreviousTherapy, setHasPreviousTherapy: (v: boolean | null) => { setHasPreviousTherapy(v); dirty(); },
    hasPsychiatricFollowUp, setHasPsychiatricFollowUp: (v: boolean | null) => { setHasPsychiatricFollowUp(v); dirty(); },
    hasHealthInsurance, setHasHealthInsurance: (v: boolean | null) => { setHasHealthInsurance(v); dirty(); },
    healthInsuranceName, setHealthInsuranceName: (v: string) => { setHealthInsuranceName(v); dirty(); },
    isDirty, saving, saveError, saveSuccess, save,
  };
}

// ─── Professional form hook ──────────────────────────────────────────────────

export function useProfessionalProfileForm() {
  const { refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState<GenderType | null>(null);
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");

  const [cep, setCep] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [addressComplement, setAddressComplement] = useState("");
  const [addressNeighborhood, setAddressNeighborhood] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressUf, setAddressUf] = useState("");
  const [isLookingUpCep, setIsLookingUpCep] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  const [registerType, setRegisterType] = useState<RegisterType | null>(null);
  const [professionalRegister, setProfessionalRegister] = useState("");
  const [registerState, setRegisterState] = useState<string | null>(null);
  const [specialty, setSpecialty] = useState("");
  const [approach, setApproach] = useState<string | null>(null);
  const [experienceYears, setExperienceYears] = useState(0);
  const [bio, setBio] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  const [onlineAppointments, setOnlineAppointments] = useState(false);
  const [inPersonAppointments, setInPersonAppointments] = useState(false);

  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const populate = useCallback((data: ProfessionalProfile) => {
    setBirthDate(isoToDisplay(data.birth_date));
    setGender(data.gender ?? null);
    setPhone(formatPhone(data.phone));
    setCpf(formatCpf(data.cpf));
    setCep(formatCep(data.address_zipcode));
    setAddressStreet(data.address_street ?? "");
    setAddressNumber(data.address_number ?? "");
    setAddressComplement(data.address_complement ?? "");
    setAddressNeighborhood(data.address_neighborhood ?? "");
    setAddressCity(data.address_city ?? "");
    setAddressUf(data.address_state ?? "");
    setRegisterType(data.register_type ?? null);
    setProfessionalRegister(data.professional_register ?? "");
    setRegisterState(data.register_state ?? null);
    setSpecialty(data.specialty ?? "");
    setApproach(data.approach ?? null);
    setExperienceYears(data.experience_years ?? 0);
    setBio(data.bio ?? "");
    setClinicName(data.clinic_name ?? "");
    setConsultationFee(feeToDisplay(data.consultation_price));
    setOnlineAppointments(data.offers_online_care ?? false);
    setInPersonAppointments(data.offers_in_person_care ?? false);
    setIsDirty(false);
  }, []);

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await profileFormService.getProfessionalProfile();
      populate(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao carregar ficha.";
      setLoadError(msg === "SESSION_EXPIRED" ? "Sessão expirada. Faça login novamente." : msg);
    } finally {
      setIsLoading(false);
    }
  }, [populate]);

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const dirty = useCallback(() => setIsDirty(true), []);

  const lookupCep = useCallback(async (rawCep: string) => {
    const digits = rawCep.replace(/\D/g, "");
    if (digits.length !== 8) return;
    setIsLookingUpCep(true);
    setCepError(null);
    try {
      const result = await fetchCep(digits);
      if (!result) { setCepError("CEP não encontrado."); return; }
      setAddressStreet(result.street);
      setAddressNeighborhood(result.neighborhood);
      setAddressCity(result.city);
      setAddressUf(result.uf);
      dirty();
    } catch {
      setCepError("Erro ao buscar CEP. Verifique sua conexão.");
    } finally {
      setIsLookingUpCep(false);
    }
  }, [dirty]);

  const buildPayload = useCallback((): ProfessionalFormPayload => {
    const payload: ProfessionalFormPayload = {};
    const iso = displayToIso(birthDate);
    if (iso) payload.birth_date = iso;
    if (gender) payload.gender = gender;
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length >= 10) payload.phone = phoneDigits;
    const cpfDigits = cpf.replace(/\D/g, "");
    if (cpfDigits.length === 11) payload.cpf = cpfDigits;
    const cepDigits = cep.replace(/\D/g, "");
    if (cepDigits.length === 8) payload.address_zipcode = cepDigits;
    if (addressStreet.trim()) payload.address_street = addressStreet.trim();
    if (addressNumber.trim()) payload.address_number = addressNumber.trim();
    if (addressComplement.trim()) payload.address_complement = addressComplement.trim();
    if (addressNeighborhood.trim()) payload.address_neighborhood = addressNeighborhood.trim();
    if (addressCity.trim()) payload.address_city = addressCity.trim();
    if (addressUf.trim()) payload.address_state = addressUf.trim();
    if (registerType) payload.register_type = registerType;
    if (professionalRegister.trim()) payload.professional_register = professionalRegister.trim();
    if (registerState) payload.register_state = registerState;
    if (specialty.trim()) payload.specialty = specialty.trim();
    if (approach) payload.approach = approach;
    payload.experience_years = experienceYears;
    if (bio.trim()) payload.bio = bio.trim();
    if (clinicName.trim()) payload.clinic_name = clinicName.trim();
    const fee = parseFloat(consultationFee.replace(/\./g, "").replace(",", "."));
    if (!isNaN(fee) && fee > 0) payload.consultation_price = fee;
    payload.offers_online_care = onlineAppointments;
    payload.offers_in_person_care = inPersonAppointments;
    return payload;
  }, [birthDate, gender, phone, cpf, cep, addressStreet, addressNumber, addressComplement, addressNeighborhood, addressCity, addressUf, registerType, professionalRegister, registerState, specialty, approach, experienceYears, bio, clinicName, consultationFee, onlineAppointments, inPersonAppointments]);

  const save = useCallback(async () => {
    setSaveError(null);
    setSaveSuccess(false);
    setSaving(true);
    try {
      await profileFormService.updateProfessionalProfile(buildPayload());
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      refreshUser().catch(() => {});
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Erro ao salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }, [buildPayload, refreshUser]);

  return {
    isLoading, loadError, retry: load,
    birthDate, setBirthDate: (v: string) => { setBirthDate(v); dirty(); },
    gender, setGender: (v: GenderType | null) => { setGender(v); dirty(); },
    phone, setPhone: (v: string) => { setPhone(v); dirty(); },
    cpf, setCpf: (v: string) => { setCpf(v); dirty(); },
    cep, setCep: (v: string) => { setCep(v); dirty(); },
    addressStreet, setAddressStreet: (v: string) => { setAddressStreet(v); dirty(); },
    addressNumber, setAddressNumber: (v: string) => { setAddressNumber(v); dirty(); },
    addressComplement, setAddressComplement: (v: string) => { setAddressComplement(v); dirty(); },
    addressNeighborhood, setAddressNeighborhood: (v: string) => { setAddressNeighborhood(v); dirty(); },
    addressCity, setAddressCity: (v: string) => { setAddressCity(v); dirty(); },
    addressUf, setAddressUf: (v: string) => { setAddressUf(v); dirty(); },
    isLookingUpCep, cepError, lookupCep,
    registerType, setRegisterType: (v: RegisterType | null) => { setRegisterType(v); dirty(); },
    professionalRegister, setProfessionalRegister: (v: string) => { setProfessionalRegister(v); dirty(); },
    registerState, setRegisterState: (v: string | null) => { setRegisterState(v); dirty(); },
    specialty, setSpecialty: (v: string) => { setSpecialty(v); dirty(); },
    approach, setApproach: (v: string | null) => { setApproach(v); dirty(); },
    experienceYears, setExperienceYears: (v: number) => { setExperienceYears(v); dirty(); },
    bio, setBio: (v: string) => { setBio(v); dirty(); },
    clinicName, setClinicName: (v: string) => { setClinicName(v); dirty(); },
    consultationFee, setConsultationFee: (v: string) => { setConsultationFee(v); dirty(); },
    onlineAppointments, setOnlineAppointments: (v: boolean) => { setOnlineAppointments(v); dirty(); },
    inPersonAppointments, setInPersonAppointments: (v: boolean) => { setInPersonAppointments(v); dirty(); },
    isDirty, saving, saveError, saveSuccess, save,
  };
}
