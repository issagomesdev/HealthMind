import React from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppText } from "../../components/ui/AppText";
import { AppInput } from "../../components/ui/AppInput";
import { AppButton } from "../../components/ui/AppButton";
import { ScreenContainer } from "../../components/layout/ScreenContainer";
import { useRegisterController } from "../../controllers/useRegisterController";
import { UserRole } from "../../../core/types";

interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
}

export function RegisterScreen({ onRegisterSuccess, onNavigateToLogin }: RegisterScreenProps) {
  const {
    name, email, telefone, password, confirmPassword, role,
    errors, loading,
    setName, setEmail, setTelefone, setPassword, setConfirmPassword, setRole,
    handleRegister,
  } = useRegisterController({ onSuccess: onRegisterSuccess });

  return (
    <ScreenContainer avoidKeyboard>
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
        <View className="flex-row gap-2.5 p-1">
          {(["patient", "professional"] as UserRole[]).map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => setRole(r)}
              activeOpacity={0.8}
              className={`flex-1 h-[46px] rounded-full items-center justify-center border-2 ${role === r
                ? "bg-secondary dark:bg-secondary-dark border-secondary dark:border-secondary-dark"
                : "bg-transparent border-muted dark:border-muted-dark"
                }`}
            >
              <AppText
                variant="bodyMedium"
                className={`font-semibold ${role === r ? "text-white" : "text-subtle dark:text-subtle-dark"
                  }`}
              >
                {r === "patient" ? "PACIENTE" : "PROFISSIONAL"}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Formulário */}
        <View className="gap-4">
          {errors.general && (
            <View className="flex-row items-center gap-2 p-3.5 rounded-xl border border-error/30 bg-error/10 dark:border-error-dark/30 dark:bg-error-dark/10">
              <Ionicons name="alert-circle-outline" size={18} color="#EF4444" />
              <AppText variant="small" color="error" className="flex-1">
                {errors.general}
              </AppText>
            </View>
          )}

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
            label="Telefone"
            placeholder="(11) 99999-9999"
            value={telefone}
            onChangeText={setTelefone}
            icon="call-outline"
            keyboardType="phone-pad"
            error={errors.phone}
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
            label="Criar conta →"
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
    </ScreenContainer>
  );
}
