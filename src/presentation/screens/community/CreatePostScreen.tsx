import React, { useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppHeader } from "../../components/ui/AppHeader";
import { AppText } from "../../components/ui/AppText";
import { AppCard } from "../../components/ui/AppCard";
import { AppButton } from "../../components/ui/AppButton";
import { AppTextArea } from "../../components/forms/AppTextArea";
import { SuccessModal } from "../../components/ui/SuccessModal";
import { TopicSelector } from "../../components/community/TopicSelector";
import { CategoryTagsSelector } from "../../components/community/CategoryTagsSelector";
import { PostImagePicker } from "../../components/community/PostImagePicker";
import { useCreatePostController } from "../../controllers/useCreatePostController";
import { CommunityPost } from "../../../core/types";

interface CreatePostScreenProps {
  userName: string;
  onBack: () => void;
  onPublished: (post: CommunityPost) => void;
}

export function CreatePostScreen({
  userName,
  onBack,
  onPublished,
}: CreatePostScreenProps) {
  const insets = useSafeAreaInsets();
  const [showSuccess, setShowSuccess] = useState(false);
  const [publishedPost, setPublishedPost] = useState<CommunityPost | null>(null);

  const {
    topic,
    content,
    categories,
    imageUri,
    loading,
    error,
    setTopic,
    setContent,
    setImageUri,
    toggleCategory,
    handleSubmit,
    handleCancel,
  } = useCreatePostController({
    userName,
    onCancel: onBack,
    onSuccess: (post) => {
      setPublishedPost(post);
      setShowSuccess(true);
    },
  });

  return (
    <>
      <KeyboardAvoidingView
        className="flex-1 bg-background dark:bg-background-dark"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <AppHeader title="Nova publicação" showBack onBackPress={onBack} />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-5 pt-2 gap-5">
            {/* Topic */}
            <View className="gap-2">
              <AppText variant="bodyMedium" className="font-semibold">
                Tópico
              </AppText>
              <TopicSelector value={topic} onChange={setTopic} />
            </View>

            {/* Content */}
            <AppCard className="gap-3">
              <AppTextArea
                label="Sua publicação"
                placeholder="Compartilhe algo com a comunidade..."
                value={content}
                onChangeText={setContent}
                maxLength={1500}
                minHeight={160}
              />
            </AppCard>

            {error && (
              <AppText variant="small" color="error" className="text-center -mt-2">
                {error}
              </AppText>
            )}

            {/* Categories */}
            <View className="gap-3">
              <AppText variant="bodyMedium" className="font-semibold">
                Categorias relacionadas
              </AppText>
              <CategoryTagsSelector selected={categories} onToggle={toggleCategory} />
            </View>

            {/* Image */}
            <View className="gap-2">
              <AppText variant="bodyMedium" className="font-semibold">
                Imagem
              </AppText>
              <PostImagePicker value={imageUri} onChange={setImageUri} />
            </View>

            {/* Actions */}
            <View className="gap-3 pt-1">
              <AppButton
                label="Publicar"
                onPress={handleSubmit}
                variant="gradient"
                loading={loading}
              />
              <AppButton
                label="Cancelar"
                onPress={handleCancel}
                variant="outline"
                disabled={loading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={showSuccess}
        type="success"
        title="Publicação criada!"
        message="Sua publicação foi compartilhada com a comunidade."
        actionLabel="Ver feed"
        onClose={() => {
          if (publishedPost) onPublished(publishedPost);
        }}
      />
    </>
  );
}
