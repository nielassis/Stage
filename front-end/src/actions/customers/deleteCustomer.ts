export async function deleteCustomer(id: string) {
  const res = await fetch(`/api/customers/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Erro ao deletar cliente");
  }

  return res.json();
}
