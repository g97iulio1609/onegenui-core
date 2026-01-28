/**
 * Patch Buffer - Handles out-of-order patch reordering
 */
import type { StreamPatch, StreamFrame } from "./types";

// =============================================================================
// Types
// =============================================================================

interface BufferedFrame {
  frame: StreamFrame;
  receivedAt: number;
}

interface FlushResult {
  frames: StreamFrame[];
  gaps: number[];
}

// =============================================================================
// Patch Buffer Class
// =============================================================================

export class PatchBuffer {
  private buffer: Map<number, BufferedFrame> = new Map();
  private expectedSequence = 0;
  private readonly maxBufferSize: number;
  private readonly gapTimeout: number;
  private readonly flushInterval: number;
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private onFlush: ((frames: StreamFrame[]) => void) | null = null;

  constructor(
    options: {
      maxBufferSize?: number;
      gapTimeout?: number;
      flushInterval?: number;
    } = {},
  ) {
    this.maxBufferSize = options.maxBufferSize ?? 100;
    this.gapTimeout = options.gapTimeout ?? 5000;
    this.flushInterval = options.flushInterval ?? 50;
  }

  /**
   * Set flush callback
   */
  setOnFlush(callback: (frames: StreamFrame[]) => void): void {
    this.onFlush = callback;
  }

  /**
   * Add a frame to the buffer
   */
  add(frame: StreamFrame): void {
    const { sequence } = frame;

    // Store in buffer
    this.buffer.set(sequence, {
      frame,
      receivedAt: Date.now(),
    });

    // If this is the expected sequence, try to flush
    if (sequence === this.expectedSequence) {
      this.scheduleFlush();
    }

    // If buffer is too large, force flush with gaps
    if (this.buffer.size > this.maxBufferSize) {
      this.forceFlush();
    }
  }

  /**
   * Schedule a flush
   */
  private scheduleFlush(): void {
    if (this.flushTimer) return;

    this.flushTimer = setTimeout(() => {
      this.flushTimer = null;
      this.flush();
    }, this.flushInterval);
  }

  /**
   * Flush in-order frames
   */
  flush(): FlushResult {
    const frames: StreamFrame[] = [];
    const gaps: number[] = [];

    while (this.buffer.has(this.expectedSequence)) {
      const buffered = this.buffer.get(this.expectedSequence)!;
      frames.push(buffered.frame);
      this.buffer.delete(this.expectedSequence);
      this.expectedSequence++;
    }

    if (frames.length > 0 && this.onFlush) {
      this.onFlush(frames);
    }

    return { frames, gaps };
  }

  /**
   * Force flush with gap handling
   */
  forceFlush(): FlushResult {
    const frames: StreamFrame[] = [];
    const gaps: number[] = [];
    const now = Date.now();

    // Find the minimum sequence in buffer
    let minSeq = Infinity;
    for (const seq of this.buffer.keys()) {
      if (seq < minSeq) minSeq = seq;
    }

    if (minSeq === Infinity) {
      return { frames, gaps };
    }

    // Check for timed-out gaps
    while (minSeq > this.expectedSequence) {
      const buffered = this.buffer.get(minSeq);
      if (buffered && now - buffered.receivedAt > this.gapTimeout) {
        // Gap has timed out, skip to minSeq
        for (let i = this.expectedSequence; i < minSeq; i++) {
          gaps.push(i);
        }
        this.expectedSequence = minSeq;
        break;
      }
      break;
    }

    // Flush available frames
    return this.flush();
  }

  /**
   * Reset buffer state
   */
  reset(): void {
    this.buffer.clear();
    this.expectedSequence = 0;
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }
  }

  /**
   * Get buffer statistics
   */
  getStats(): {
    bufferedCount: number;
    expectedSequence: number;
    oldestAge: number;
  } {
    let oldestAge = 0;
    const now = Date.now();

    for (const buffered of this.buffer.values()) {
      const age = now - buffered.receivedAt;
      if (age > oldestAge) oldestAge = age;
    }

    return {
      bufferedCount: this.buffer.size,
      expectedSequence: this.expectedSequence,
      oldestAge,
    };
  }
}

// =============================================================================
// Factory Function
// =============================================================================

export function createPatchBuffer(options?: {
  maxBufferSize?: number;
  gapTimeout?: number;
  flushInterval?: number;
}): PatchBuffer {
  return new PatchBuffer(options);
}
