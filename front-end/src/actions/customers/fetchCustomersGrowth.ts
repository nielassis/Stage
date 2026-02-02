// src/actions/reports/customersGrowth.ts

import { CustomersGrowthReport } from "@/src/utils/customers/types";

export async function fetchCustomersGrowth(params?: {
  startDate?: string;
  endDate?: string;
}): Promise<CustomersGrowthReport> {
  const search = new URLSearchParams(params);

  const res = await fetch(`/api/reports/customers/growth?${search}`);

  if (!res.ok) {
    throw new Error("Erro ao buscar relatório de clientes");
  }

  return res.json();
}
