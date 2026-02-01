export type CreateTenantDTO = {
  name: string;
  email: string;
  cnpj: string;
};

export type UpdateTenantDTO = Partial<CreateTenantDTO>;
