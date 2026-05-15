import React from "react";
import {
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { AppText } from "../../components/ui/AppText";
import { TopBar } from "../../components/navigation/TopBar";
import { FloatingActionButton } from "../../components/ui/FloatingActionButton";
import { CommunityGuidelinesCard } from "../../components/community/CommunityGuidelinesCard";
import { PopularTopicCard } from "../../components/community/PopularTopicCard";
import { CommunityPostCard } from "../../components/community/CommunityPostCard";
import { useCommunityController } from "../../controllers/useCommunityController";
import { useNavigationContext } from "../../context/NavigationContext";
import { useTheme } from "../../../core/theme";

export function CommunityScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { openMenu } = useNavigationContext();
  const { topics, posts, loading, refreshing, loadData, refresh, likePost } =
    useCommunityController();

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [loadData])
  );

  const ListHeader = (
    <View className="gap-4 pb-2">
      {/* Page header */}
      <View className="gap-1 pt-2 pb-1">
        <AppText variant="heading1" className="font-bold">
          Comunidade
        </AppText>
        <AppText variant="body" color="muted">
          Compartilhe experiências e apoie outras pessoas.
        </AppText>
      </View>

      {/* Guidelines */}
      <CommunityGuidelinesCard />

      {/* Popular topics */}
      <View className="gap-3">
        <AppText variant="bodyMedium" className="font-bold text-xl">
          Tópicos Populares
        </AppText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 12, paddingRight: 4 }}
        >
          {topics.map((topic) => (
            <PopularTopicCard key={topic.id} topic={topic} />
          ))}
        </ScrollView>
      </View>

      {/* Feed header */}
      <View className="flex-row items-center justify-between pt-1">
        <AppText variant="bodyMedium" className="font-bold text-xl">
          Feed Recente
        </AppText>
        <TouchableOpacity activeOpacity={0.7}>
          <AppText variant="small" color="secondary" className="font-semibold">
            Filtrar
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <TopBar title="HealthMind" onMenuPress={openMenu} />

      {loading && posts.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.secondary} size="large" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 100,
            gap: 12,
          }}
          ListHeaderComponent={ListHeader}
          refreshing={refreshing}
          onRefresh={refresh}
          renderItem={({ item }) => (
            <CommunityPostCard post={item} onLike={likePost} />
          )}
        />
      )}

      <FloatingActionButton
        onPress={() => router.push("/(protected)/community-create")}
        icon="add"
      />
    </View>
  );
}
