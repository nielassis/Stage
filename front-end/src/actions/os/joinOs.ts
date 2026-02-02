import { GetOsDTO } from "@/src/utils/os/types";

export async function joinOs({ id }: GetOsDTO) {
  const res = await fetch(`/api/os/${id}/join`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Erro ao entrar na OS");
  }

  return res.json();
}
