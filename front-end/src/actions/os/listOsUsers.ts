import { OsListUser } from "@/src/utils/os/types";

export async function listOsUsers(osId: string): Promise<OsListUser[]> {
  const res = await fetch(`/api/os/${osId}/users`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar usuários da OS");
  }

  return res.json() as Promise<OsListUser[]>;
}
