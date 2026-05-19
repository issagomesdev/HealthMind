import profileData from "../data/fake/professionalProfile.json";

export interface ProfessionalStats {
  activePatients: number;
  appointmentsThisMonth: number;
  averageRating: number;
  plan: string;
}

const delay = (ms = 200) => new Promise<void>((r) => setTimeout(r, ms));

class ProfessionalProfileService {
  async getStats(): Promise<ProfessionalStats> {
    await delay();
    return profileData.stats;
  }
}

export const professionalProfileService = new ProfessionalProfileService();
