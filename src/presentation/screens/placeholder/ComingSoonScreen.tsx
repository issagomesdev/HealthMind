import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { EmptyState } from "../../components/ui/EmptyState";
import { TopBar } from "../../components/navigation/TopBar";
import { useNavigationContext } from "../../context/NavigationContext";

interface ComingSoonScreenProps {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  description?: string;
}

export function ComingSoonScreen({
  title,
  icon = "construct-outline",
  description = "Esta funcionalidade estará disponível em breve.",
}: ComingSoonScreenProps) {
  const { openMenu } = useNavigationContext();

  return (
    <ScreenContainer safeArea={false}>
      <TopBar title={title} onMenuPress={openMenu} />
      <EmptyState icon={icon} title={title} description={description} />
    </ScreenContainer>
  );
}
