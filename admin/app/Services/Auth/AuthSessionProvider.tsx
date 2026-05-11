"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthSessionPayload, AuthUser } from "./authSession";
import {
  clearSessionStorage,
  readSession,
  writeSession as persistSession,
} from "./authSession";

interface AuthSessionContextValue {
  user: AuthUser | null;
  token: string | null;
  hydrated: boolean;
  setSession: (payload: AuthSessionPayload) => void;
  clearSession: () => void;
}

const AuthSessionContext = createContext<AuthSessionContextValue | null>(null);

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const session = readSession();
      if (session) {
        setUser(session.user);
        setToken(session.token);
      }
      setHydrated(true);
    });
  }, []);

  const setSession = useCallback((payload: AuthSessionPayload) => {
    persistSession(payload);
    setUser(payload.user);
    setToken(payload.token);
  }, []);

  const clearSession = useCallback(() => {
    clearSessionStorage();
    setUser(null);
    setToken(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, hydrated, setSession, clearSession }),
    [user, token, hydrated, setSession, clearSession],
  );

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession(): AuthSessionContextValue {
  const ctx = useContext(AuthSessionContext);
  if (!ctx) {
    throw new Error("useAuthSession must be used within AuthSessionProvider");
  }
  return ctx;
}
