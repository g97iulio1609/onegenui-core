/**
 * Streaming Types - TypeScript types derived from schemas
 */
import type { z } from "zod";
import type {
  StreamFrameSchema,
  StreamMessageSchema,
  StreamPatchSchema,
  StreamControlSchema,
  UIElementMetaSchema,
} from "./schemas";

// =============================================================================
// Frame Types
// =============================================================================

export type StreamFrame = z.infer<typeof StreamFrameSchema>;
export type StreamMessage = z.infer<typeof StreamMessageSchema>;
export type StreamPatch = z.infer<typeof StreamPatchSchema>;
export type StreamControl = z.infer<typeof StreamControlSchema>;
export type UIElementMeta = z.infer<typeof UIElementMetaSchema>;

// =============================================================================
// Message Discriminated Union Types
// =============================================================================

export interface PatchMessage {
  type: "patch";
  patches: StreamPatch[];
  targetPath?: string;
}

export interface ChatMessage {
  type: "message";
  role: "user" | "assistant" | "system";
  content: string;
  id?: string;
}

export interface QuestionMessage {
  type: "question";
  questionId: string;
  prompt: string;
  options?: Array<{ label: string; value: string }>;
  inputType?: "text" | "select" | "multiselect" | "number" | "date";
  required?: boolean;
}

export interface SuggestionMessage {
  type: "suggestion";
  suggestions: Array<{
    id: string;
    label: string;
    action?: string;
  }>;
}

export interface ToolProgressMessage {
  type: "tool-progress";
  toolId: string;
  toolName: string;
  status: "pending" | "running" | "complete" | "error";
  progress?: number;
  message?: string;
  result?: unknown;
}

export interface ControlMessage {
  type: "control";
  action: "start" | "end" | "error" | "abort";
  error?: {
    code: string;
    message: string;
    recoverable: boolean;
  };
}

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
