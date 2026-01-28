/**
 * Storage Port - Generic persistence abstraction
 */

/**
 * Paginated result for queries
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page?: number;
  pageSize?: number;
}

/**
 * Sort options
 */
export interface SortOptions<T> {
  sortBy?: keyof T;
  sortOrder?: "asc" | "desc";
}

/**
 * Generic storage port for CRUD operations
 */
export interface StoragePort<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
  getAll(
    options?: PaginationOptions & SortOptions<T>,
  ): Promise<PaginatedResult<T>>;
  getById(id: string): Promise<T | null>;
  create(input: TCreate): Promise<T>;
  update(id: string, updates: TUpdate): Promise<T | null>;
  delete(id: string): Promise<void>;
  deleteMany(ids: string[]): Promise<void>;
  exists(id: string): Promise<boolean>;
  count(): Promise<number>;
}

/**
 * User-scoped storage port (multi-tenant)
 */
export interface UserScopedStoragePort<
  T,
  TCreate = Partial<T>,
  TUpdate = Partial<T>,
> {
  getAll(
    userId: string,
    options?: PaginationOptions & SortOptions<T>,
  ): Promise<PaginatedResult<T>>;
  getById(id: string, userId: string): Promise<T | null>;
  create(input: TCreate & { userId: string }): Promise<T>;
  update(id: string, userId: string, updates: TUpdate): Promise<T | null>;
  delete(id: string, userId: string): Promise<void>;
  deleteMany(ids: string[], userId: string): Promise<void>;
  exists(id: string, userId: string): Promise<boolean>;
  count(userId: string): Promise<number>;
}
