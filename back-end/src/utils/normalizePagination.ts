function normalizePagination(page?: number, limit?: number) {
  const safePage = page && page > 0 ? Math.floor(page) : 1;
  const safeLimit = limit && limit > 0 ? Math.min(Math.floor(limit), 100) : 20;
  return { page: safePage, limit: safeLimit };
}
