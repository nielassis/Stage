import { UpdateTenantUserDTO } from "@/src/utils/userContext/types";

export async function updateTenantUser(
  userId: string,
  data: UpdateTenantUserDTO,
) {
  const res = await fetch(`/api/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Erro ao atualizar usuário");
  }

  return res.json();
}
