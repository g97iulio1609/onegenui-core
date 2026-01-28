/**
 * Cache Port - Caching abstraction
 */

/**
 * Cache entry with metadata
 */
export interface CacheEntry<T> {
  value: T;
  expiresAt?: number;
  createdAt: number;
  tags?: string[];
}

/**
 * Cache options
 */
export interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  tags?: string[];
}

/**
 * Cache statistics
 */
export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  maxSize: number;
}

/**
 * Generic cache port
 */
export interface CachePort<T = unknown> {
  get(key: string): Promise<T | null>;
  set(key: string, value: T, options?: CacheOptions): Promise<void>;
  delete(key: string): Promise<void>;
  has(key: string): Promise<boolean>;
  clear(): Promise<void>;
  invalidateByTag(tag: string): Promise<void>;
  getStats(): Promise<CacheStats>;
}

/**
 * Multi-level cache port (L1: memory, L2: storage)
 */
export interface MultiLevelCachePort<T = unknown> extends CachePort<T> {
  getWithFallback(key: string, fallback: () => Promise<T>): Promise<T>;
  warmup(keys: string[]): Promise<void>;
  getLevel(level: number): CachePort<T> | null;
}

/**
 * No-op cache implementation for testing
 */
export const noopCache: CachePort = {
  get: async () => null,
  set: async () => {},
  delete: async () => {},
  has: async () => false,
  clear: async () => {},
  invalidateByTag: async () => {},
  getStats: async () => ({ hits: 0, misses: 0, size: 0, maxSize: 0 }),
};
