import { User, UserRole } from '@prisma/client';
import { PageResult, PaginationMetadata } from '../../types/pagination';

export type CreateUserDTO = {
  name: string;
  tenantId: string;
  email: string;
  password: string;
  role: UserRole;
};

export type UserFilterDTO = {
  name?: string;
  email?: string;
  role?: UserRole;
};

export type UpdateUserDTO = {
  name?: string;
  email?: string;
  password?: string;
};

export type GetUserDTO = {
  id: string;
};

export type UserPage = PageResult<User>;
export type UserListQuery = UserFilterDTO & PaginationMetadata;
