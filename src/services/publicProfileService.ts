import profilesData from "../data/fake/profiles/publicProfiles.json";
import type { PublicProfessionalProfile, PublicUserProfile } from "../types/publicProfile";

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

const professionals = profilesData.professionals as PublicProfessionalProfile[];
const users = profilesData.users as PublicUserProfile[];

export const publicProfileService = {
  async getProfessionalProfile(id: string): Promise<PublicProfessionalProfile | null> {
    await delay(200);
    return professionals.find((p) => p.id === id) ?? null;
  },

  async getUserProfile(id: string): Promise<PublicUserProfile | null> {
    await delay(200);
    return users.find((u) => u.id === id) ?? null;
  },
};
