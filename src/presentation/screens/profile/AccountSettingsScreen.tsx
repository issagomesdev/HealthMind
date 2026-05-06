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
import { useAuth } from "../../../core/auth/AuthContext";

interface AccountSettingsScreenProps {
  onBack: () => void;
}

export function AccountSettingsScreen({ onBack }: AccountSettingsScreenProps) {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    name, email, phone, password, confirmPassword,
    loading, error,
    setName, setEmail, setPhone, setPassword, setConfirmPassword,
    handleSave, handleCancel,
  } = useAccountSettingsController({
    initialName: user?.name ?? "",
    initialEmail: user?.email ?? "",
    initialPhone: "",
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
            <AppCard className="gap-4">
              <AppText variant="bodyMedium" className="font-semibold">
                Dados pessoais
              </AppText>
              <AppTextInput label="Nome" value={name} onChangeText={setName} placeholder="Seu nome completo" />
              <AppTextInput label="E-mail" value={email} onChangeText={setEmail} placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none" />
              <AppTextInput label="Telefone" value={phone} onChangeText={setPhone} placeholder="(11) 99999-0000" keyboardType="phone-pad" />
            </AppCard>

            <AppCard className="gap-4">
              <AppText variant="bodyMedium" className="font-semibold">
                Alterar senha
              </AppText>
              <AppTextInput label="Nova senha" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
              <AppTextInput label="Confirmar senha" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="••••••••" secureTextEntry />
            </AppCard>

            {error && (
              <AppText variant="small" color="error" className="text-center">
                {error}
              </AppText>
            )}

            <View className="gap-3">
              <AppButton label="Salvar alterações" onPress={handleSave} variant="gradient" loading={loading} />
              <AppButton label="Cancelar" onPress={handleCancel} variant="outline" disabled={loading} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={showSuccess}
        type="success"
        title="Dados atualizados!"
        message="Suas informações foram salvas com sucesso."
        actionLabel="OK"
        onClose={onBack}
      />
    </>
  );
}
