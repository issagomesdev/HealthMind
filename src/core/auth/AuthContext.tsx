import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AuthState, AuthResult, LoginCredentials, RegisterData } from "../types";
import { AuthService } from "../../services/auth/AuthService";

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (data: RegisterData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const EMPTY_RESULT: AuthResult = { user: null as never, profile: null };

const AuthContext = createContext<AuthContextValue>({
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => EMPTY_RESULT,
  register: async () => EMPTY_RESULT,
  logout: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    AuthService.getCurrentUser()
      .then((result) => {
        if (result) {
          setState({ user: result.user, profile: result.profile, isAuthenticated: true, isLoading: false });
        } else {
          setState({ user: null, profile: null, isAuthenticated: false, isLoading: false });
        }
      })
      .catch(() => {
        setState({ user: null, profile: null, isAuthenticated: false, isLoading: false });
      });
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResult> => {
    const result = await AuthService.login(credentials);
    setState({ user: result.user, profile: result.profile, isAuthenticated: true, isLoading: false });
    return result;
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<AuthResult> => {
    const result = await AuthService.register(data);
    setState({ user: result.user, profile: result.profile, isAuthenticated: true, isLoading: false });
    return result;
  }, []);

  const logout = useCallback(async () => {
    await AuthService.logout();
    setState({ user: null, profile: null, isAuthenticated: false, isLoading: false });
  }, []);

  const refreshUser = useCallback(async () => {
    const result = await AuthService.refreshUser();
    if (result) {
      setState({ user: result.user, profile: result.profile, isAuthenticated: true, isLoading: false });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
