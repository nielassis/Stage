"use client";

import { useEffect, useState } from "react";
import { PrivateGuard } from "@/src/components/misc/guards/privateGuard";

import { Me } from "@/src/utils/auth/types";
import Loader from "@/src/components/misc/layout/loader";
import DashboardWrapper from "@/src/components/misc/wrapplers/dashboardWrapplers";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch("/api/users/me", {
          credentials: "include",
        });

        if (!res.ok) {
          setMe(null);
          return;
        }

        const json = await res.json();
        setMe(json.user);
      } catch (err) {
        console.error("Erro ao buscar usuário:", err);
        setMe(null);
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!me) {
    router.push("/login");
  }

  return (
    <PrivateGuard>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <DashboardWrapper me={me!}>{children}</DashboardWrapper>
      </div>
    </PrivateGuard>
  );
}
