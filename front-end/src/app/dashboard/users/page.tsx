"use client";

import UsersClientPage from "@/src/components/clients/users/users.client";
import { Button } from "@/src/components/ui/button";
import { useAuth } from "@/src/contexts/authContext";
import { UserRole } from "@/src/utils/auth/types";
import { Plus } from "lucide-react";
import Link from "next/link";

export default function UserRoutes() {
  const { user: me } = useAuth();
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Usuarios
          </h1>
          <p className="text-muted-foreground">
            Gerencie os usuários da sua empresa
          </p>
        </div>

        {me?.role === UserRole.ADMIN ||
          (me?.role === UserRole.PLATFORM_ADMIN && (
            <Link href="/dashboard/users/new">
              <Button className="w-fit items-center" variant="default">
                <Plus className="h-4 w-4 mr-1" />
                <span className="hidden md:block">Criar Usuário</span>
              </Button>
            </Link>
          ))}
      </div>

      <UsersClientPage />
    </>
  );
}
