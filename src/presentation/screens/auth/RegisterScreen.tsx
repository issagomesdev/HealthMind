import React, { useEffect } from "react";
import { View, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../components/ui/AppText";
import { AppInput } from "../../components/ui/AppInput";
import { AppButton } from "../../components/ui/AppButton";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { useRegisterController } from "../../controllers/useRegisterController";
import { UserRole } from "../../../core/types";

import { AuthResult } from "../../../core/types";
import { ErrorToast, useErrorToast } from "../../components/ui/ErrorToast";

interface RegisterScreenProps {
  onRegisterSuccess: (result: AuthResult) => void;
  onNavigateToLogin: () => void;
}

export function RegisterScreen({ onRegisterSuccess, onNavigateToLogin }: RegisterScreenProps) {
  const {
    name, email, password, confirmPassword, role,
    errors, loading,
    setName, setEmail, setPassword, setConfirmPassword, setRole,
    handleRegister,
  } = useRegisterController({ onSuccess: onRegisterSuccess });
  const { error: toastMessage, showError } = useErrorToast();
  useEffect(() => { if (errors.general) showError(errors.general); }, [errors.general]);

  return (
    <ScreenContainer avoidKeyboard edges={["top", "bottom"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow px-7 pt-8 pb-10 gap-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center gap-2.5">
          <View className="flex-row items-center gap-2.5 justify-center">
            <AppText variant="heading3" color="secondary" className="font-bold">
              HealthMind
            </AppText>
          </View>

          <View className="items-center">
            <AppText variant="heading1" className="text-center font-bold">
              Criar conta
            </AppText>
            <AppText variant="body" color="muted" className="text-center leading-snug">
              Comece sua jornada hoje.
            </AppText>
          </View>
        </View>

        {/* Tipo de usuário */}
        <View className="flex-row gap-3">
          {([
            { role: "patient", label: "SOU PACIENTE", icon: "person-outline" },
            { role: "professional", label: "SOU PROFISSIONAL", icon: "medical-outline" },
          ] as { role: UserRole; label: string; icon: keyof typeof Ionicons.glyphMap }[]).map((item) => {
            const selected = role === item.role;
            const iconName = selected
              ? (item.icon.replace("-outline", "") as keyof typeof Ionicons.glyphMap)
              : item.icon;
            return (
              <TouchableOpacity
                key={item.role}
                onPress={() => setRole(item.role)}
                activeOpacity={0.8}
                style={{ flex: 1 }}
                className={`rounded-2xl py-5 items-center gap-2.5 border-2 ${selected
                    ? "bg-transparent border-secondary dark:border-secondary-dark"
                    : "bg-surface dark:bg-surface-dark border-transparent"
                  }`}
              >
                <Ionicons
                  name={iconName}
                  size={28}
                  color={selected ? "#2A9D8F" : "#9CA3AF"}
                />
                <AppText
                  variant="small"
                  className={`text-center ${selected
                      ? "text-secondary dark:text-secondary-dark"
                      : "text-content dark:text-content-dark"
                    }`}
                  style={{ fontWeight: "bold" }}
                >
                  {item.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Formulário */}
        <View className="gap-4">
          <AppInput
            label="Nome completo"
            placeholder="Ex: João Silva"
            value={name}
            onChangeText={setName}
            icon="person-outline"
            autoCapitalize="words"
            error={errors.name}
          />

          <AppInput
            label="E-mail"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            icon="mail-outline"
            keyboardType="email-address"
            autoComplete="email"
            error={errors.email}
          />

          <AppInput
            label="Senha"
            placeholder="Mínimo 8 caracteres"
            value={password}
            onChangeText={setPassword}
            icon="lock-closed-outline"
            isPassword
            error={errors.password}
          />

          <AppInput
            label="Confirmar senha"
            placeholder="Repita a senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            icon="shield-checkmark-outline"
            isPassword
            error={errors.confirmPassword}
          />

          <AppButton
            label="Criar conta"
            onPress={handleRegister}
            loading={loading}
            variant="secondary"
            className="mt-1 rounded-full"
          />
        </View>

        <TouchableOpacity onPress={onNavigateToLogin} className="items-center py-2">
          <AppText variant="bodyMedium" color="secondary">Já tenho uma conta</AppText>
        </TouchableOpacity>
      </ScrollView>
      <ErrorToast message={toastMessage} />
    </ScreenContainer>
  );
}
