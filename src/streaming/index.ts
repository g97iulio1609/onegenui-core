/**
 * @onegenui/core/streaming - Streaming infrastructure
 */

// Schemas
export {
  StreamFrameSchema,
  StreamMessageSchema,
  StreamPatchSchema,
  StreamControlSchema,
  UIElementMetaSchema,
  UIElementSchema,
  PatchMessageSchema,
  ChatMessageSchema,
  QuestionMessageSchema,
  SuggestionMessageSchema,
  ToolProgressMessageSchema,
} from "./schemas";

// Types
export type {
  StreamFrame,
  StreamMessage,
  StreamPatch,
  StreamControl,
  UIElementMeta,
  PatchMessage,
  ChatMessage,
  QuestionMessage,
  SuggestionMessage,
  ToolProgressMessage,
  ControlMessage,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  StreamOptions,
  StreamConnection,
} from "./types";

// Validation
export {
  StreamValidationPipeline,
  createValidationPipeline,
} from "./validation";

// Patch Buffer
export { PatchBuffer, createPatchBuffer } from "./patch-buffer";

// Placeholder Manager
export {
  PlaceholderManager,
  createPlaceholderManager,
} from "./placeholder-manager";

// Ports (Hexagonal Architecture)
export type {
  StreamSourcePort,
  StreamSinkPort,
  ValidationPort,
  StreamPersistencePort,
  StreamTelemetryPort,
  StreamState,
  StreamMetrics,
} from "./ports";

export {
  noopStreamSource,
  noopStreamSink,
  noopStreamPersistence,
  noopStreamTelemetry,
} from "./ports";

// Wire Protocol v3
export {
  WireProtocolVersionSchema,
  WireControlEventSchema,
  WireProgressEventSchema,
  WirePatchEventSchema,
  WireMessageEventSchema,
  WireErrorEventSchema,
  WireDoneEventSchema,
  WireEventSchema,
  WireFrameSchema,
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
