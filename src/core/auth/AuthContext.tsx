import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AuthState, LoginCredentials, RegisterData, User } from "../types";
import { AuthService } from "../../services/auth/AuthService";

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    AuthService.getCurrentUser()
      .then((user) => {
        setState({ user, isAuthenticated: !!user, isLoading: false });
      })
      .catch(() => {
        setState({ user: null, isAuthenticated: false, isLoading: false });
      });
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const user = await AuthService.login(credentials);
    setState({ user, isAuthenticated: true, isLoading: false });
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const user = await AuthService.register(data);
    setState({ user, isAuthenticated: true, isLoading: false });
  }, []);

  const logout = useCallback(async () => {
    await AuthService.logout();
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
