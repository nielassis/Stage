"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";

import { UserRole } from "../utils/auth/types";
import { api } from "../provider/api";

type User = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  isBootstrapping: boolean;
  isSigningIn: boolean;
  signIn: (data: { email: string; password: string }) => Promise<boolean>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const router = useRouter();

  const fetchMe = useCallback(async () => {
    setIsBootstrapping(true);

    try {
      const { data } = await api.get("/users/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setIsBootstrapping(false);
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const signIn = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      setIsSigningIn(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) return false;

      await fetchMe();

      router.push("/dashboard");
      return true;
    } finally {
      setIsSigningIn(false);
    }
  };

  const signOut = async () => {
    await api.post("/auth/logout");
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        isBootstrapping,
        isSigningIn,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
