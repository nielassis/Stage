import { z } from "zod";
import { UserRole } from "@/src/utils/auth/types";

export const createUserSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  role: z.enum(
    [UserRole.ADMIN, UserRole.SUPERVISOR, UserRole.COLLABORATOR],
    "Deve ter papel definido: Administrador, Supervisor ou Colaborador",
  ),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
