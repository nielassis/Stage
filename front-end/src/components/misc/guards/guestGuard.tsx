"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/contexts/authContext";

export function GuestGuard({ children }: { children: ReactNode }) {
  const { isAuthenticated, isBootstrapping } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isBootstrapping && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isBootstrapping, router]);

  if (isBootstrapping || isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
