export type PaginationMetadata = {
  page?: number;
  limit?: number;
};

export type PageResult<T> = {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
