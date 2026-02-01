import { Customer, DocumentType } from '@prisma/client';
import { PageResult, PaginationMetadata } from '../../types/pagination';

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

export type CustomerPage = PageResult<Customer>;
export type CustomersListQuery = CustomerFilterDTO & PaginationMetadata;
