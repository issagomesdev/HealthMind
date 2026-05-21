import { useEffect, useRef } from "react";
import { useColorScheme } from "nativewind";
import { useTheme } from "./ThemeContext";

/**
 * Força o esquema "light" no NativeWind enquanto o componente está montado.
 * Na desmontagem, restaura automaticamente a preferência salva do usuário.
 *
 * Use em telas pré-autenticação (splash, onboarding, login, cadastro)
 * para garantir que NativeWind dark: classes e useTheme() sempre retornem
 * cores light, independente do tema configurado pelo usuário.
 */
export function useForceLightScheme() {
  const { setColorScheme } = useColorScheme();
  const { themeMode } = useTheme();

  const originalModeRef = useRef(themeMode);
  const setColorSchemeRef = useRef(setColorScheme);
  setColorSchemeRef.current = setColorScheme;

  useEffect(() => {
    setColorSchemeRef.current("light");
    return () => {
      setColorSchemeRef.current(originalModeRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
