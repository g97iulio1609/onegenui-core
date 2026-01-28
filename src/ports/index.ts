/**
 * @onegenui/core/ports - Hexagonal architecture ports
 */

// Storage
export type {
  PaginatedResult,
  PaginationOptions,
  SortOptions,
  StoragePort,
  UserScopedStoragePort,
} from "./storage";

// Cache
export type {
  CacheEntry,
  CacheOptions,
  CacheStats,
  CachePort,
  MultiLevelCachePort,
} from "./cache";
export { noopCache } from "./cache";

// Memory
export type {
  MemoryItem,
  MemoryQueryOptions,
  MemoryQueryResult,
  MemoryStorePort,
} from "./memory";
export { noopMemoryStore } from "./memory";

// Sync
export type {
  SyncOperation,
  SyncStatus,
  SyncConflict,
  ConflictResolution,
  SyncPort,
} from "./sync";
export { noopSync } from "./sync";
