import React, { useEffect } from "react";
import { View, FlatList, ActivityIndicator } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { TopBar } from "../../components/navigation/TopBar";
import { AppText } from "../../components/ui/AppText";
import { FloatingActionButton } from "../../components/ui/FloatingActionButton";
import { DiaryEntryCard } from "../../components/diary/DiaryEntryCard";
import { useDiaryListController } from "../../controllers/useDiaryListController";
import { useNavigationContext } from "../../context/NavigationContext";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../../core/theme";

export function DiaryListScreen() {
  const router = useRouter();
  const { openMenu } = useNavigationContext();
  const { colors } = useTheme();
  const { entries, loading, refreshing, loadEntries, refresh, deleteEntry } =
    useDiaryListController();

  useFocusEffect(
    React.useCallback(() => {
      loadEntries();
    }, [loadEntries])
  );

  return (
    <ScreenContainer safeArea edges={["top", "bottom"]}>
      <TopBar title="HealthMind" onMenuPress={openMenu} />

      {/* Heading */}
      <View className="px-5 pt-2 pb-4 gap-1">
        <AppText variant="heading2" className="font-bold" color="secondary">
          Diário Emocional
        </AppText>
        <AppText variant="body" color="muted">
          Seus registros de bem-estar
        </AppText>
      </View>

      {loading && entries.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.secondary} size="large" />
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 100,
            gap: 12,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={refresh}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center gap-4 pt-20">
              <View className="w-20 h-20 rounded-full bg-secondary/10 dark:bg-secondary-dark/15 items-center justify-center">
                <Ionicons name="book-outline" size={36} color={colors.secondary} />
              </View>
              <View className="items-center gap-1.5">
                <AppText variant="bodyMedium" className="font-semibold text-center">
                  Nenhum registro ainda
                </AppText>
                <AppText variant="body" color="muted" className="text-center">
                  Toque no botão + para começar{"\n"}seu diário emocional
                </AppText>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <DiaryEntryCard entry={item} onDelete={deleteEntry} />
          )}
        />
      )}

      <FloatingActionButton
        onPress={() => router.push("/(protected)/diary-create")}
      />
    </ScreenContainer>
  );
}
