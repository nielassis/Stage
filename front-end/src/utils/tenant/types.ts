export enum TenantStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

export const TenantStatusLabels: Record<TenantStatus, string> = {
  [TenantStatus.ACTIVE]: "Ativo",
  [TenantStatus.INACTIVE]: "Inativo",
  [TenantStatus.SUSPENDED]: "Suspenso",
};

export interface Tenant {
  id: string;
  name: string;
  status: TenantStatus;
  email: string;
  cnpj: string;
  createdAt: string;
}
