export async function fetchRecentActivities() {
  const res = await fetch(`/api/reports/os-stages/timeline`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Erro ao buscar atividades recentes");
  }

  return res.json();
}
