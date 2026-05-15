import React, { useState } from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppHeader } from "../../components/ui/AppHeader";
import { AppCard } from "../../components/ui/AppCard";
import { AppButton } from "../../components/ui/AppButton";
import { AppText } from "../../components/ui/AppText";
import { AppTextInput } from "../../components/forms/AppTextInput";
import { SuccessModal } from "../../components/ui/SuccessModal";
import { useAccountSettingsController } from "../../controllers/useAccountSettingsController";

interface AccountSettingsScreenProps {
  onBack: () => void;
}

export function AccountSettingsScreen({ onBack }: AccountSettingsScreenProps) {
  const insets = useSafeAreaInsets();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    name, email, username,
    currentPassword, newPassword, confirmNewPassword,
    loadingProfile, loadingPassword,
    errors,
    setName, setEmail, setUsername,
    setCurrentPassword, setNewPassword, setConfirmNewPassword,
    handleSaveProfile,
    handleChangePassword,
    handleCancel,
  } = useAccountSettingsController({
    onSuccess: () => setShowSuccess(true),
    onCancel: onBack,
  });

  return (
    <>
      <KeyboardAvoidingView
        className="flex-1 bg-background dark:bg-background-dark"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <AppHeader title="Configurações de conta" showBack onBackPress={onBack} />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="px-5 pt-2 gap-5">
            {/* Dados pessoais */}
            <AppCard className="gap-4">
              <AppText variant="bodyMedium" className="font-semibold">
                Dados pessoais
              </AppText>

              <AppTextInput
                label="Nome"
                value={name}
                onChangeText={setName}
                placeholder="Seu nome completo"
                autoCapitalize="words"
                error={errors.name}
              />

              <AppTextInput
                label="E-mail"
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

              <AppTextInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                placeholder="Ex: joaosilva"
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.username}
              />

              {errors.general && (
                <AppText variant="small" color="error">{errors.general}</AppText>
              )}

              <View className="gap-3 pt-1">
                <AppButton label="Salvar alterações" onPress={handleSaveProfile} variant="gradient" loading={loadingProfile} />
                <AppButton label="Cancelar" onPress={handleCancel} variant="outline" disabled={loadingProfile} />
              </View>
            </AppCard>

            {/* Alterar senha */}
            <AppCard className="gap-4">
              <AppText variant="bodyMedium" className="font-semibold">
                Alterar senha
              </AppText>

              <AppTextInput
                label="Senha atual"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="••••••••"
                secureTextEntry
                error={errors.currentPassword}
              />

              <AppTextInput
                label="Nova senha"
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Mínimo 8 caracteres"
                secureTextEntry
                error={errors.newPassword}
              />

              <AppTextInput
                label="Confirmar nova senha"
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
                placeholder="Repita a nova senha"
                secureTextEntry
                error={errors.confirmNewPassword}
              />

              {errors.passwordGeneral && (
                <AppText variant="small" color="error">{errors.passwordGeneral}</AppText>
              )}

              <AppButton
                label="Alterar senha"
                onPress={handleChangePassword}
                variant="secondary"
                loading={loadingPassword}
                className="rounded-full"
              />
            </AppCard>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={showSuccess}
        type="success"
        title="Dados atualizados!"
        message="Suas informações foram salvas com sucesso."
        actionLabel="OK"
        onClose={() => { setShowSuccess(false); onBack(); }}
      />
    </>
  );
}
