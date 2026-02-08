/**
 * Streaming Ports - Hexagonal architecture ports for streaming
 */
import type { WireFrame, WireEvent } from "./protocol";
import type { ValidationResult, StreamOptions } from "./types";

// =============================================================================
// Stream Source Port (Primary/Driving)
// =============================================================================

/**
 * Port for receiving stream data
 */
export interface StreamSourcePort {
  /**
   * Connect to a stream source
   */
  connect(url: string, options?: StreamOptions): Promise<void>;

  /**
   * Disconnect from the stream source
   */
  disconnect(): Promise<void>;

  /**
   * Subscribe to stream frames
   */
  subscribe(callback: (frame: WireFrame) => void): () => void;

  /**
   * Subscribe to errors
   */
  onError(callback: (error: Error) => void): () => void;

  /**
   * Get connection status
   */
  isConnected(): boolean;
}

// =============================================================================
// Stream Sink Port (Secondary/Driven)
// =============================================================================

/**
 * Port for emitting stream data
 */
export interface StreamSinkPort {
  /**
   * Send a frame to the stream
   */
  send(frame: WireFrame): Promise<void>;

  /**
   * Send a message (will be wrapped in a frame)
   */
  sendMessage(message: WireEvent): Promise<void>;

  /**
   * Flush any buffered data
   */
  flush(): Promise<void>;

  /**
   * Close the stream
   */
  close(): Promise<void>;
}

// =============================================================================
// Validation Port
// =============================================================================

/**
 * Port for validating stream data
 */
export interface ValidationPort {
  /**
   * Validate a frame
   */
  validateFrame(frame: unknown): ValidationResult;

  /**
   * Validate a message
   */
  validateMessage(message: unknown): ValidationResult;

  /**
   * Parse with auto-recovery
   */
  parseWithRecovery(data: unknown): {
    frame: WireFrame | null;
    validation: ValidationResult;
    recovered: boolean;
  };

  /**
   * Register component types for validation
   */
  registerComponentTypes(types: string[]): void;
}

// =============================================================================
// Persistence Port
// =============================================================================

/**
 * Port for persisting stream state
 */
export interface StreamPersistencePort {
  /**
   * Save the current stream state
   */
  saveState(sessionId: string, state: StreamState): Promise<void>;

  /**
   * Load a saved stream state
   */
  loadState(sessionId: string): Promise<StreamState | null>;

  /**
   * Delete a saved state
   */
  deleteState(sessionId: string): Promise<void>;

  /**
   * List all saved sessions
   */
  listSessions(): Promise<string[]>;
}

/**
 * Stream state for persistence
 */
export interface StreamState {
  sessionId: string;
  lastSequence: number;
  pendingFrames: WireFrame[];
  timestamp: number;
}

// =============================================================================
// Telemetry Port
// =============================================================================

/**
 * Port for stream telemetry/observability
 */
export interface StreamTelemetryPort {
  /**
   * Record a frame received event
   */
  recordFrameReceived(frame: WireFrame): void;

  /**
   * Record a validation error
   */
  recordValidationError(frame: unknown, result: ValidationResult): void;

  /**
   * Record sequence gap
   */
  recordSequenceGap(expected: number, received: number): void;

  /**
   * Record recovery action
   */
  recordRecovery(frame: WireFrame): void;

  /**
   * Get metrics
   */
  getMetrics(): StreamMetrics;
}

/**
 * Stream metrics
 */
export interface StreamMetrics {
  framesReceived: number;
  framesValidated: number;
  validationErrors: number;
  recoveries: number;
  sequenceGaps: number;
  averageLatency: number;
}

// =============================================================================
// No-op Implementations (for testing/defaults)
// =============================================================================

export const noopStreamSource: StreamSourcePort = {
  connect: async () => {},
  disconnect: async () => {},
  subscribe: () => () => {},
  onError: () => () => {},
  isConnected: () => false,
};

export const noopStreamSink: StreamSinkPort = {
  send: async () => {},
  sendMessage: async () => {},
  flush: async () => {},
  close: async () => {},
};

export const noopStreamPersistence: StreamPersistencePort = {
  saveState: async () => {},
  loadState: async () => null,
  deleteState: async () => {},
  listSessions: async () => [],
};

export const noopStreamTelemetry: StreamTelemetryPort = {
  recordFrameReceived: () => {},
  recordValidationError: () => {},
  recordSequenceGap: () => {},
  recordRecovery: () => {},
  getMetrics: () => ({
    framesReceived: 0,
    framesValidated: 0,
    validationErrors: 0,
    recoveries: 0,
    sequenceGaps: 0,
    averageLatency: 0,
  }),
};
