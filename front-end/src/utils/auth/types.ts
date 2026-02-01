export enum UserRole {
  ADMIN = "ADMIN",
  SUPERVISOR = "SUPERVISOR",
  COLLABORATOR = "COLLABORATOR",
  PLATFORM_ADMIN = "PLATFORM_ADMIN",
}

export type Me = {
  id: string;
  name: string;
  tenantId: string;
  email: string;
  role: UserRole;
};
