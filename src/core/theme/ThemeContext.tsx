import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
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
        applyTheme(saved);
      }
    });
  }, []);

  const applyTheme = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    if (mode === "system") {
      setColorScheme("system");
    } else {
      setColorScheme(mode);
    }
  }, [setColorScheme]);

  const setThemeMode = useCallback(
    async (mode: ThemeMode) => {
      await AsyncStorage.setItem(THEME_KEY, mode);
      applyTheme(mode);
    },
    [applyTheme]
  );

  const isDark = colorScheme === "dark";
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, colors, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
