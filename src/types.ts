import { z } from "zod";
import { getByPath } from "@onegenui/utils";

// Re-export for convenience
export { getByPath } from "@onegenui/utils";

/**
 * Dynamic value - can be a literal or a path reference to data model
 */
export type DynamicValue<T = unknown> = T | { path: string };

/**
 * Dynamic string value
 */
export type DynamicString = DynamicValue<string>;

/**
 * Dynamic number value
 */
export type DynamicNumber = DynamicValue<number>;

/**
 * Dynamic boolean value
 */
export type DynamicBoolean = DynamicValue<boolean>;

/**
 * Zod schema for dynamic values
 */
export const DynamicValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.object({ path: z.string() }),
]);

export const DynamicStringSchema = z.union([
  z.string(),
  z.object({ path: z.string() }),
]);

export const DynamicNumberSchema = z.union([
  z.number(),
  z.object({ path: z.string() }),
]);

export const DynamicBooleanSchema = z.union([
  z.boolean(),
  z.object({ path: z.string() }),
]);

/**
 * Sizing configuration for UI elements
 */
export interface ElementSize {
  /** Width in pixels or CSS value */
  width?: number | string;
  /** Height in pixels or CSS value */
  height?: number | string;
  /** Minimum width in pixels */
  minWidth?: number;
  /** Maximum width in pixels */
  maxWidth?: number;
  /** Minimum height in pixels */
  minHeight?: number;
  /** Maximum height in pixels */
  maxHeight?: number;
}

/**
 * Grid layout configuration for UI elements
 */
export interface ElementGridLayout {
  /** Grid column start (1-indexed) */
  column?: number;
  /** Grid row start (1-indexed) */
  row?: number;
  /** Number of columns to span */
  columnSpan?: number;
  /** Number of rows to span */
  rowSpan?: number;
}

/**
 * Resize configuration for UI elements
 */
export interface ElementResizeConfig {
  /** Enable horizontal resize */
  horizontal?: boolean;
  /** Enable vertical resize */
  vertical?: boolean;
  /** Snap to grid size in pixels */
  snapToGrid?: number;
  /** Preserve aspect ratio */
  preserveAspectRatio?: boolean;
}

/**
 * Complete layout configuration for UI elements
 */
export interface ElementLayout {
  /** Explicit sizing */
  size?: ElementSize;
  /** Grid positioning */
  grid?: ElementGridLayout;
  /** Resize behavior */
  resizable?: boolean | ElementResizeConfig;
}

/**
 * Base UI element structure for v2
 */
export interface UIElement<
  T extends string = string,
  P = Record<string, unknown>,
> {
  /** Unique key for reconciliation */
  key: string;
  /** Component type from the catalog */
  type: T;
  /** Component props */
  props: P;
  /** Child element keys (flat structure) */
  children?: string[];
  /** Parent element key (null for root) */
  parentKey?: string | null;
  /** Visibility condition */
  visible?: VisibilityCondition;
  /** If true, content editing is disabled for this element */
  locked?: boolean;
  /** Layout configuration (sizing, grid position, resize) */
  layout?: ElementLayout;
  /** System metadata (turnId for chronological ordering, etc.) */
  _meta?: {
    /** ID of the turn that last modified this element */
    turnId?: string;
    /** Timestamp when element was created */
    createdAt?: number;
    /** Timestamp when element was last modified */
    lastModifiedAt?: number;
    /** True if element was auto-created as placeholder */
    autoCreated?: boolean;
  };
}

/**
 * Visibility condition types
 */
export type VisibilityCondition =
  | boolean
  | { path: string }
  | { auth: "signedIn" | "signedOut" }
  | { role: string | string[] }
  | { feature: string | string[] }
  | {
      device:
        | "mobile"
        | "tablet"
        | "desktop"
        | ("mobile" | "tablet" | "desktop")[];
    }
  | LogicExpression;

/**
 * Logic expression for complex conditions
 */
export type LogicExpression =
  | { and: LogicExpression[] }
  | { or: LogicExpression[] }
  | { not: LogicExpression }
  | { path: string }
  | { eq: [DynamicValue, DynamicValue] }
  | { neq: [DynamicValue, DynamicValue] }
  | { gt: [DynamicValue<number>, DynamicValue<number>] }
  | { gte: [DynamicValue<number>, DynamicValue<number>] }
  | { lt: [DynamicValue<number>, DynamicValue<number>] }
  | { lte: [DynamicValue<number>, DynamicValue<number>] };

/**
 * Flat UI tree structure (optimized for LLM generation)
 */
export interface UITree {
  /** Root element key */
  root: string;
  /** Flat map of elements by key */
  elements: Record<string, UIElement>;
}

/**
 * Auth state for visibility evaluation
 */
export interface AuthState {
  isSignedIn: boolean;
  user?: Record<string, unknown>;
  roles?: string[];
}

/**
 * Feature flags state
 */
export interface FeatureFlags {
  enabled: string[];
}

/**
 * Device detection state
 */
