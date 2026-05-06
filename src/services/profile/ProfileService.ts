import { UserProfile } from "../../core/types";

// Future: GET /profile, PUT /profile

const mockProfile: UserProfile = {
  id: "u1",
  name: "Mariana Silva",
  email: "mariana@email.com",
  phone: "(11) 99999-0001",
  avatar: null,
  plan: "PREMIUM",
  badge: "Exploradora Mindful",
  level: 4,
};

class ProfileServiceImpl {
  private profile: UserProfile = { ...mockProfile };

  async getProfile(): Promise<UserProfile> {
    await new Promise((r) => setTimeout(r, 300));
    return { ...this.profile };
  }

  async updateProfile(data: Partial<Pick<UserProfile, "name" | "email" | "phone">>): Promise<UserProfile> {
    await new Promise((r) => setTimeout(r, 500));
    this.profile = { ...this.profile, ...data };
    return { ...this.profile };
  }
}

export const ProfileService = new ProfileServiceImpl();
