import { GetOsDTO } from "@/src/utils/os/types";

export async function closeOs({ id }: GetOsDTO) {
  const res = await fetch(`/api/os/${id}/close`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Erro ao fechar OS");
  }

  return res.json();
}
