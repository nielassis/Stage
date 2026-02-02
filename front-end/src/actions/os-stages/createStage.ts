import { CreateOsStageDTO, StageItem } from "@/src/utils/os-stages/types";

export async function createStage(data: CreateOsStageDTO) {
  const res = await fetch(`/api/os/${data.osId}/stages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: data.name, description: data.description }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Erro ao criar etapa: ${text}`);
  }

  return res.json() as Promise<StageItem>;
}
