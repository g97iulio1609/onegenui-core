/**
 * Streaming Types - TypeScript types derived from schemas
 */
import type { z } from "zod";
import type { StreamPatchSchema, UIElementMetaSchema } from "./schemas";

// =============================================================================
// Schema-derived Types
// =============================================================================

export type StreamPatch = z.infer<typeof StreamPatchSchema>;
export type UIElementMeta = z.infer<typeof UIElementMetaSchema>;

// =============================================================================
// Validation Types
// =============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  path: string;
  code: string;
  message: string;
}

export interface ValidationWarning {
  path: string;
  code: string;
  message: string;
  autoFixed?: boolean;
}

// =============================================================================
// Stream Connection Types
// =============================================================================

export interface StreamOptions {
  timeout?: number;
  retries?: number;
  validateFrames?: boolean;
  bufferSize?: number;
}

export interface StreamConnection {
  id: string;
  url: string;
  status: "connecting" | "connected" | "disconnected" | "error";
  lastSequence: number;
}
