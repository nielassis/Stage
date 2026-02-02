import { PageResult, PaginationMetadata } from "../types";

export enum MyOsRoleFilter {
  RESPONSIBLE = "RESPONSIBLE",
  PARTICIPANT = "PARTICIPANT",
}

export enum OsStatus {
  IN_PROGRESS = "IN_PROGRESS",
  CANCELLED = "CANCELLED",
  CLOSED = "CLOSED",
}

export const OsStatusLabels: Record<OsStatus, string> = {
  [OsStatus.IN_PROGRESS]: "Em Andamento",
  [OsStatus.CANCELLED]: "Cancelada",
  [OsStatus.CLOSED]: "Concluída",
};

export type CreateOsDTO = {
  customerId: string;
  description: string;
  amountCents: number;
  name: string;
};

export type OsListUser = {
  id: string;
  name: string;
  email: string;
};

export type GetOsDTO = {
  id: string;
};

export type MyOsListFilter = {
  name?: string;
  responsibleName?: string;
  role?: MyOsRoleFilter;
  status?: OsStatus;
};

export type MyOsItem = {
  id: string;
  name: string;
  status: OsStatus;
  amountCents: number;
  createdAt: Date;
  customer: {
    id: string;
    name: string;
  };
  responsible: {
    id: string;
    name: string;
    email: string;
  };
  myRole: MyOsRoleFilter;
};

export type TenantOsListFilter = {
  name?: string;
  responsibleName?: string;
  customerName?: string;
  status?: OsStatus;
};

export type TenantOsItem = {
  id: string;
  name: string;
  status: OsStatus;
  amountCents: number;
  createdAt: Date;
  description: string;
  customer: {
    id: string;
    name: string;
  };
  responsible: {
    id: string;
    name: string;
    email: string;
  };
};

export type MyOsQueryList = MyOsListFilter & PaginationMetadata;

export type OsPage = PageResult<TenantOsItem>;
export type OsQueryList = TenantOsListFilter & PaginationMetadata;
