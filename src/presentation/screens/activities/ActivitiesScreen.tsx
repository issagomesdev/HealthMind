import React, { useEffect } from "react";
import { View, FlatList, ActivityIndicator, StatusBar } from "react-native";
import { useFocusEffect } from "expo-router";
import { AppText } from "../../components/ui/AppText";
import { ActivityHeroCard } from "../../components/activities/ActivityHeroCard";
import { ActivityListCard } from "../../components/activities/ActivityListCard";
import { useActivitiesController } from "../../controllers/useActivitiesController";
import { useTheme } from "../../../core/theme";

export function ActivitiesScreen() {
  const { colors, isDark } = useTheme();
  const { activities, loading, loadActivities } = useActivitiesController();

  useFocusEffect(
    React.useCallback(() => {
      loadActivities();
    }, [loadActivities])
  );

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />
      {loading && activities.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.secondary} size="large" />
        </View>
      ) : (
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingBottom: 32 }}
          ListHeaderComponent={
            <View className="gap-4 px-5 pt-4 pb-2">
              <ActivityHeroCard />
              <AppText variant="bodyMedium" className="font-semibold pt-1">
                Recomendado para você
              </AppText>
            </View>
          }
          renderItem={({ item }) => (
            <View className="px-5">
              <ActivityListCard activity={item} />
            </View>
          )}
          ItemSeparatorComponent={() => <View className="h-3" />}
        />
      )}
    </View>
  );
}
