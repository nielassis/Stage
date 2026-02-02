import { TenantUsersResponse } from "@/src/utils/userContext/types";

export async function fetchTenantUsers(
  page = 1,
  limit = 10,
  name = "",
  email = "",
  role?: string,
): Promise<TenantUsersResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(name && { name }),
    ...(email && { email }),
    ...(role && { role }),
  });

  const res = await fetch(`/api/users?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar usuários");
  }

  return res.json();
}
