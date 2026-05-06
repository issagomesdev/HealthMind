import { Professional } from "../../core/types";
import fakeProfessionals from "../../data/fake/professionals.json";

// Future: GET /professionals/recommended, POST /professionals/match

class ProfessionalServiceImpl {
  async getRecommendedProfessionals(): Promise<Professional[]> {
    await new Promise((r) => setTimeout(r, 450));
    return fakeProfessionals as Professional[];
  }

  async getProfessionalsBySymptoms(symptoms: string[]): Promise<Professional[]> {
    await new Promise((r) => setTimeout(r, 600));
    // Simulate smart matching by shuffling and returning all (mock)
    return [...(fakeProfessionals as Professional[])].sort(() => Math.random() - 0.5);
  }

  async getProfessionalById(id: string): Promise<Professional | null> {
    await new Promise((r) => setTimeout(r, 200));
    return (fakeProfessionals as Professional[]).find((p) => p.id === id) ?? null;
  }
}

export const ProfessionalService = new ProfessionalServiceImpl();
