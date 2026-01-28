/**
 * Memory/Recall Port - AI memory and context persistence
 */

/**
 * Memory item structure
 */
export interface MemoryItem {
  id: string;
  content: string;
  embedding?: number[];
  metadata: {
    source: string;
    timestamp: number;
    importance?: number;
    tags?: string[];
  };
}

/**
 * Memory query options
 */
export interface MemoryQueryOptions {
  limit?: number;
  minScore?: number;
  tags?: string[];
  since?: number;
}

/**
 * Memory query result
 */
export interface MemoryQueryResult {
  items: Array<MemoryItem & { score: number }>;
  totalMatches: number;
}

/**
 * Memory store port for AI context/recall
 */
export interface MemoryStorePort {
  store(item: Omit<MemoryItem, "id">): Promise<MemoryItem>;
  recall(
    query: string,
    options?: MemoryQueryOptions,
  ): Promise<MemoryQueryResult>;
  forget(id: string): Promise<void>;
  forgetByTag(tag: string): Promise<void>;
  consolidate(): Promise<void>; // Merge/compress old memories
  getStats(): Promise<{
    totalItems: number;
    oldestTimestamp: number;
    newestTimestamp: number;
  }>;
}

/**
 * No-op memory store for testing
 */
export const noopMemoryStore: MemoryStorePort = {
  store: async (item) => ({ id: crypto.randomUUID(), ...item }),
  recall: async () => ({ items: [], totalMatches: 0 }),
  forget: async () => {},
  forgetByTag: async () => {},
  consolidate: async () => {},
  getStats: async () => ({
    totalItems: 0,
    oldestTimestamp: 0,
    newestTimestamp: 0,
  }),
};
