import { OsStatus } from '@prisma/client';
import { PageResult, PaginationMetadata } from '../../types/pagination';

export enum MyOsRoleFilter {
  RESPONSIBLE = 'RESPONSIBLE',
  PARTICIPANT = 'PARTICIPANT',
}

export type CreateOsDTO = {
  customerId: string;
  responsibleId: string;
  description: string;
  amountCents: number;
  name: string;
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

export type MyOsPage = PageResult<MyOsItem>;
export type MyOsQueryList = MyOsListFilter & PaginationMetadata;

export type OsPage = PageResult<TenantOsItem>;
export type OsQueryList = TenantOsListFilter & PaginationMetadata;
