import { GetOsDTO } from "@/src/utils/os/types";

export async function getOsById({ id }: GetOsDTO) {
  const res = await fetch(`/api/os/${id}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar ordem de serviço");
  }

  return res.json();
}
