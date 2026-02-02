import { RecentOs } from "@/src/utils/dashboard/types";

export async function fetchRecentOs(): Promise<RecentOs[]> {
  const res = await fetch("/api/reports/os/list", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar ordens recentes");
  }

  return res.json();
}
