import React, { useState } from "react";
import { View, ScrollView, KeyboardAvoidingView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppHeader } from "../../components/ui/AppHeader";
import { AppText } from "../../components/ui/AppText";
import { AppCard } from "../../components/ui/AppCard";
import { AppButton } from "../../components/ui/AppButton";
import { AppTextArea } from "../../components/forms/AppTextArea";
import { SuccessModal } from "../../components/ui/SuccessModal";
import { PrivacyInfoCard } from "../../components/diary/PrivacyInfoCard";
import { InspirationCard } from "../../components/diary/InspirationCard";
import { FeelingTagsSelector } from "../../components/diary/FeelingTagsSelector";
import { ImagePickerField } from "../../components/diary/ImagePickerField";
import { useCreateDiaryController } from "../../controllers/useCreateDiaryController";

interface CreateDiaryEntryScreenProps {
  onBack: () => void;
  onSaved: () => void;
}

export function CreateDiaryEntryScreen({ onBack, onSaved }: CreateDiaryEntryScreenProps) {
  const insets = useSafeAreaInsets();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    content,
    feelings,
    imageUri,
    loading,
    error,
    setContent,
    setImageUri,
    toggleFeeling,
    handleSubmit,
    handleCancel,
  } = useCreateDiaryController({
    onCancel: onBack,
    onSuccess: () => setShowSuccess(true),
  });

  return (
    <>
      <KeyboardAvoidingView
        className="flex-1 bg-background dark:bg-background-dark"
        behavior="padding"
      >
        <AppHeader showBack onBackPress={onBack} />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-5 pt-2 gap-5">
            {/* Heading */}
            <View className="gap-1">
              <AppText variant="heading2" className="font-bold" color="secondary">
                Diário Emocional
              </AppText>
              <AppText variant="body" color="muted">
                Registre seus sentimentos e emoções
              </AppText>
            </View>

            {/* Privacy notice */}
            <PrivacyInfoCard />

            {/* Content */}
            <AppCard className="gap-3">
              <AppTextArea
                label="Como foi seu dia?"
                placeholder="Escreva aqui seus pensamentos, sentimentos ou eventos importantes..."
                value={content}
                onChangeText={setContent}
                maxLength={1000}
                minHeight={140}
              />
            </AppCard>

            {/* Validation error */}
            {error && (
              <AppText variant="small" color="error" className="text-center -mt-2">
                {error}
              </AppText>
            )}

            {/* Inspiration */}
            <InspirationCard />

            {/* Feeling tags */}
            <View className="gap-3">
              <AppText variant="bodyMedium" className="font-semibold">
                Sentimentos de hoje
              </AppText>
              <FeelingTagsSelector selected={feelings} onToggle={toggleFeeling} />
            </View>

            {/* Image picker */}
            <ImagePickerField value={imageUri} onChange={setImageUri} />

            {/* Actions */}
            <View className="gap-3 pt-1">
              <AppButton
                label="Salvar diário"
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
        title="Diário salvo!"
        message="Seu registro emocional foi salvo com sucesso."
        actionLabel="Continuar"
        onClose={onSaved}
      />
    </>
  );
}
