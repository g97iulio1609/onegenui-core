// Types
export type {
  DynamicValue,
  DynamicString,
  DynamicNumber,
  DynamicBoolean,
  UIElement,
  UITree,
  VisibilityCondition,
  LogicExpression,
  AuthState,
  FeatureFlags,
  DeviceState,
  DataModel,
  ComponentSchema,
  ValidationMode,
  PatchOp,
  JsonPatch,
  ElementSize,
  ElementGridLayout,
  ElementResizeConfig,
  ElementLayout,
  // Document Index types (Vectorless)
  DocumentIndexNode,
  DocumentIndex,
  StreamEventType,
  ToolProgressStatus,
  ToolProgressEvent,
  DocumentIndexEvent,
} from "./types";

export {
  DynamicValueSchema,
  DynamicStringSchema,
  DynamicNumberSchema,
  DynamicBooleanSchema,
  resolveDynamicValue,
  getByPath,
  setByPath,
} from "./types";

// Visibility
export type { VisibilityContext } from "./visibility";

export {
  VisibilityConditionSchema,
  LogicExpressionSchema,
  evaluateVisibility,
  evaluateLogicExpression,
  visibility,
} from "./visibility";

// Actions
export type {
  Action,
  ActionConfirm,
  ActionOnSuccess,
  ActionOnError,
  ActionRetryConfig,
  ActionOptimisticConfig,
  ActionHandler,
  ActionDefinition,
  ResolvedAction,
  ActionExecutionContext,
} from "./actions";

export {
  ActionSchema,
  ActionConfirmSchema,
  ActionOnSuccessSchema,
  ActionOnErrorSchema,
  ActionRetryConfigSchema,
  ActionOptimisticConfigSchema,
  resolveAction,
  executeAction,
  interpolateString,
  action,
} from "./actions";

// Validation
export type {
  ValidationCheck,
  ValidationConfig,
  ValidationFunction,
  ValidationFunctionDefinition,
  ValidationCheckResult,
  ValidationResult,
  ValidationContext,
} from "./validation";

export {
  ValidationCheckSchema,
  ValidationConfigSchema,
  builtInValidationFunctions,
  runValidationCheck,
  runValidation,
  check,
} from "./validation";

// Catalog
export type {
  ComponentDefinition,
  CatalogConfig,
  Catalog,
  InferCatalogComponentProps,
} from "./catalog";

export { createCatalog, generateCatalogPrompt } from "./catalog";

// Component Definition Helper
export type {
  DefineComponentConfig,
  TypedComponentDefinition,
  InferComponentProps,
  InferComponentName,
  CreateCatalogFromComponentsOptions,
} from "./component";

export {
  defineComponent,
  toCatalogDefinition,
  toCatalogDefinitions,
  createCatalogFromComponents,
} from "./component";

// Prompt Generation
export type {
  PromptGeneratorConfig,
  TrackedActionForPrompt,
  TrackedActionType,
  TextSelectionForPrompt,
  LayoutInfoForPrompt,
} from "./prompt-generator";

export {
  generateSystemPrompt,
  generateTreeContextPrompt,
  generateSelectionContextPrompt,
  generateDeepSelectionPrompt,
  generateTextSelectionPrompt,
  generateActionsContextPrompt,
  generateLayoutContextPrompt,
} from "./prompt-generator";

// Streaming
export * from "./streaming";

// Ports
export * from "./ports";
