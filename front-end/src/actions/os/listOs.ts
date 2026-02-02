import { OsQueryList, OsPage } from "@/src/utils/os/types";

export async function listOs(query: OsQueryList): Promise<OsPage> {
  const searchParams = new URLSearchParams(
    Object.entries(query).reduce<Record<string, string>>(
      (acc, [key, value]) => {
        if (value !== undefined && value !== null) {
          acc[key] = String(value);
        }
        return acc;
      },
      {},
    ),
  );

  const res = await fetch(`/api/os?${searchParams.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao listar ordens de serviço");
  }

  return res.json();
}
