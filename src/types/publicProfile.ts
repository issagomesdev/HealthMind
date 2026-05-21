export interface PublicProfessionalProfile {
  id: string;
  name: string;
  avatarInitials: string;
  specialty: string;
  bio: string;
  approaches: string[];
  areasOfExpertise: string[];
  rating: number;
  reviewCount: number;
  yearsOfExperience: number;
  city: string;
  state: string;
  appointmentTypes: string[];
  nextAvailability: string;
  isOnline: boolean;
  lastSeen: string | null;
  crp: string;
  username: string;
}

export interface PublicUserProfile {
  id: string;
  name: string;
  username: string;
  avatarInitials: string;
  bio: string;
  role: "patient" | "community";
  city?: string;
  state?: string;
  interests: string[];
  joinedAt: string;
  isOnline: boolean;
  lastSeen: string | null;
  badges: string[];
}

export type PublicProfile = PublicProfessionalProfile | PublicUserProfile;
