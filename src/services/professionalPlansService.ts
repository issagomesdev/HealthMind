import plansData from "../data/fake/professionalPlans.json";

export interface PlanFeature {
  label: string;
  included: boolean;
}

export interface ProfessionalPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  priceLabel: string;
  description: string;
  buttonLabel: string;
  isRecommended: boolean;
  isCurrent: boolean;
  features: PlanFeature[];
}

export interface ComparisonRow {
  feature: string;
  basic: string;
  premium: string;
  clinic: string;
}

export interface PlanTestimonial {
  name: string;
  specialty: string;
  text: string;
  rating: number;
}

const delay = (ms = 200) => new Promise<void>((r) => setTimeout(r, ms));

class ProfessionalPlansService {
  async getPlans(): Promise<ProfessionalPlan[]> {
    await delay();
    return plansData.plans as ProfessionalPlan[];
  }

  async getComparison(): Promise<ComparisonRow[]> {
    await delay();
    return plansData.comparison as ComparisonRow[];
  }

  async getTestimonial(): Promise<PlanTestimonial> {
    await delay();
    return plansData.testimonial;
  }
}

export const professionalPlansService = new ProfessionalPlansService();
