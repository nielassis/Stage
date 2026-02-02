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

import { Card } from "../../ui/card";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import { Badge, BadgeProps } from "../../ui/badge";
import { Avatar, AvatarFallback } from "../../ui/avatar";

import {
  Search,
  RefreshCcw,
  UserX,
  Users,
  UserPlus,
  Ellipsis,
} from "lucide-react";

import NoResultFallback from "../../misc/layout/noResultFallback";
import { UsersTableSkeleton } from "../../ui/skeleton/usersTableSkeleton";

import { listCustomers } from "@/src/actions/customers/listCustomers";

import { getAvatarLetters } from "@/src/utils/userContext/getAvatarImage";

import { Customer, DocumentType } from "@/src/utils/customers/types";
import { KpiCard } from "../../ui/kpiCards";

import { fetchCustomersGrowth } from "@/src/actions/customers/fetchCustomersGrowth";
import { getSliceId } from "@/src/utils/ui/getSliceId";
import Link from "next/link";

const startOfMonth = new Date(new Date().setDate(1)).toISOString();
const endOfMonth = new Date().toISOString();

const documentTypeBadgeDict: Record<DocumentType, BadgeProps["variant"]> = {
  [DocumentType.CPF]: "danger",
  [DocumentType.CNPJ]: "link",
};

export default function CustomersClientPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const [kpi, setKpi] = useState<{
    totalCustomers: number;
    newCustomers: number;
  } | null>(null);

  const page = Number(searchParams.get("page") ?? 1);
  const name = searchParams.get("name") ?? "";
  const [nameInput, setNameInput] = useState(name);

  const limit = 20;
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await listCustomers({ page, limit, name });
      setCustomers(res.data);
      setTotalPages(res.pagination.totalPages);
      setTotalRecords(res.pagination.total);
    } finally {
      setLoading(false);
    }
  }, [page, name]);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  useEffect(() => {
    fetchCustomersGrowth({
      startDate: startOfMonth,
      endDate: endOfMonth,
    })
      .then(setKpi)
      .catch(console.error);
  }, []);

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

  return (
    <div className="space-y-6">
      {kpi && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <KpiCard
            label="Total de clientes"
            value={kpi.totalCustomers}
            icon={Users}
            iconColor="text-blue-500"
          />
          <KpiCard
            label="Novos clientes (mês)"
            value={kpi.newCustomers}
            icon={UserPlus}
            iconColor="text-green-500"
          />
        </div>
      )}

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
          <Button variant="outline" onClick={clearFilter}>
            <RefreshCcw className="h-4 w-4 mr-1" />
            Limpar
          </Button>

          <Button onClick={applyFilter}>
            <Search className="h-4 w-4 mr-1" />
            Filtrar
          </Button>
        </div>
      </Card>

      <div className="rounded-xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Documento</TableHead>
              <TableHead className="text-center">Tipo de documento</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <UsersTableSkeleton limit={limit} />
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <NoResultFallback
                    text="Nenhum cliente encontrado"
                    icon={UserX}
                  />
                </TableCell>
              </TableRow>
            ) : (
              customers.map((c) => (
                <TableRow key={c.id} className="hover:bg-muted/40">
                  <TableCell className="italic text-muted-foreground">
                    #{getSliceId(c.id)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {getAvatarLetters(c.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {c.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>{c.document}</TableCell>

                  <TableCell className="text-center">
                    <Badge variant={documentTypeBadgeDict[c.documentType]}>
                      {c.documentType}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <Link href={`/dashboard/customers/${c.id}`}>
                      <Button variant="outline" size="icon-xs">
                        <Ellipsis size={16} />
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Mostrando {customers.length} de {totalRecords}
                  </span>

                  <div className="flex gap-2 items-center">
                    <Button
                      disabled={page <= 1}
                      onClick={() => goToPage(page - 1)}
                    >
                      Anterior
                    </Button>
                    <span className="text-sm">
                      Página {page} de {totalPages}
                    </span>
                    <Button
                      disabled={page >= totalPages}
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
    </div>
  );
}
