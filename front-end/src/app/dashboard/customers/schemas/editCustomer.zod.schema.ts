import { z } from "zod";
import { DocumentType } from "@/src/utils/customers/types";

export const updateCustomerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").optional(),
  email: z.string().email("Email inválido").optional(),
  documentType: z.nativeEnum(DocumentType).optional(),
  document: z.string().min(5, "Documento inválido").optional(),
});

export type UpdateCustomerFormData = z.infer<typeof updateCustomerSchema>;
