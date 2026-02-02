export async function removeUserFromOs(osId: string, userId: string) {
  const res = await fetch(`/api/os/${osId}/users/${userId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Erro ao remover usuário da OS");
  }

  return res.json();
}
