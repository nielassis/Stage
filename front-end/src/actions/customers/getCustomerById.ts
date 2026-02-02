export async function getCustomerById(id: string) {
  const res = await fetch(`/api/customers/${id}`);

  if (!res.ok) {
    throw new Error("Erro ao buscar cliente");
  }

  return res.json();
}
