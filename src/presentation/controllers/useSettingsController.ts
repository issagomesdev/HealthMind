import { useCallback } from "react";
import { useTheme } from "../../core/theme";
import { useAuth } from "../../core/auth/AuthContext";
import { ThemeMode } from "../../core/types";

export function useSettingsController() {
  const { themeMode, setThemeMode, colors, isDark } = useTheme();
  const { user, logout } = useAuth();

  const handleThemeChange = useCallback(
    (mode: ThemeMode) => {
      setThemeMode(mode);
    },
    [setThemeMode]
  );

  const handleLogout = useCallback(async () => {
    await logout();
  }, [logout]);

  return {
    themeMode,
    colors,
    isDark,
    user,
    handleThemeChange,
    handleLogout,
  };
}
