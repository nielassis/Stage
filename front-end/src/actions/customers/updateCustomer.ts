import { UpdateCustomerDTO } from "@/src/utils/customers/types";

export async function updateCustomer(id: string, data: UpdateCustomerDTO) {
  const res = await fetch(`/api/customers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Erro ao atualizar cliente");
  }

  return res.json();
}
