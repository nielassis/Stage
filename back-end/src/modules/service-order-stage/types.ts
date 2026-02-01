export type CreateOsStageDTO = {
  name: string;
  osId: string;
  description: string;
};

export type GetOsStageDTO = {
  id: string;
  osId: string;
};

export type RejectStageDTO = {
  note: string;
};

export type UpdateStageDTO = {
  name: string;
  description: string;
};
