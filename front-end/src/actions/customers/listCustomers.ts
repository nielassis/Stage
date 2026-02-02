import { CustomersListQuery } from "@/src/utils/customers/types";

export async function listCustomers(query?: CustomersListQuery) {
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, String(value));
      }
    });
  }

  const res = await fetch(`/api/customers?${params.toString()}`);

  if (!res.ok) {
    throw new Error("Erro ao listar clientes");
  }

  return res.json();
}
