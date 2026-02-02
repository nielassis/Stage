"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";

import { TenantUser, UserRoleLabels } from "@/src/utils/userContext/types";
import { fetchTenantUsers } from "@/src/actions/users/fetchTenantUsers";
import { UserRole } from "@/src/utils/auth/types";
import NoResultFallback from "../../misc/layout/noResultFallback";
import { UserX, Search, RefreshCcw, Plus } from "lucide-react";
import { UsersTableSkeleton } from "../../ui/skeleton/usersTableSkeleton";
import { BadgeProps, Badge } from "../../ui/badge";
import { Card } from "../../ui/card";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { getAvatarLetters } from "@/src/utils/userContext/getAvatarImage";
import { useAuth } from "@/src/contexts/authContext";
import Link from "next/link";

const badgeDictUserRole: Record<UserRole, BadgeProps["variant"]> = {
  [UserRole.COLLABORATOR]: "success",
  [UserRole.SUPERVISOR]: "warning",
  [UserRole.ADMIN]: "default",
  [UserRole.PLATFORM_ADMIN]: "danger",
};

export default function UsersClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: me } = useAuth();
  const [users, setUsers] = useState<TenantUser[]>([]);
  const [loading, setLoading] = useState(true);

  const page = Number(searchParams.get("page") ?? 1);
  const name = searchParams.get("name") ?? "";

  const [nameInput, setNameInput] = useState(name);

  const limit = 20;
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchTenantUsers(page, limit, name);
      setUsers(res.data);
      setTotalPages(res.pagination.totalPages);
      setTotalRecords(res.pagination.total);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [page, name]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  function applyFilter() {
    const params = new URLSearchParams(searchParams.toString());
    if (nameInput) {
      params.set("name", nameInput);
    } else {
      params.delete("name");
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
  }

  function clearFilter() {
    router.push("?");
    setNameInput("");
  }

  function goToPage(targetPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(targetPage));
    router.push(`?${params.toString()}`);
  }

  const isFirstPage = page <= 1;
  const isLastPage = page >= totalPages;

  return (
    <>
      <Card className="flex flex-col md:flex-row gap-3 p-4">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Buscar usuário..."
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="pl-8 w-full"
            onKeyDown={(e) => {
              if (e.key === "Enter") applyFilter();
            }}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-2">
          <Button variant="outline">
            <RefreshCcw className="h-4 w-4 mr-1" onClick={clearFilter} />
            Limpar
          </Button>

          <Button>
            <Search className="h-4 w-4 mr-1" />
            Filtrar
          </Button>
        </div>
      </Card>

      {me?.role === UserRole.ADMIN ||
        (me?.role === UserRole.PLATFORM_ADMIN && (
          <Link href="/dashboard/users/new">
            <Button className="w-fit items-center" variant="default">
              <Plus className="h-4 w-4 mr-1" />
              Criar Usuário
            </Button>
          </Link>
        ))}

      <div className="rounded-xl shadow-md border bg-card overflow-hidden flex flex-col">
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead>Usuário</TableHead>
              <TableHead className="text-center">Função</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <UsersTableSkeleton limit={limit} />
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2}>
                  <NoResultFallback
                    text="Nenhum usuário encontrado"
                    icon={UserX}
                  />
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className="hover:bg-muted/40 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {getAvatarLetters(user.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col">
                        <span className="font-medium leading-tight">
                          {user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge
                      variant={badgeDictUserRole[user.role]}
                      className="rounded-full px-3 py-0.5 text-xs"
                    >
                      {UserRoleLabels[user.role]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-3 w-full">
                  <span className="text-sm text-muted-foreground text-center sm:text-left">
                    {totalRecords === 0
                      ? "Nenhum resultado encontrado"
                      : `Mostrando ${users.length} de ${totalRecords} registros`}
                  </span>

                  <div className="flex items-center justify-center sm:justify-end gap-2">
                    <Button
                      disabled={isFirstPage}
                      onClick={() => goToPage(page - 1)}
                    >
                      Anterior
                    </Button>

                    <span className="text-sm font-medium whitespace-nowrap">
                      Página {page} de {totalPages}
                    </span>

                    <Button
                      disabled={isLastPage}
                      onClick={() => goToPage(page + 1)}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  );
}
