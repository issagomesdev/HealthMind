import React from "react";
import { View, ScrollView, ActivityIndicator, StatusBar } from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppText } from "../../components/ui/AppText";
import { SearchInput } from "../../components/contents/SearchInput";
import { ContentFilterChips } from "../../components/contents/ContentFilterChips";
import { FeaturedContentCard } from "../../components/contents/FeaturedContentCard";
import { ContentCard } from "../../components/contents/ContentCard";
import { RecommendedContentCard } from "../../components/contents/RecommendedContentCard";
import { useContentsController } from "../../controllers/useContentsController";
import { useTheme } from "../../../core/theme";

export function ContentsScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    contents,
    recommended,
    loading,
    searchQuery,
    activeCategory,
    setSearchQuery,
    setActiveCategory,
    loadContents,
  } = useContentsController();

  useFocusEffect(
    React.useCallback(() => {
      loadContents();
    }, [loadContents])
  );

  const featured = contents.find((c) => c.featured);
  const nonFeatured = contents.filter((c) => !c.featured);

  const statusBar = (
    <StatusBar
      barStyle={isDark ? "light-content" : "dark-content"}
      backgroundColor={colors.background}
    />
  );

  if (loading && contents.length === 0) {
    return (
      <View className="flex-1 bg-background dark:bg-background-dark">
        {statusBar}
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color={colors.secondary} size="large" />
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      {statusBar}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="px-5 pt-4 gap-5">
          {/* Heading */}
          <View className="gap-1 items-center">
            <AppText variant="heading2" className="font-bold text-center" color="secondary">
              Biblioteca de Conteúdos
            </AppText>
            <AppText variant="body" color="muted" className="text-center leading-6">
              Explore artigos e trilhas guiadas para o seu bem-estar.
            </AppText>
          </View>

          {/* Search */}
          <SearchInput value={searchQuery} onChangeText={setSearchQuery} />

          {/* Filters */}
          <ContentFilterChips active={activeCategory} onSelect={setActiveCategory} />

          {/* Featured */}
          {featured && <FeaturedContentCard content={featured} />}

          {/* Regular cards */}
          {nonFeatured.length > 0 && (
            <View className="gap-3">
              {nonFeatured.map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </View>
          )}

          {/* Recommended */}
          {recommended.length > 0 && (
            <View className="gap-1">
              <AppText variant="bodyMedium" className="font-semibold pb-1" color="secondary">
                Recomendados para você
              </AppText>
              <View className="bg-surface dark:bg-surface-dark rounded-2xl px-4"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.06,
                  shadowRadius: 10,
                  elevation: 3,
                }}
              >
                {recommended.map((item, idx) => (
                  <RecommendedContentCard
                    key={item.id}
                    content={item}
                    isLast={idx === recommended.length - 1}
                  />
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
