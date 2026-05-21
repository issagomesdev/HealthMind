import { useCallback, useRef } from "react";
import { useAuth } from "../core/auth/AuthContext";

const COOLDOWN_MS = 30_000;

export function useRefreshAuthenticatedUser() {
  const { refreshUser } = useAuth();
  const lastRefreshedAt = useRef(0);
  const inFlight = useRef(false);

  const refresh = useCallback(async () => {
    if (inFlight.current) return;
    if (Date.now() - lastRefreshedAt.current < COOLDOWN_MS) return;
    inFlight.current = true;
    lastRefreshedAt.current = Date.now();
    try {
      await refreshUser();
    } catch {
      // silent — keep last valid state
    } finally {
      inFlight.current = false;
    }
  }, [refreshUser]);

  return { refresh };
}
