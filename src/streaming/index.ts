/**
 * @onegenui/core/streaming — Wire Protocol v3 + Patch Infrastructure
 *
 * Single transport contract for all streaming communication.
 * Patch schemas for UI tree mutation validation.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Wire Protocol v3 — frame schema, event types, factory
// ─────────────────────────────────────────────────────────────────────────────

export {
  WireFrameSchema,
  WireEventSchema,
  WirePatchEventSchema,
  WireMessageEventSchema,
  WireProgressEventSchema,
  WireControlEventSchema,
  WireErrorEventSchema,
  WireDoneEventSchema,
  createWireFrame,
  type WireEvent,
  type WireFrame,
  type WireControlEvent,
  type WireProgressEvent,
  type WirePatchEvent,
  type WireMessageEvent,
  type WireErrorEvent,
  type WireDoneEvent,
  type CreateWireFrameInput,
} from "./protocol";

// ─────────────────────────────────────────────────────────────────────────────
// UI Patch Contract — normalization, validation, expansion
// ─────────────────────────────────────────────────────────────────────────────

export {
  NormalizedUiPatchSchema,
  normalizeUiPatch,
} from "./ui-patch-contract";

export {
  expandUiPatchForProgressiveRendering,
  type ExpandResult,
} from "./patch-expander";

// ─────────────────────────────────────────────────────────────────────────────
// UI Element Schemas — tree structure validation
// ─────────────────────────────────────────────────────────────────────────────

export {
  UIElementSchema,
} from "./schemas";
