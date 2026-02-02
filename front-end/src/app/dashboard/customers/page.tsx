"use client";

import CustomersClientPage from "@/src/components/clients/customers/customers.client";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/contexts/authContext";
import { UserRole } from "@/src/utils/auth/types";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function CustomersPage() {
  const { user: me } = useAuth();

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Clientes
          </h1>
          <p className="text-muted-foreground">
            Gerencie os clientes da sua empresa
          </p>
        </div>

        {(me?.role === UserRole.ADMIN ||
          me?.role === UserRole.PLATFORM_ADMIN) && (
          <Link href="/dashboard/customers/new">
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              <span className="hidden md:block">Criar Cliente</span>
            </Button>
          </Link>
        )}
      </div>

      <CustomersClientPage />
    </>
  );
}
