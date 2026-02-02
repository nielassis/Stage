import { CreateTenantUserDTO } from "@/src/utils/userContext/types";

export async function createTenantUser(data: CreateTenantUserDTO) {
  const res = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Erro ao criar usuário");
  }

  return res.json();
}
