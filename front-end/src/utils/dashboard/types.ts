export enum OsStatus {
  IN_PROGRESS = "IN_PROGRESS",
  CANCELLED = "CANCELLED",
  CLOSED = "CLOSED",
}

export type RecentOs = {
  id: string;
  name: string;
  status: string;
  amountCents: number;
  createdAt: string;
  responsible: {
    id: string;
    name: string;
  };
};

export enum OsStageStatus {
  OPEN = "OPEN",
  PENDING_APPROVAL = "PENDING_APPROVAL",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

export type RecentStageActivity = {
  id: string;
  os: { responsible: { name: string; id: string } };
  osId: string;
  name: string;
  status: OsStageStatus;
  createdAt: string;
  updatedAt: string | null;
};

export const OsStageStatusLabels: Record<OsStageStatus, string> = {
  [OsStageStatus.COMPLETED]: "Concluído",
  [OsStageStatus.CANCELLED]: "Cancelada",
  [OsStageStatus.OPEN]: "Aberto",
  [OsStageStatus.PENDING_APPROVAL]: "Pendente de Aprovação",
  [OsStageStatus.REJECTED]: "Rejeitado",
};

export const OsStatusLabels: Record<OsStatus, string> = {
  [OsStatus.IN_PROGRESS]: "Em Andamento",
  [OsStatus.CANCELLED]: "Cancelada",
  [OsStatus.CLOSED]: "Concluída",
};
