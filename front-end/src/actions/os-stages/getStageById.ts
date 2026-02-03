import {
  SearchForOsAndStage,
  StageDetailsItem,
} from "@/src/utils/os-stages/types";

export async function getStageById({ osId, stageId: id }: SearchForOsAndStage) {
  const res = await fetch(`/api/os/${osId}/stages/${id}`);
  if (!res.ok) throw new Error("Erro ao buscar etapa");
  return res.json() as Promise<StageDetailsItem>;
}
