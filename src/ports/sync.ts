/**
 * Sync Port - Offline/Online synchronization
 */

/**
 * Sync operation
 */
export interface SyncOperation {
  id: string;
  type: "create" | "update" | "delete";
  entityType: string;
  entityId: string;
  payload: unknown;
  timestamp: number;
  retryCount: number;
}

/**
 * Sync status
 */
export type SyncStatus = "idle" | "syncing" | "error" | "offline" | "conflict";

/**
 * Sync conflict
 */
export interface SyncConflict {
  operationId: string;
  localData: unknown;
  remoteData: unknown;
  conflictType: "update-update" | "update-delete" | "delete-update";
}

/**
 * Conflict resolution strategy
 */
export type ConflictResolution =
  | "local-wins"
  | "remote-wins"
  | "merge"
  | "manual";

/**
 * Sync port for offline-first operations
 */
export interface SyncPort {
  getStatus(): SyncStatus;
  getPendingOperations(): Promise<SyncOperation[]>;
  queueOperation(
    op: Omit<SyncOperation, "id" | "timestamp" | "retryCount">,
  ): Promise<string>;
  sync(): Promise<{
    synced: number;
    failed: number;
    conflicts: SyncConflict[];
  }>;
  resolveConflict(
    conflictId: string,
    resolution: ConflictResolution,
  ): Promise<void>;
  clearPending(): Promise<void>;
  onStatusChange(callback: (status: SyncStatus) => void): () => void;
}

/**
 * No-op sync port for testing
 */
export const noopSync: SyncPort = {
  getStatus: () => "idle",
  getPendingOperations: async () => [],
  queueOperation: async () => crypto.randomUUID(),
  sync: async () => ({ synced: 0, failed: 0, conflicts: [] }),
  resolveConflict: async () => {},
  clearPending: async () => {},
  onStatusChange: () => () => {},
};
