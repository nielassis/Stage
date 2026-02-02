export function formatDateDDMMYY(date: string | Date) {
  const d = new Date(date);

  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}
