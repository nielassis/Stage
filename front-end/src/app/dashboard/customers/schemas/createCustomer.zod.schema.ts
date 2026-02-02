import { DocumentType } from "@/src/utils/customers/types";
import z from "zod";

export const createCustomerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  documentType: z.enum([DocumentType.CPF, DocumentType.CNPJ], {
    message: "Selecione o tipo de documento",
  }),
  document: z.string().min(11, "Documento inválido"),
});

export type CreateCustomerFormData = z.infer<typeof createCustomerSchema>;
