"use client";

import { fetchRecentOs } from "@/src/actions/reports/os/list/fetchRecentOsList";
import { Card } from "@/src/components/ui/card";
import { RecentOrdersSkeleton } from "@/src/components/ui/skeleton/recentOrderSkeleton";
import {
  OsStatus,
  OsStatusLabels,
  RecentOs,
} from "@/src/utils/dashboard/types";
import { useEffect, useState } from "react";
import NoResultFallback from "../noResultFallback";
import { ArrowRight, File } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

import { Badge, BadgeProps } from "@/src/components/ui/badge";
import { getSliceId } from "@/src/utils/ui/getSliceId";

export const OsStatusBadgeDict: Record<OsStatus, BadgeProps["variant"]> = {
  [OsStatus.CANCELLED]: "destructive",
  [OsStatus.IN_PROGRESS]: "link",
  [OsStatus.CLOSED]: "success",
};

export function RecentOrdersCard() {
  const [orders, setOrders] = useState<RecentOs[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentOs()
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <RecentOrdersSkeleton />;
  }

  return (
    <Card className="rounded-xl border p-4 h-full flex flex-1 flex-col ">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
            <File className="h-5 w-5 text-muted-foreground" />
          </div>

          <div className="leading-tight">
            <h2 className="text-base font-semibold">
              Ordens de serviço recentes
            </h2>
            <p className="text-xs text-muted-foreground">
              Últimas OS cadastradas no sistema
            </p>
          </div>
        </div>

        <Link href="/dashboard/os">
          <Button variant="ghost" size="sm" className="gap-1">
            <span className="hidden md:inline">Ver todas</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {orders?.length ? (
        orders.map((order) => (
          <Link
            key={order.id}
            href={`/dashboard/os/${order.id}`}
            className="group flex items-center justify-between rounded-lg border p-4 transition hover:bg-muted/50"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  #{getSliceId(order.id)}
                </span>
              </div>

              <p className="font-semibold leading-tight group-hover:underline">
                {order.name}
              </p>
            </div>

            <Badge variant={OsStatusBadgeDict[order.status as OsStatus]}>
              {OsStatusLabels[order.status as OsStatus]}
            </Badge>
          </Link>
        ))
      ) : (
        <NoResultFallback
          text="Nenhuma OS encontrada"
          subtext="Suas OS recentes aparecerão aqui"
          icon={File}
        />
      )}
    </Card>
  );
}
