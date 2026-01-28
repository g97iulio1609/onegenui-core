/**
 * Placeholder Manager - Handles forward-reference resolution
 */
import type { UIElement } from "../types";

// =============================================================================
// Types
// =============================================================================

interface PlaceholderInfo {
  key: string;
  parentKey: string | null;
  createdAt: number;
  referencedBy: Set<string>;
}

interface ResolutionResult {
  resolved: boolean;
  element: UIElement | null;
  dependents: string[];
}

// =============================================================================
// Placeholder Manager Class
// =============================================================================

export class PlaceholderManager {
  private placeholders: Map<string, PlaceholderInfo> = new Map();
  private pendingElements: Map<string, UIElement> = new Map();
  private readonly timeout: number;

  constructor(options: { timeout?: number } = {}) {
    this.timeout = options.timeout ?? 5000;
  }

  /**
   * Create a placeholder for a forward-referenced element
   */
  createPlaceholder(key: string, parentKey: string | null): UIElement {
    // Track placeholder
    this.placeholders.set(key, {
      key,
      parentKey,
      createdAt: Date.now(),
      referencedBy: new Set(),
    });

    // Return placeholder element
    return {
      key,
      type: "__placeholder__",
      props: {
        _isPlaceholder: true,
        _createdAt: Date.now(),
      },
    };
  }

  /**
   * Check if a key is a placeholder
   */
  isPlaceholder(key: string): boolean {
    return this.placeholders.has(key);
  }

  /**
   * Register that an element references a placeholder
   */
  addReference(placeholderKey: string, referencingKey: string): void {
    const info = this.placeholders.get(placeholderKey);
    if (info) {
      info.referencedBy.add(referencingKey);
    }
  }

  /**
   * Resolve a placeholder with the real element
   */
  resolve(key: string, element: UIElement): ResolutionResult {
    const info = this.placeholders.get(key);

    if (!info) {
      // Not a placeholder, just store
      this.pendingElements.set(key, element);
      return { resolved: true, element, dependents: [] };
    }

    // Remove from placeholders
    this.placeholders.delete(key);

    // Get dependents
    const dependents = Array.from(info.referencedBy);

    return { resolved: true, element, dependents };
  }

  /**
   * Check for timed-out placeholders
   */
  checkTimeouts(): string[] {
    const timedOut: string[] = [];
    const now = Date.now();

    for (const [key, info] of this.placeholders) {
      if (now - info.createdAt > this.timeout) {
        timedOut.push(key);
      }
    }

    return timedOut;
  }

  /**
   * Remove timed-out placeholders
   */
  pruneTimedOut(): string[] {
    const timedOut = this.checkTimeouts();

    for (const key of timedOut) {
      this.placeholders.delete(key);
    }

    return timedOut;
  }

  /**
   * Get all pending placeholders
   */
  getPendingPlaceholders(): string[] {
    return Array.from(this.placeholders.keys());
  }

  /**
   * Get statistics
   */
  getStats(): {
    placeholderCount: number;
    pendingCount: number;
    oldestAge: number;
  } {
    let oldestAge = 0;
    const now = Date.now();

    for (const info of this.placeholders.values()) {
      const age = now - info.createdAt;
      if (age > oldestAge) oldestAge = age;
    }

    return {
      placeholderCount: this.placeholders.size,
      pendingCount: this.pendingElements.size,
      oldestAge,
    };
  }

  /**
   * Reset manager state
   */
  reset(): void {
    this.placeholders.clear();
    this.pendingElements.clear();
  }
}

// =============================================================================
// Factory Function
// =============================================================================

export function createPlaceholderManager(options?: {
  timeout?: number;
}): PlaceholderManager {
  return new PlaceholderManager(options);
}
