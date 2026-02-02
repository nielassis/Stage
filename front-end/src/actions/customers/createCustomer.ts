import { CreateCustomerDTO } from "@/src/utils/customers/types";

export async function createCustomer(data: CreateCustomerDTO) {
  const res = await fetch("/api/customers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Erro ao criar cliente");
  }

  return res.json();
}
