"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PrivateGuard } from "@/src/components/misc/guards/privateGuard";
import DashboardWrapper from "@/src/components/misc/wrapplers/dashboardWrapplers";

import { Me } from "@/src/utils/auth/types";
import { DashboardWrapperSkeleton } from "@/src/components/ui/skeleton/dashboardWrapplerSkeleton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [me, setMe] = useState<Me | false | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("/api/users/me", {
          credentials: "include",
        });

        if (!res.ok) {
          setMe(false);
          return;
        }

        const json = await res.json();
        setMe(json.user);
      } catch {
        setMe(false);
      }
    }

    fetchMe();
  }, []);

  useEffect(() => {
    if (me === false) {
      router.replace("/login");
    }
  }, [me, router]);

  if (me === false) {
    return null;
  }

  return (
    <PrivateGuard>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        {me === undefined ? (
          <DashboardWrapperSkeleton>{children}</DashboardWrapperSkeleton>
        ) : (
          <DashboardWrapper me={me}>{children}</DashboardWrapper>
        )}
      </div>
    </PrivateGuard>
  );
}
