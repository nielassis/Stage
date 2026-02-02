import {
  RejectStageDTO,
  SearchForOsAndStage,
} from "@/src/utils/os-stages/types";

export async function requestApprovalStage({
  osId,
  stageId,
}: SearchForOsAndStage) {
  const res = await fetch(
    `/api/os/${osId}/stages/${stageId}/request-approval`,
    {
      method: "POST",
    },
  );
  if (!res.ok) throw new Error("Erro ao solicitar aprovação da etapa");
  return res.json();
}

export async function approveStage({ osId, stageId }: SearchForOsAndStage) {
  const res = await fetch(`/api/os/${osId}/stages/${stageId}/approve`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Erro ao aprovar etapa");
  return res.json();
}

export async function rejectStage(
  { osId, stageId }: SearchForOsAndStage,
  dto: RejectStageDTO,
) {
  const res = await fetch(`/api/os/${osId}/stages/${stageId}/reject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Erro ao rejeitar etapa");
  return res.json();
}
