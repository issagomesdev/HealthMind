import { PlanType, UserRole } from "../../core/types";

export interface UserEntity {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar: string | null;
  plan: PlanType;
  createdAt: string;
}

export function sanitizeUser(user: UserEntity): Omit<UserEntity, "password"> {
  const { password: _pwd, ...safe } = user;
  return safe;
}
