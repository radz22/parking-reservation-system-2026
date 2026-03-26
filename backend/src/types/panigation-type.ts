export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  filterCategory?: string;
}

export interface PaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
