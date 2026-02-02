"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, ClipboardList, Clock, XCircle } from "lucide-react";

import { KpiCard } from "@/src/components/ui/kpiCards";

import { fetchOsStatus } from "@/src/actions/reports/os/status/fetchOsListStatus";
import { KpiCardSkeleton } from "../../ui/skeleton/kpiCardsSkeleton";
import { RecentOrdersCard } from "../../misc/layout/dashboard/recentOsCard";
import { RecentActivitiesCard } from "../../misc/layout/dashboard/recentActivitiesCard";

interface OsStatus {
  status: string;
  total: number;
}

export default function DashboardClientPage() {
  const [stats, setStats] = useState<OsStatus[] | undefined>(undefined);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await fetchOsStatus();
        setStats(data);
      } catch (err) {
        console.error(err);
        setStats([]);
      }
    }

    fetchStats();
  }, []);

  const cardsConfig = [
    {
      status: "TOTAL",
      label: "Total de OS",
      icon: ClipboardList,
      iconColor: "text-muted-foreground",
    },
    {
      status: "IN_PROGRESS",
      label: "Em Andamento",
      icon: Clock,
      iconColor: "text-primary",
    },
    {
      status: "COMPLETED",
      label: "Concluídas",
      icon: CheckCircle2,
      iconColor: "text-success",
    },
    {
      status: "CANCELLED",
      label: "Canceladas",
      icon: XCircle,
      iconColor: "text-destructive",
    },
  ];

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats === undefined
          ? cardsConfig.map((card) => <KpiCardSkeleton key={card.status} />)
          : cardsConfig.map((card) => {
              const stat = stats.find((s) => s.status === card.status);
              return (
                <KpiCard
                  key={card.status}
                  label={card.label}
                  value={stat?.total ?? 0}
                  icon={card.icon}
                  iconColor={card.iconColor}
                />
              );
            })}
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3 flex-1">
        <div className="lg:col-span-2 flex">
          <RecentOrdersCard />
        </div>

        <div className="lg:col-span-1 flex">
          <RecentActivitiesCard />
        </div>
      </div>
    </>
  );
}
