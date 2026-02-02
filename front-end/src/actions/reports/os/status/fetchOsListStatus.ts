export async function fetchOsStatus(startDate?: string, endDate?: string) {
  const query = new URLSearchParams();
  if (startDate) query.append("startDate", startDate);
  if (endDate) query.append("endDate", endDate);

  const res = await fetch(`/api/reports/os/status?${query.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar status das OS");
  }

  return res.json();
}
