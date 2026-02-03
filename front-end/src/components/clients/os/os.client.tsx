"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, RefreshCcw } from "lucide-react";

import { TenantOsItem, OsQueryList } from "@/src/utils/os/types";
import { listOs } from "@/src/actions/os/listOs";

import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { Badge, BadgeProps } from "@/src/components/ui/badge";
import { Card } from "@/src/components/ui/card";

import { Skeleton } from "@/src/components/ui/skeleton";
import { getSliceId } from "@/src/utils/ui/getSliceId";
import { formatDateDDMMYY } from "@/src/utils/ui/formatDate";
import { OsStatus, OsStatusLabels } from "@/src/utils/dashboard/types";

const badgeDictOsStatus: Record<OsStatus, BadgeProps["variant"]> = {
  [OsStatus.CANCELLED]: "destructive",
  [OsStatus.IN_PROGRESS]: "link",
  [OsStatus.CLOSED]: "success",
};

export default function OsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [data, setData] = useState<TenantOsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchInput, setSearchInput] = useState(
    searchParams.get("name") ?? "",
  );

  const page = Number(searchParams.get("page") ?? 1);
  const limit = 20;

  const loadOs = useCallback(async () => {
    setLoading(true);
    try {
      const query: OsQueryList = {
        page,
        limit,
        name: searchInput || undefined,
      };
      const res = await listOs(query);
      setTotalPages(res.pagination.totalPages);
      setTotalRecords(res.pagination.total);
      setData(res.data);
    } finally {
      setLoading(false);
    }
  }, [page, searchInput]);

  useEffect(() => {
    loadOs();
  }, [loadOs]);

  function applyFilter() {
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) {
      params.set("name", searchInput);
    } else {
      params.delete("name");
    }
    params.delete("page");
    router.push(`?${params.toString()}`);
  }

  function clearFilter() {
    router.push("?");
    setSearchInput("");
  }

  function goToPage(targetPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(targetPage));
    router.push(`?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <Card className="flex flex-col md:flex-row gap-3 p-4">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Buscar por nome da OS"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-8 w-full"
            onKeyDown={(e) => e.key === "Enter" && applyFilter()}
          />
        </div>

        <div className="flex gap-2 flex-col md:flex-row">
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

      <div className="space-y-3">
        {loading
          ? Array.from({ length: limit }).map((_, i) => (
              <Card
                key={i}
                className="p-5 space-y-3 animate-pulse flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-16 rounded-full" />
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-2/3 rounded-md" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                    <Skeleton className="h-4 w-1/4 rounded-md" />
                  </div>
                </div>
              </Card>
            ))
          : data.map((os) => (
              <Card
                key={os.id}
                className="p-6 hover:bg-muted/40 transition cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                onClick={() => router.push(`/dashboard/os/${os.id}`)}
              >
                <div className="flex-1 space-y-1 items-center">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground italic">
                      #{getSliceId(os.id)}
                    </span>
                    <Badge variant={badgeDictOsStatus[os.status]}>
                      {OsStatusLabels[os.status]}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-base">{os.name}</h3>

                  <p className="text-sm text-muted-foreground justify-between flex">
                    <span className="">
                      Cliente: {os.customer.name} &nbsp;•&nbsp; Responsável:{" "}
                      {os.responsible.name}
                    </span>
                    {os.createdAt && (
                      <span className="ml-2">
                        Criada em: {formatDateDDMMYY(os.createdAt)}
                      </span>
                    )}
                  </p>
                </div>
              </Card>
            ))}
        <div className="flex justify-between items-center mt-6">
          <span className="text-sm text-muted-foreground">
            Mostrando {data.length} de {totalRecords}
          </span>

          <div className="flex gap-2 items-center">
            <Button disabled={page <= 1} onClick={() => goToPage(page - 1)}>
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
      </div>
    </div>
  );
}
