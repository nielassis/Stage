"use client";

import { useEffect, useState } from "react";

import { FileCheck } from "lucide-react";
import { fetchMyOsSummary } from "@/src/actions/reports/fetchReports";
import { KpiCard } from "../../ui/kpiCards";
import { KpiCardSkeleton } from "../../ui/skeleton/kpiCardsSkeleton";

export default function MyOsSummaryPage() {
  const [totalOs, setTotalOs] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchMyOsSummary();
        setTotalOs(data.total || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return (
    <>
      <div className="flex w-full flex-col space-y-4">
        <p className="text-muted-foreground">Resumo das Minhas OS</p>
        {loading ? (
          <KpiCardSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <KpiCard
              label="Total de participação em OS"
              value={totalOs}
              icon={FileCheck}
              iconColor="text-blue-500"
            />
          </div>
        )}
      </div>
    </>
  );
}