export interface DeviceState {
  type: "mobile" | "tablet" | "desktop";
  isTouchDevice?: boolean;
}

/**
 * Data model type
 */
export type DataModel = Record<string, unknown>;

/**
 * Component schema definition using Zod
 */
export type ComponentSchema = z.ZodType<Record<string, unknown>>;

/**
 * Validation mode for catalog validation
 */
export type ValidationMode = "strict" | "warn" | "ignore";

/**
 * JSON patch operation types
 */
export type PatchOp =
  | "add"
  | "remove"
  | "replace"
  | "set"
  | "ensure"
  | "message"
  | "question"
  | "suggestion";

/**
 * JSON patch operation
 */
export interface JsonPatch {
  op: PatchOp;
  path: string;
  value?: unknown;
  /** Question payload (for op: "question") */
  question?: unknown;
  /** Suggestions array (for op: "suggestion") */
  suggestions?: unknown[];
}

/**
 * Zod schema for JSON patch
 */
export const JsonPatchSchema = z.object({
  op: z.enum([
    "add",
    "remove",
    "replace",
    "set",
    "message",
    "question",
    "suggestion",
  ]),
  path: z.string().optional(),
  value: z.unknown().optional(),
  question: z.unknown().optional(),
  suggestions: z.array(z.unknown()).optional(),
});

/**
 * Resolve a dynamic value against a data model
 */
export function resolveDynamicValue<T>(
  value: DynamicValue<T>,
  dataModel: DataModel,
): T | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === "object" && "path" in value) {
    return getByPath(dataModel, value.path) as T | undefined;
  }

  return value as T;
}

/**
 * Set a value in an object by JSON Pointer path
 */
export function setByPath(
  obj: Record<string, unknown>,
  path: string,
  value: unknown,
): void {
  const segments = path.startsWith("/")
    ? path.slice(1).split("/")
    : path.split("/");

  if (segments.length === 0) return;

  const isArraySegment = (segment: string) =>
    segment === "-" || /^\d+$/.test(segment);

  let current: Record<string, unknown> | unknown[] = obj;

  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i]!;
    const nextSegment = segments[i + 1]!;
    const shouldCreateArray = isArraySegment(nextSegment);

    if (Array.isArray(current)) {
      const index = segment === "-" ? current.length : Number(segment);
      if (!Number.isInteger(index) || index < 0) return;

      const existing = current[index];
      if (existing === null || typeof existing !== "object") {
        current[index] = shouldCreateArray ? [] : {};
      }

      const nextValue = current[index];
      if (Array.isArray(nextValue) || typeof nextValue === "object") {
        current = nextValue as Record<string, unknown> | unknown[];
      } else {
        return;
      }
    } else {
      if (
        !(segment in current) ||
        current[segment] === null ||
        typeof current[segment] !== "object"
      ) {
        current[segment] = shouldCreateArray ? [] : {};
      }

      const nextValue = current[segment];
      if (Array.isArray(nextValue) || typeof nextValue === "object") {
        current = nextValue as Record<string, unknown> | unknown[];
      } else {
        return;
      }
    }
  }

  const lastSegment = segments[segments.length - 1]!;

  if (Array.isArray(current)) {
    if (lastSegment === "-") {
      current.push(value);
      return;
    }

    const index = Number(lastSegment);
    if (!Number.isInteger(index) || index < 0) return;
    current[index] = value;
    return;
  }

  current[lastSegment] = value;
}

// ─────────────────────────────────────────────────────────────────────────────
// Document Index Types (Vectorless)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A node in the document index tree
 */
export interface DocumentIndexNode {
  /** Node title/heading */
  title: string;
  /** Unique identifier */
  nodeId: string;
  /** Starting page number */
  startPage: number;
  /** Ending page number */
  endPage: number;
  /** Summary of the section content */
  summary?: string;
  /** Child nodes */
  children?: DocumentIndexNode[];
}

/**
 * Document index data from Vectorless smart parsing
 */
export interface DocumentIndex {
  /** Document title */
  title: string;
  /** Document description */
  description: string;
  /** Total page count */
  pageCount: number;
  /** Hierarchical index nodes */
  nodes: DocumentIndexNode[];
}

/**
 * Stream event types for document processing
 */
export type StreamEventType =
  | "tool-progress"
  | "document-index-ui"
  | "persisted-attachments"
  | "plan-created"
  | "level-started"
  | "step-started"
  | "step-done"
  | "subtask-started"
  | "subtask-done"
  | "orchestration-done";

/**
 * Tool progress status
 */
export type ToolProgressStatus = "starting" | "progress" | "complete" | "error";

/**
 * Tool progress stream event
 */
export interface ToolProgressEvent {
  type: "tool-progress";
  toolName: string;
  toolCallId: string;
  status: ToolProgressStatus;
  message?: string;
  data?: unknown;
  progress?: number; // 0-100
  timestamp?: number;
}

/**
 * Document index UI stream event
 */
export interface DocumentIndexEvent {
  type: "document-index-ui";
  uiComponent: {
    type: "DocumentIndex";
    props: DocumentIndex;
  };
}
