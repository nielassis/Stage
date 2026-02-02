import { CreateOsDTO } from "@/src/utils/os/types";

export async function createOs(data: CreateOsDTO) {
  const res = await fetch("/api/os", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Erro ao criar ordem de serviço");
  }

  return res.json();
}
