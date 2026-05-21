import { API_ROUTES } from "../../core/constants/api";
import { AuthService } from "../auth/AuthService";
import { GenderType, RegisterType, PatientProfile, ProfessionalProfile } from "../../core/types";

export interface PatientFormPayload {
  birth_date?: string;
  gender?: GenderType;
  phone?: string;
  cpf?: string;
  address_zipcode?: string;
  address_street?: string;
  address_number?: string;
  address_complement?: string;
  address_neighborhood?: string;
  address_city?: string;
  address_state?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_relationship?: string;
  main_complaint?: string;
  therapy_goals?: string;
  current_medications?: string;
  has_previous_therapy?: boolean;
  has_psychiatric_follow_up?: boolean;
  has_health_insurance?: boolean;
  health_insurance_name?: string;
}

export interface ProfessionalFormPayload {
  birth_date?: string;
  gender?: GenderType;
  phone?: string;
  cpf?: string;
  register_type?: RegisterType;
  professional_register?: string;
  register_state?: string;
  specialty?: string;
  approach?: string;
  experience_years?: number;
  bio?: string;
  clinic_name?: string;
  consultation_price?: number;
  offers_online_care?: boolean;
  offers_in_person_care?: boolean;
  address_zipcode?: string;
  address_street?: string;
  address_number?: string;
  address_complement?: string;
  address_neighborhood?: string;
  address_city?: string;
  address_state?: string;
}

class ProfileFormServiceImpl {
  private async authHeader(): Promise<Record<string, string>> {
    const token = await AuthService.getToken();
    if (!token) throw new Error("SESSION_EXPIRED");
    return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  }

  async getPatientProfile(): Promise<PatientProfile> {
    const headers = await this.authHeader();
    const response = await fetch(API_ROUTES.patients.me, { headers });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) throw new Error("SESSION_EXPIRED");
      const err = await response.json().catch(() => ({}));
      throw new Error((err as any).message ?? "Erro ao carregar ficha.");
    }
    return response.json() as Promise<PatientProfile>;
  }

  async getProfessionalProfile(): Promise<ProfessionalProfile> {
    const headers = await this.authHeader();
    const response = await fetch(API_ROUTES.professionals.me, { headers });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) throw new Error("SESSION_EXPIRED");
      const err = await response.json().catch(() => ({}));
      throw new Error((err as any).message ?? "Erro ao carregar ficha.");
    }
    return response.json() as Promise<ProfessionalProfile>;
  }

  async updatePatientProfile(payload: PatientFormPayload): Promise<void> {
    const headers = await this.authHeader();
    const response = await fetch(API_ROUTES.patients.me, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error((err as any).message ?? "Erro ao salvar perfil.");
    }
  }

  async updateProfessionalProfile(payload: ProfessionalFormPayload): Promise<void> {
    const headers = await this.authHeader();
    const response = await fetch(API_ROUTES.professionals.me, {
      method: "PUT",
      headers,
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error((err as any).message ?? "Erro ao salvar perfil.");
    }
  }
}

export const profileFormService = new ProfileFormServiceImpl();
