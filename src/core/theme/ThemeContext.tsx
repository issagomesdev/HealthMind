import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useColorScheme as useNativeWindScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeMode } from "../types";
import { lightColors, darkColors, ColorTokens } from "./colors";

const THEME_KEY = "healthmind_theme";

interface ThemeContextValue {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  colors: ColorTokens;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  themeMode: "system",
  setThemeMode: () => {},
  colors: lightColors,
  isDark: false,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const { colorScheme, setColorScheme } = useNativeWindScheme();

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((saved) => {
      if (saved === "light" || saved === "dark" || saved === "system") {
        setThemeModeState(saved);
        setColorScheme(saved === "system" ? "system" : saved);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    // Aplica sincronamente para resposta visual imediata
    setThemeModeState(mode);
    setColorScheme(mode === "system" ? "system" : mode);
    // Persiste em background sem bloquear o render
    AsyncStorage.setItem(THEME_KEY, mode);
  }, [setColorScheme]);

  const isDark =
    themeMode === "dark" ||
    (themeMode === "system" && colorScheme === "dark");

  const colors = useMemo(
    () => (isDark ? darkColors : lightColors),
    [isDark]
  );

  const value = useMemo(
    () => ({ themeMode, setThemeMode, colors, isDark }),
    [themeMode, setThemeMode, colors, isDark]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
