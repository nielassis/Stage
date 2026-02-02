import { PaginationMetadata } from "../types";

export enum DocumentType {
  CPF = "CPF",
  CNPJ = "CNPJ",
}

export type CreateCustomerDTO = {
  name: string;
  email: string;
  document: string;
  documentType: DocumentType;
};

export type CustomerFilterDTO = {
  name?: string;
  email?: string;
  document?: string;
  documentType?: DocumentType;
};

export type UpdateCustomerDTO = {
  name?: string;
  email?: string;
  document?: string;
  documentType?: DocumentType;
};

export type GetCustomerDTO = {
  id: string;
};

export interface CustomersGrowthReport {
  totalCustomers: number;
  newCustomers: number;
}

export type Customer = {
  id: string;
  name: string;
  email: string;
  document: string;
  documentType: DocumentType;
  createdAt: string;
};

export type CustomersListQuery = CustomerFilterDTO & PaginationMetadata;
