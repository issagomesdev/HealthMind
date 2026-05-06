import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { TopBar } from "../../components/navigation/TopBar";
import { AppText } from "../../components/ui/AppText";
import { ActivitiesScreen } from "./ActivitiesScreen";
import { ProgressScreen } from "./ProgressScreen";
import { ContentsScreen } from "./ContentsScreen";
import { useNavigationContext } from "../../context/NavigationContext";
import { useTheme } from "../../../core/theme";

type Tab = "atividades" | "progresso" | "biblioteca";

const TABS: { key: Tab; label: string }[] = [
  { key: "atividades", label: "Atividades" },
  { key: "progresso",  label: "Progresso"  },
  { key: "biblioteca", label: "Biblioteca" },
];

export function ActivityHubScreen() {
  const { openMenu } = useNavigationContext();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>("atividades");

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <TopBar title="HealthMind" onMenuPress={openMenu} />

      {/* Top tab switcher */}
      <View className="flex-row mx-5 mb-1 bg-muted dark:bg-muted-dark rounded-2xl p-1 gap-1">
        {TABS.map(({ key, label }) => {
          const isActive = activeTab === key;
          return (
            <TouchableOpacity
              key={key}
              onPress={() => setActiveTab(key)}
              activeOpacity={0.8}
              className={`flex-1 py-2 rounded-xl items-center ${
                isActive ? "bg-surface dark:bg-surface-dark" : ""
              }`}
              style={
                isActive
                  ? {
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.08,
                      shadowRadius: 4,
                      elevation: 2,
                    }
                  : {}
              }
            >
              <AppText
                variant="caption"
                className={`font-semibold ${isActive ? "" : ""}`}
                color={isActive ? "secondary" : "muted"}
              >
                {label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tab content */}
      <View className="flex-1">
        {activeTab === "atividades" && <ActivitiesScreen />}
        {activeTab === "progresso"  && <ProgressScreen />}
        {activeTab === "biblioteca" && <ContentsScreen />}
      </View>
    </View>
  );
}
