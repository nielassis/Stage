export enum OsStageStatus {
  OPEN = "OPEN",
  PENDING_APPROVAL = "PENDING_APPROVAL",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

export const OsStageStatusLabels: Record<OsStageStatus, string> = {
  [OsStageStatus.COMPLETED]: "Concluído",
  [OsStageStatus.CANCELLED]: "Cancelada",
  [OsStageStatus.OPEN]: "Aberto",
  [OsStageStatus.PENDING_APPROVAL]: "Pendente de Aprovação",
  [OsStageStatus.REJECTED]: "Rejeitado",
};

export type CreateOsStageDTO = {
  name: string;
  description: string;
  osId: string;
};

export type GetOsStageDTO = {
  osId: string;
};

export type RejectStageDTO = {
  note: string;
};

export type StageItem = {
  id: string;
  osId: string;
  name: string;
  description: string;
  status: OsStageStatus;
  notes?: string;
};

export type SearchForOsAndStage = {
  osId: string;
  stageId: string;
};
