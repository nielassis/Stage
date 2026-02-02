import { GetOsStageDTO, StageItem } from "@/src/utils/os-stages/types";

export async function listOsStages({ osId }: GetOsStageDTO) {
  const res = await fetch(`/api/os/${osId}/stages`);
  if (!res.ok) throw new Error("Erro ao buscar etapas");
  return res.json() as Promise<StageItem[]>;
}
