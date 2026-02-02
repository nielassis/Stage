// src/actions/reports/fetchReports.ts

export async function fetchMyOsSummary(startDate?: string, endDate?: string) {
  const query = new URLSearchParams();
  if (startDate) query.append("startDate", startDate);
  if (endDate) query.append("endDate", endDate);

  const res = await fetch(`/api/reports/my-os-summary?${query.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar resumo das minhas OS");
  }

  return res.json();
}

export async function fetchUserProductivity(
  startDate?: string,
  endDate?: string,
) {
  const query = new URLSearchParams();
  if (startDate) query.append("startDate", startDate);
  if (endDate) query.append("endDate", endDate);

  const res = await fetch(
    `/api/reports/users/productivity?${query.toString()}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Erro ao buscar produtividade dos usuários");
  }

  return res.json();
}

export async function fetchOsFinancial(startDate?: string, endDate?: string) {
  const query = new URLSearchParams();
  if (startDate) query.append("startDate", startDate);
  if (endDate) query.append("endDate", endDate);

  const res = await fetch(`/api/reports/os-financial?${query.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar relatório financeiro das OS");
  }

  return res.json();
}
