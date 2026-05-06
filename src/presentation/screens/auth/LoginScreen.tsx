import React from "react";
import { View, Image, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../components/ui/AppText";
import { AppInput } from "../../components/ui/AppInput";
import { AppButton } from "../../components/ui/AppButton";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { useLoginController } from "../../controllers/useLoginController";

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
  onForgotPassword: () => void;
}

export function LoginScreen({ onLoginSuccess, onNavigateToRegister, onForgotPassword }: LoginScreenProps) {
  const { email, password, errors, loading, setEmail, setPassword, handleLogin } =
    useLoginController({ onSuccess: onLoginSuccess });

  return (
    <ScreenContainer avoidKeyboard>
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow px-7 pt-6 pb-10 gap-6"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center gap-2.5 justify-center">
          <AppText variant="heading3" color="secondary" className="font-bold">
            HealthMind
          </AppText>
        </View>

        <View className="items-center gap-2">
          <AppText variant="heading1" className="text-center font-bold">
            Bem-vindo de volta
          </AppText>
          <AppText variant="body" color="muted" className="text-center leading-snug">
            Acesse sua conta para continuar sua jornada.
          </AppText>
        </View>

        <View className="gap-5">
          {errors.general && (
            <View className="flex-row items-center gap-2 p-3.5 rounded-xl border border-error/30 bg-error/10 dark:border-error-dark/30 dark:bg-error-dark/10">
              <Ionicons name="alert-circle-outline" size={18} color="#EF4444" />
              <AppText variant="small" color="error">{errors.general}</AppText>
            </View>
          )}

          <AppInput
            label="E-MAIL"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            icon="mail-outline"
            keyboardType="email-address"
            autoComplete="email"
            error={errors.email}
          />

          <View className="gap-1.5">
            <View className="flex-row justify-between items-center">
              <AppText variant="label" color="muted" className="uppercase tracking-[0.8px]">
                SENHA
              </AppText>
              <TouchableOpacity onPress={onForgotPassword}>
                <AppText variant="smallMedium" color="secondary">
                  Esqueci minha senha
                </AppText>
              </TouchableOpacity>
            </View>
            <AppInput
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              icon="lock-closed-outline"
              isPassword
              error={errors.password}
            />
          </View>

          <LinearGradient
            colors={["#2D3E50", "#4C78D9"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="rounded-full overflow-hidden mt-1"
          >
            <AppButton
              label="Entrar"
              onPress={handleLogin}
              loading={loading}
              className="bg-transparent rounded-full"
            />
          </LinearGradient>
        </View>

        <View className="flex-row items-center gap-3">
          <View className="flex-1 h-px bg-border dark:bg-border-dark" />
          <AppText variant="small" color="muted">ou</AppText>
          <View className="flex-1 h-px bg-border dark:bg-border-dark" />
        </View>

        <View className="flex-row justify-center items-center flex-wrap">
          <AppText variant="body" color="muted">Ainda não tem uma conta? </AppText>
          <TouchableOpacity onPress={onNavigateToRegister}>
            <AppText variant="bodyMedium" color="secondary" className="font-semibold">
              Cadastre-se
            </AppText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
