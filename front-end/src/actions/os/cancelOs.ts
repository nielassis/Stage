import { GetOsDTO } from "@/src/utils/os/types";

export async function cancelOs({ id }: GetOsDTO) {
  const res = await fetch(`/api/os/${id}/cancel`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Erro ao cancelar OS");
  }

  return res.json();
}
