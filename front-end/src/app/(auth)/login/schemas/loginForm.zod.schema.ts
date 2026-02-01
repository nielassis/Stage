import { z } from "zod";

export const formSchema = z.object({
  email: z.string().email("Precisa ser um email válido"),
  password: z.string().min(1, "Senha é obrigatória"),
});
