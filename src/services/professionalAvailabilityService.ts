import availabilityData from "../data/fake/professionalAvailability.json";
import {
  ProfessionalAvailability,
  UnavailablePeriod,
  AvailableSlot,
} from "../types/professionalAvailability";

const delay = (ms = 400) => new Promise<void>((r) => setTimeout(r, ms));

let state: ProfessionalAvailability = {
  ...(availabilityData as ProfessionalAvailability),
};

class ProfessionalAvailabilityService {
  async getProfessionalAvailability(): Promise<ProfessionalAvailability> {
    await delay();
    return {
      ...state,
      weeklySchedule: { ...state.weeklySchedule },
      unavailablePeriods: [...state.unavailablePeriods],
    };
  }

  async updateProfessionalAvailability(
    payload: Partial<ProfessionalAvailability>
  ): Promise<ProfessionalAvailability> {
    await delay(600);
    state = { ...state, ...payload };
    return { ...state };
  }

  async addUnavailablePeriod(
    period: Omit<UnavailablePeriod, "id">
  ): Promise<UnavailablePeriod> {
    await delay();
    const newPeriod = { ...period, id: `up${Date.now()}` };
    state.unavailablePeriods = [...state.unavailablePeriods, newPeriod];
    return newPeriod;
  }

  async removeUnavailablePeriod(id: string): Promise<void> {
    await delay();
    state.unavailablePeriods = state.unavailablePeriods.filter(
      (p) => p.id !== id
    );
  }

  async getAvailableTimeSlots(): Promise<AvailableSlot[]> {
    await delay(300);
    const slots: AvailableSlot[] = [];
    const now = new Date();
    const dayNames = [
      "domingo",
      "segunda",
      "terca",
      "quarta",
      "quinta",
      "sexta",
      "sabado",
    ] as const;
    let count = 0;
    for (let i = 0; i < 14 && count < 5; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const dayKey = dayNames[d.getDay()];
      const dayConfig = state.weeklySchedule[dayKey];
      if (!dayConfig.enabled || !state.isGenerallyAvailable) continue;
      for (const interval of dayConfig.intervals) {
        if (count >= 5) break;
        const label =
          i === 0
            ? `Hoje, ${interval.start}`
            : i === 1
            ? `Amanhã, ${interval.start}`
            : `${d.toLocaleDateString("pt-BR", { weekday: "long" })}, ${interval.start}`;
        slots.push({
          date: d.toISOString().split("T")[0],
          time: interval.start,
          label,
        });
        count++;
      }
    }
    return slots;
  }

  async resetAvailabilityToDefault(): Promise<ProfessionalAvailability> {
    await delay(600);
    state = { ...(availabilityData as ProfessionalAvailability) };
    return { ...state };
  }
}

export const professionalAvailabilityService =
  new ProfessionalAvailabilityService();
