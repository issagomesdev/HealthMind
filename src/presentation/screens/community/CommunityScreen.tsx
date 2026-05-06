import React from "react";
import {
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../components/ui/AppText";
import { FloatingActionButton } from "../../components/ui/FloatingActionButton";
import { CommunityGuidelinesCard } from "../../components/community/CommunityGuidelinesCard";
import { PopularTopicCard } from "../../components/community/PopularTopicCard";
import { CommunityPostCard } from "../../components/community/CommunityPostCard";
import { useCommunityController } from "../../controllers/useCommunityController";
import { useTheme } from "../../../core/theme";

export function CommunityScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { topics, posts, loading, refreshing, loadData, refresh, likePost } =
    useCommunityController();

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [loadData])
  );

  const ListHeader = (
    <View className="gap-4 pb-2">
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
      {/* Custom header */}
      <View
        className="flex-row items-center justify-between px-5 bg-background dark:bg-background-dark"
        style={{ paddingTop: insets.top + 8, paddingBottom: 12 }}
      >
        <AppText variant="heading2" className="font-bold">
          Comunidade
        </AppText>
        <TouchableOpacity
          activeOpacity={0.7}
          className="w-9 h-9 rounded-full bg-surface dark:bg-surface-dark items-center justify-center"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <Ionicons name="search-outline" size={20} color={colors.subtle} />
        </TouchableOpacity>
      </View>

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
