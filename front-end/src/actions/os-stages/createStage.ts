import { CreateOsStageDTO } from "@/src/utils/os-stages/types";

export async function createStage(data: CreateOsStageDTO) {
  if (!data.osId) {
    throw new Error("osId é obrigatório para criar etapa");
  }

  const res = await fetch(`/api/os/${data.osId}/stages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: data.name,
      description: data.description,
    }),
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}
