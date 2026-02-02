import { UserRole } from "../auth/types";

export interface TenantUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TenantUsersResponse {
  data: TenantUser[];
  pagination: Pagination;
}

export const UserRoleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Administrador",
  [UserRole.SUPERVISOR]: "Supervisor",
  [UserRole.COLLABORATOR]: "Colaborador",
  [UserRole.PLATFORM_ADMIN]: "Administrador da Plataforma",
};

export interface CreateTenantUserDTO {
  name: string;
  email: string;

  role: Omit<UserRole, "PLATFORM_ADMIN">;
}

export interface UpdateTenantUserDTO {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}
