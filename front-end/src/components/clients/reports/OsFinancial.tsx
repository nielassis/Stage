"use client";

import { useEffect, useState } from "react";
import { DollarSign } from "lucide-react";
import { fetchOsFinancial } from "@/src/actions/reports/fetchReports";
import { KpiCard } from "../../ui/kpiCards";

interface OsFinancial {
  totalAmountCents: number;
  avgAmountCents: number;
}

export default function OsFinancialPage() {
  const [financial, setFinancial] = useState<OsFinancial | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchOsFinancial();
        setFinancial(data);
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
        <p className="text-muted-foreground">Financeiro das OS</p>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <KpiCard
              label="Total faturado"
              value={financial?.totalAmountCents || 0}
              icon={DollarSign}
              iconColor="text-green-500"
            />
            <KpiCard
              label="Média por OS"
              value={financial?.avgAmountCents || 0}
              icon={DollarSign}
              iconColor="text-yellow-500"
            />
          </div>
        )}
      </div>
    </>
  );
}
