import React from "react";
import { useAuth } from "../../../src/core/auth/AuthContext";
import { ProfessionalPatientsScreen } from "../../../src/presentation/screens/professional/patients/ProfessionalPatientsScreen";
import { RestrictedScreen } from "../../../src/presentation/screens/placeholder/RestrictedScreen";

export default function PatientsPage() {
  const { user } = useAuth();
  if (user?.role !== "professional") return <RestrictedScreen />;
  return <ProfessionalPatientsScreen />;
}
