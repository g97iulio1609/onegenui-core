"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ActionConfirmSchema: () => ActionConfirmSchema,
  ActionOnErrorSchema: () => ActionOnErrorSchema,
  ActionOnSuccessSchema: () => ActionOnSuccessSchema,
  ActionOptimisticConfigSchema: () => ActionOptimisticConfigSchema,
  ActionRetryConfigSchema: () => ActionRetryConfigSchema,
  ActionSchema: () => ActionSchema,
  ChatMessageSchema: () => ChatMessageSchema,
  DynamicBooleanSchema: () => DynamicBooleanSchema,
  DynamicNumberSchema: () => DynamicNumberSchema,
  DynamicStringSchema: () => DynamicStringSchema,
  DynamicValueSchema: () => DynamicValueSchema,
  LogicExpressionSchema: () => LogicExpressionSchema,
  PatchBuffer: () => PatchBuffer,
  PatchMessageSchema: () => PatchMessageSchema,
  PlaceholderManager: () => PlaceholderManager,
  QuestionMessageSchema: () => QuestionMessageSchema,
  StreamControlSchema: () => StreamControlSchema,
  StreamFrameSchema: () => StreamFrameSchema,
  StreamMessageSchema: () => StreamMessageSchema,
  StreamPatchSchema: () => StreamPatchSchema,
  StreamValidationPipeline: () => StreamValidationPipeline,
  SuggestionMessageSchema: () => SuggestionMessageSchema,
  ToolProgressMessageSchema: () => ToolProgressMessageSchema,
  UIElementMetaSchema: () => UIElementMetaSchema,
  UIElementSchema: () => UIElementSchema,
  ValidationCheckSchema: () => ValidationCheckSchema,
  ValidationConfigSchema: () => ValidationConfigSchema,
  VisibilityConditionSchema: () => VisibilityConditionSchema,
  action: () => action,
  builtInValidationFunctions: () => builtInValidationFunctions,
  check: () => check,
  createCatalog: () => createCatalog,
  createCatalogFromComponents: () => createCatalogFromComponents,
  createPatchBuffer: () => createPatchBuffer,
  createPlaceholderManager: () => createPlaceholderManager,
  createValidationPipeline: () => createValidationPipeline,
  defineComponent: () => defineComponent,
  evaluateLogicExpression: () => evaluateLogicExpression,
  evaluateVisibility: () => evaluateVisibility,
  executeAction: () => executeAction,
  generateActionsContextPrompt: () => generateActionsContextPrompt,
  generateCatalogPrompt: () => generateCatalogPrompt,
  generateDeepSelectionPrompt: () => generateDeepSelectionPrompt,
  generateLayoutContextPrompt: () => generateLayoutContextPrompt,
  generateSelectionContextPrompt: () => generateSelectionContextPrompt,
  generateSystemPrompt: () => generateSystemPrompt,
  generateTextSelectionPrompt: () => generateTextSelectionPrompt,
  generateTreeContextPrompt: () => generateTreeContextPrompt,
  getByPath: () => import_utils2.getByPath,
  interpolateString: () => interpolateString,
  noopCache: () => noopCache,
  noopMemoryStore: () => noopMemoryStore,
  noopStreamPersistence: () => noopStreamPersistence,
  noopStreamSink: () => noopStreamSink,
  noopStreamSource: () => noopStreamSource,
  noopStreamTelemetry: () => noopStreamTelemetry,
  noopSync: () => noopSync,
  resolveAction: () => resolveAction,
  resolveDynamicValue: () => resolveDynamicValue,
  runValidation: () => runValidation,
  runValidationCheck: () => runValidationCheck,
  setByPath: () => setByPath,
  toCatalogDefinition: () => toCatalogDefinition,
  toCatalogDefinitions: () => toCatalogDefinitions,
  visibility: () => visibility
});
module.exports = __toCommonJS(index_exports);

// src/types.ts
var import_zod = require("zod");
var import_utils = require("@onegenui/utils");
var import_utils2 = require("@onegenui/utils");
var DynamicValueSchema = import_zod.z.union([
  import_zod.z.string(),
  import_zod.z.number(),
  import_zod.z.boolean(),
  import_zod.z.null(),
  import_zod.z.object({ path: import_zod.z.string() })
]);
var DynamicStringSchema = import_zod.z.union([
  import_zod.z.string(),
  import_zod.z.object({ path: import_zod.z.string() })
]);
var DynamicNumberSchema = import_zod.z.union([
  import_zod.z.number(),
  import_zod.z.object({ path: import_zod.z.string() })
]);
var DynamicBooleanSchema = import_zod.z.union([
  import_zod.z.boolean(),
  import_zod.z.object({ path: import_zod.z.string() })
]);
var JsonPatchSchema = import_zod.z.object({
  op: import_zod.z.enum([
    "add",
    "remove",
    "replace",
    "set",
    "message",
    "question",
    "suggestion"
  ]),
  path: import_zod.z.string().optional(),
  value: import_zod.z.unknown().optional(),
  question: import_zod.z.unknown().optional(),
  suggestions: import_zod.z.array(import_zod.z.unknown()).optional()
});
function resolveDynamicValue(value, dataModel) {
  if (value === null || value === void 0) {
    return void 0;
  }
  if (typeof value === "object" && "path" in value) {
    return (0, import_utils.getByPath)(dataModel, value.path);
  }
  return value;
}
function setByPath(obj, path, value) {
  const segments = path.startsWith("/") ? path.slice(1).split("/") : path.split("/");
  if (segments.length === 0) return;
  const isArraySegment = (segment) => segment === "-" || /^\d+$/.test(segment);
  let current = obj;
  for (let i = 0; i < segments.length - 1; i++) {
    const segment = segments[i];
    const nextSegment = segments[i + 1];
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
        current = nextValue;
      } else {
        return;
      }
    } else {
      if (!(segment in current) || current[segment] === null || typeof current[segment] !== "object") {
        current[segment] = shouldCreateArray ? [] : {};
      }
      const nextValue = current[segment];
      if (Array.isArray(nextValue) || typeof nextValue === "object") {
        current = nextValue;
      } else {
        return;
      }
    }
  }
  const lastSegment = segments[segments.length - 1];
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

// src/visibility.ts
var import_zod2 = require("zod");
var DynamicNumberValueSchema = import_zod2.z.union([
  import_zod2.z.number(),
  import_zod2.z.object({ path: import_zod2.z.string() })
]);
var LogicExpressionSchema = import_zod2.z.lazy(
  () => import_zod2.z.union([
    import_zod2.z.object({ and: import_zod2.z.array(LogicExpressionSchema) }),
    import_zod2.z.object({ or: import_zod2.z.array(LogicExpressionSchema) }),
    import_zod2.z.object({ not: LogicExpressionSchema }),
    import_zod2.z.object({ path: import_zod2.z.string() }),
    import_zod2.z.object({ eq: import_zod2.z.tuple([DynamicValueSchema, DynamicValueSchema]) }),
    import_zod2.z.object({ neq: import_zod2.z.tuple([DynamicValueSchema, DynamicValueSchema]) }),
    import_zod2.z.object({
      gt: import_zod2.z.tuple([DynamicNumberValueSchema, DynamicNumberValueSchema])
    }),
    import_zod2.z.object({
      gte: import_zod2.z.tuple([DynamicNumberValueSchema, DynamicNumberValueSchema])
    }),
    import_zod2.z.object({
      lt: import_zod2.z.tuple([DynamicNumberValueSchema, DynamicNumberValueSchema])
    }),
    import_zod2.z.object({
      lte: import_zod2.z.tuple([DynamicNumberValueSchema, DynamicNumberValueSchema])
    })
  ])
);
var deviceTypeSchema = import_zod2.z.enum(["mobile", "tablet", "desktop"]);
var VisibilityConditionSchema = import_zod2.z.union([
  import_zod2.z.boolean(),
  import_zod2.z.object({ path: import_zod2.z.string() }),
  import_zod2.z.object({ auth: import_zod2.z.enum(["signedIn", "signedOut"]) }),
  import_zod2.z.object({ role: import_zod2.z.union([import_zod2.z.string(), import_zod2.z.array(import_zod2.z.string())]) }),
  import_zod2.z.object({ feature: import_zod2.z.union([import_zod2.z.string(), import_zod2.z.array(import_zod2.z.string())]) }),
  import_zod2.z.object({
    device: import_zod2.z.union([deviceTypeSchema, import_zod2.z.array(deviceTypeSchema)])
  }),
  LogicExpressionSchema
]);
function evaluateLogicExpression(expr, ctx) {
  const { dataModel } = ctx;
  if ("and" in expr) {
    return expr.and.every((subExpr) => evaluateLogicExpression(subExpr, ctx));
  }
  if ("or" in expr) {
    return expr.or.some((subExpr) => evaluateLogicExpression(subExpr, ctx));
  }
  if ("not" in expr) {
    return !evaluateLogicExpression(expr.not, ctx);
  }
  if ("path" in expr) {
    const value = resolveDynamicValue({ path: expr.path }, dataModel);
    return Boolean(value);
  }
  if ("eq" in expr) {
    const [left, right] = expr.eq;
    const leftValue = resolveDynamicValue(left, dataModel);
    const rightValue = resolveDynamicValue(right, dataModel);
    return leftValue === rightValue;
  }
  if ("neq" in expr) {
    const [left, right] = expr.neq;
    const leftValue = resolveDynamicValue(left, dataModel);
    const rightValue = resolveDynamicValue(right, dataModel);
    return leftValue !== rightValue;
  }
  if ("gt" in expr) {
    const [left, right] = expr.gt;
    const leftValue = resolveDynamicValue(
      left,
      dataModel
    );
    const rightValue = resolveDynamicValue(
      right,
      dataModel
    );
    if (typeof leftValue === "number" && typeof rightValue === "number") {
      return leftValue > rightValue;
    }
    return false;
  }
  if ("gte" in expr) {
    const [left, right] = expr.gte;
    const leftValue = resolveDynamicValue(
      left,
      dataModel
    );
    const rightValue = resolveDynamicValue(
      right,
      dataModel
    );
    if (typeof leftValue === "number" && typeof rightValue === "number") {
      return leftValue >= rightValue;
    }
    return false;
  }
  if ("lt" in expr) {
    const [left, right] = expr.lt;
    const leftValue = resolveDynamicValue(
      left,
      dataModel
    );
    const rightValue = resolveDynamicValue(
      right,
      dataModel
    );
    if (typeof leftValue === "number" && typeof rightValue === "number") {
      return leftValue < rightValue;
    }
    return false;
  }
  if ("lte" in expr) {
    const [left, right] = expr.lte;
    const leftValue = resolveDynamicValue(
      left,
      dataModel
    );
    const rightValue = resolveDynamicValue(
      right,
      dataModel
    );
    if (typeof leftValue === "number" && typeof rightValue === "number") {
      return leftValue <= rightValue;
    }
    return false;
  }
  return false;
}
function evaluateVisibility(condition, ctx) {
  if (condition === void 0) {
    return true;
  }
  if (typeof condition === "boolean") {
    return condition;
  }
  if ("path" in condition && !("and" in condition) && !("or" in condition)) {
    const value = resolveDynamicValue({ path: condition.path }, ctx.dataModel);
    return Boolean(value);
  }
  if ("auth" in condition) {
    const isSignedIn = ctx.authState?.isSignedIn ?? false;
    if (condition.auth === "signedIn") {
      return isSignedIn;
    }
    if (condition.auth === "signedOut") {
      return !isSignedIn;
    }
    return false;
  }
  if ("role" in condition) {
    const userRoles = ctx.authState?.roles ?? [];
    const requiredRoles = Array.isArray(condition.role) ? condition.role : [condition.role];
    return requiredRoles.some((role) => userRoles.includes(role));
  }
  if ("feature" in condition) {
    const enabledFeatures = ctx.featureFlags?.enabled ?? [];
    const requiredFeatures = Array.isArray(condition.feature) ? condition.feature : [condition.feature];
    return requiredFeatures.some((f) => enabledFeatures.includes(f));
  }
  if ("device" in condition) {
    const currentDevice = ctx.deviceState?.type ?? "desktop";
    const allowedDevices = Array.isArray(condition.device) ? condition.device : [condition.device];
    return allowedDevices.includes(currentDevice);
  }
  return evaluateLogicExpression(condition, ctx);
}
var visibility = {
  /** Always visible */
  always: true,
  /** Never visible */
  never: false,
  /** Visible when path is truthy */
  when: (path) => ({ path }),
  /** Visible when signed in */
  signedIn: { auth: "signedIn" },
  /** Visible when signed out */
  signedOut: { auth: "signedOut" },
  /** AND multiple conditions */
  and: (...conditions) => ({
    and: conditions
  }),
  /** OR multiple conditions */
  or: (...conditions) => ({
    or: conditions
  }),
  /** NOT a condition */
  not: (condition) => ({ not: condition }),
  /** Equality check */
  eq: (left, right) => ({
    eq: [left, right]
  }),
  /** Not equal check */
  neq: (left, right) => ({
    neq: [left, right]
  }),
  /** Greater than */
  gt: (left, right) => ({ gt: [left, right] }),
  /** Greater than or equal */
  gte: (left, right) => ({ gte: [left, right] }),
  /** Less than */
  lt: (left, right) => ({ lt: [left, right] }),
  /** Less than or equal */
  lte: (left, right) => ({ lte: [left, right] }),
  /** Visible for specific roles */
  hasRole: (role) => ({ role }),
  /** Visible when feature flag is enabled */
  hasFeature: (feature) => ({
    feature
  }),
  /** Visible on specific devices */
  onDevice: (device) => ({ device }),
  /** Visible only on mobile */
  mobileOnly: { device: "mobile" },
  /** Visible only on desktop */
  desktopOnly: { device: "desktop" }
};

// src/actions.ts
var import_zod3 = require("zod");
var ActionConfirmSchema = import_zod3.z.object({
  title: import_zod3.z.string(),
  message: import_zod3.z.string(),
  confirmLabel: import_zod3.z.string().optional(),
  cancelLabel: import_zod3.z.string().optional(),
  variant: import_zod3.z.enum(["default", "danger"]).optional()
});
var ActionOnSuccessSchema = import_zod3.z.union([
  import_zod3.z.object({ navigate: import_zod3.z.string() }),
  import_zod3.z.object({ set: import_zod3.z.record(import_zod3.z.string(), import_zod3.z.unknown()) }),
  import_zod3.z.object({ action: import_zod3.z.string() })
]);
var ActionOnErrorSchema = import_zod3.z.union([
  import_zod3.z.object({ set: import_zod3.z.record(import_zod3.z.string(), import_zod3.z.unknown()) }),
  import_zod3.z.object({ action: import_zod3.z.string() })
]);
var ActionRetryConfigSchema = import_zod3.z.object({
  maxAttempts: import_zod3.z.number().int().positive(),
  delayMs: import_zod3.z.number().int().positive().optional(),
  backoffMultiplier: import_zod3.z.number().positive().optional(),
  maxDelayMs: import_zod3.z.number().int().positive().optional()
});
var ActionOptimisticConfigSchema = import_zod3.z.object({
  path: import_zod3.z.string(),
  value: import_zod3.z.unknown(),
  revertOnError: import_zod3.z.boolean().optional()
});
var ActionSchema = import_zod3.z.object({
  name: import_zod3.z.string(),
  params: import_zod3.z.record(import_zod3.z.string(), DynamicValueSchema).optional(),
  confirm: ActionConfirmSchema.optional(),
  onSuccess: ActionOnSuccessSchema.optional(),
  onError: ActionOnErrorSchema.optional(),
  throttleMs: import_zod3.z.number().int().positive().optional(),
  debounceMs: import_zod3.z.number().int().positive().optional(),
  retry: ActionRetryConfigSchema.optional(),
  optimistic: ActionOptimisticConfigSchema.optional()
});
function resolveAction(action2, dataModel) {
  const resolvedParams = {};
  if (action2.params) {
    for (const [key, value] of Object.entries(action2.params)) {
      resolvedParams[key] = resolveDynamicValue(value, dataModel);
    }
  }
  let confirm = action2.confirm;
  if (confirm) {
    confirm = {
      ...confirm,
      message: interpolateString(confirm.message, dataModel),
      title: interpolateString(confirm.title, dataModel)
    };
  }
  return {
    name: action2.name,
    params: resolvedParams,
    confirm,
    onSuccess: action2.onSuccess,
    onError: action2.onError
  };
}
function interpolateString(template, dataModel) {
  return template.replace(/\$\{([^}]+)\}/g, (_, path) => {
    const value = resolveDynamicValue({ path }, dataModel);
    return String(value ?? "");
  });
}
async function executeAction(ctx) {
  const { action: action2, handler, setData, navigate, executeAction: executeAction2 } = ctx;
  try {
    await handler(action2.params);
    if (action2.onSuccess) {
      if ("navigate" in action2.onSuccess && navigate) {
        navigate(action2.onSuccess.navigate);
      } else if ("set" in action2.onSuccess) {
        for (const [path, value] of Object.entries(action2.onSuccess.set)) {
          setData(path, value);
        }
      } else if ("action" in action2.onSuccess && executeAction2) {
        await executeAction2(action2.onSuccess.action);
      }
    }
  } catch (error) {
    if (action2.onError) {
      if ("set" in action2.onError) {
        for (const [path, value] of Object.entries(action2.onError.set)) {
          const resolvedValue = typeof value === "string" && value === "$error.message" ? error.message : value;
          setData(path, resolvedValue);
        }
      } else if ("action" in action2.onError && executeAction2) {
        await executeAction2(action2.onError.action);
      }
    } else {
      throw error;
    }
  }
}
var action = {
  /** Create a simple action */
  simple: (name, params) => ({
    name,
    params
  }),
  /** Create an action with confirmation */
  withConfirm: (name, confirm, params) => ({
    name,
    params,
    confirm
  }),
  /** Create an action with success handler */
  withSuccess: (name, onSuccess, params) => ({
    name,
    params,
    onSuccess
  }),
  /** Create a throttled action (ignores calls during cooldown) */
  throttled: (name, throttleMs, params) => ({
    name,
    params,
    throttleMs
  }),
  /** Create a debounced action (delays execution, resets on new calls) */
  debounced: (name, debounceMs, params) => ({
    name,
    params,
    debounceMs
  }),
  /** Create an action with retry */
  withRetry: (name, retry, params) => ({
    name,
    params,
    retry
  }),
  /** Create an action with optimistic update */
  optimistic: (name, optimistic, params) => ({
    name,
    params,
    optimistic
  })
};

// src/validation.ts
var import_zod4 = require("zod");
var ValidationCheckSchema = import_zod4.z.object({
  fn: import_zod4.z.string(),
  args: import_zod4.z.record(import_zod4.z.string(), DynamicValueSchema).optional(),
  message: import_zod4.z.string(),
  when: LogicExpressionSchema.optional()
});
var ValidationConfigSchema = import_zod4.z.object({
  checks: import_zod4.z.array(ValidationCheckSchema).optional(),
  validateOn: import_zod4.z.enum(["change", "blur", "submit"]).optional(),
  enabled: LogicExpressionSchema.optional()
});
var builtInValidationFunctions = {
  /**
   * Check if value is not null, undefined, or empty string
   */
  required: (value) => {
    if (value === null || value === void 0) return false;
    if (typeof value === "string") return value.trim().length > 0;
    if (Array.isArray(value)) return value.length > 0;
    return true;
  },
  /**
   * Check if value is a valid email address
   */
  email: (value) => {
    if (typeof value !== "string") return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  },
  /**
   * Check minimum string length
   */
  minLength: (value, args) => {
    if (typeof value !== "string") return false;
    const min = args?.min;
    if (typeof min !== "number") return false;
    return value.length >= min;
  },
  /**
   * Check maximum string length
   */
  maxLength: (value, args) => {
    if (typeof value !== "string") return false;
    const max = args?.max;
    if (typeof max !== "number") return false;
    return value.length <= max;
  },
  /**
   * Check if string matches a regex pattern
   */
  pattern: (value, args) => {
    if (typeof value !== "string") return false;
    const pattern = args?.pattern;
    if (typeof pattern !== "string") return false;
    try {
      return new RegExp(pattern).test(value);
    } catch {
      return false;
    }
  },
  /**
   * Check minimum numeric value
   */
  min: (value, args) => {
    if (typeof value !== "number") return false;
    const min = args?.min;
    if (typeof min !== "number") return false;
    return value >= min;
  },
  /**
   * Check maximum numeric value
   */
  max: (value, args) => {
    if (typeof value !== "number") return false;
    const max = args?.max;
    if (typeof max !== "number") return false;
    return value <= max;
  },
  /**
   * Check if value is a number
   */
  numeric: (value) => {
    if (typeof value === "number") return !isNaN(value);
    if (typeof value === "string") return !isNaN(parseFloat(value));
    return false;
  },
  /**
   * Check if value is a valid URL
   */
  url: (value) => {
    if (typeof value !== "string") return false;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  /**
   * Check if value matches another field
   */
  matches: (value, args) => {
    const other = args?.other;
    return value === other;
  },
  /**
   * Check if value is a valid phone number (international format)
   */
  phone: (value) => {
    if (typeof value !== "string") return false;
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
    return phoneRegex.test(value) && value.replace(/\D/g, "").length >= 7;
  },
  /**
   * Check if value is a valid date string
   */
  date: (value, args) => {
    if (typeof value !== "string") return false;
    const date = new Date(value);
    if (isNaN(date.getTime())) return false;
    const format = args?.format;
    if (format === "iso") {
      return /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/.test(value);
    }
    return true;
  },
  /**
   * Check if date is in the future
   */
  futureDate: (value) => {
    if (typeof value !== "string") return false;
    const date = new Date(value);
    if (isNaN(date.getTime())) return false;
    return date > /* @__PURE__ */ new Date();
  },
  /**
   * Check if date is in the past
   */
  pastDate: (value) => {
    if (typeof value !== "string") return false;
    const date = new Date(value);
    if (isNaN(date.getTime())) return false;
    return date < /* @__PURE__ */ new Date();
  },
  /**
   * Check if value contains only alphanumeric characters
   */
  alphanumeric: (value) => {
    if (typeof value !== "string") return false;
    return /^[a-zA-Z0-9]+$/.test(value);
  },
  /**
   * Check if array has at least N items
   */
  minItems: (value, args) => {
    if (!Array.isArray(value)) return false;
    const min = args?.min;
    if (typeof min !== "number") return false;
    return value.length >= min;
  },
  /**
   * Check if array has at most N items
   */
  maxItems: (value, args) => {
    if (!Array.isArray(value)) return false;
    const max = args?.max;
    if (typeof max !== "number") return false;
    return value.length <= max;
  }
};
function runValidationCheck(check2, ctx) {
  const { value, dataModel, customFunctions } = ctx;
  if (check2.when) {
    const visibilityCtx = { dataModel };
    const shouldRun = evaluateLogicExpression(check2.when, visibilityCtx);
    if (!shouldRun) {
      return {
        fn: check2.fn,
        valid: true,
        // Skip this check when condition is false
        message: check2.message
      };
    }
  }
  const resolvedArgs = {};
  if (check2.args) {
    for (const [key, argValue] of Object.entries(check2.args)) {
      resolvedArgs[key] = resolveDynamicValue(argValue, dataModel);
    }
  }
  const fn = builtInValidationFunctions[check2.fn] ?? customFunctions?.[check2.fn];
  if (!fn) {
    console.warn(`Unknown validation function: ${check2.fn}`);
    return {
      fn: check2.fn,
      valid: true,
      // Don't fail on unknown functions
      message: check2.message
    };
  }
  const valid = fn(value, resolvedArgs);
  return {
    fn: check2.fn,
    valid,
    message: check2.message
  };
}
function runValidation(config, ctx) {
  const checks = [];
  const errors = [];
  if (config.enabled) {
    const enabled = evaluateLogicExpression(config.enabled, {
      dataModel: ctx.dataModel,
      authState: ctx.authState
    });
    if (!enabled) {
      return { valid: true, errors: [], checks: [] };
    }
  }
  if (config.checks) {
    for (const check2 of config.checks) {
      const result = runValidationCheck(check2, ctx);
      checks.push(result);
      if (!result.valid) {
        errors.push(result.message);
      }
    }
  }
  return {
    valid: errors.length === 0,
    errors,
    checks
  };
}
var check = {
  required: (message = "This field is required") => ({
    fn: "required",
    message
  }),
  email: (message = "Invalid email address") => ({
    fn: "email",
    message
  }),
  minLength: (min, message) => ({
    fn: "minLength",
    args: { min },
    message: message ?? `Must be at least ${min} characters`
  }),
  maxLength: (max, message) => ({
    fn: "maxLength",
    args: { max },
    message: message ?? `Must be at most ${max} characters`
  }),
  pattern: (pattern, message = "Invalid format") => ({
    fn: "pattern",
    args: { pattern },
    message
  }),
  min: (min, message) => ({
    fn: "min",
    args: { min },
    message: message ?? `Must be at least ${min}`
  }),
  max: (max, message) => ({
    fn: "max",
    args: { max },
    message: message ?? `Must be at most ${max}`
  }),
  url: (message = "Invalid URL") => ({
    fn: "url",
    message
  }),
  matches: (otherPath, message = "Fields must match") => ({
    fn: "matches",
    args: { other: { path: otherPath } },
    message
  }),
  phone: (message = "Invalid phone number") => ({
    fn: "phone",
    message
  }),
  date: (message = "Invalid date") => ({
    fn: "date",
    message
  }),
  isoDate: (message = "Must be ISO date format") => ({
    fn: "date",
    args: { format: "iso" },
    message
  }),
  futureDate: (message = "Must be a future date") => ({
    fn: "futureDate",
    message
  }),
  pastDate: (message = "Must be a past date") => ({
    fn: "pastDate",
    message
  }),
  alphanumeric: (message = "Must contain only letters and numbers") => ({
    fn: "alphanumeric",
    message
  }),
  minItems: (min, message) => ({
    fn: "minItems",
    args: { min },
    message: message ?? `Must have at least ${min} items`
  }),
  maxItems: (max, message) => ({
    fn: "maxItems",
    args: { max },
    message: message ?? `Must have at most ${max} items`
  }),
  /** Create a conditional check (only runs when condition is true) */
  when: (condition, check2) => ({
    ...check2,
    when: condition
  })
};

// src/catalog.ts
var import_zod5 = require("zod");
function createCatalog(config) {
  const {
    name = "unnamed",
    components,
    actions = {},
    functions = {},
    validation = "strict"
  } = config;
  const componentNames = Object.keys(components);
  const actionNames = Object.keys(actions);
  const functionNames = Object.keys(functions);
  const componentSchemas = componentNames.map((componentName) => {
    const def = components[componentName];
    return import_zod5.z.object({
      key: import_zod5.z.string(),
      type: import_zod5.z.literal(componentName),
      props: def.props,
      children: import_zod5.z.array(import_zod5.z.string()).optional(),
      parentKey: import_zod5.z.string().nullable().optional(),
      visible: VisibilityConditionSchema.optional()
    });
  });
  let elementSchema;
  if (componentSchemas.length === 0) {
    elementSchema = import_zod5.z.object({
      key: import_zod5.z.string(),
      type: import_zod5.z.string(),
      props: import_zod5.z.record(import_zod5.z.string(), import_zod5.z.unknown()),
      children: import_zod5.z.array(import_zod5.z.string()).optional(),
      parentKey: import_zod5.z.string().nullable().optional(),
      visible: VisibilityConditionSchema.optional()
    });
  } else if (componentSchemas.length === 1) {
    elementSchema = componentSchemas[0];
  } else {
    elementSchema = import_zod5.z.discriminatedUnion("type", [
      componentSchemas[0],
      componentSchemas[1],
      ...componentSchemas.slice(2)
    ]);
  }
  const treeSchema = import_zod5.z.object({
    root: import_zod5.z.string(),
    elements: import_zod5.z.record(import_zod5.z.string(), elementSchema)
  });
  return {
    name,
    componentNames,
    actionNames,
    functionNames,
    validation,
    components,
    actions,
    functions,
    elementSchema,
    treeSchema,
    hasComponent(type) {
      return type in components;
    },
    hasAction(name2) {
      return name2 in actions;
    },
    hasFunction(name2) {
      return name2 in functions;
    },
    validateElement(element) {
      const result = elementSchema.safeParse(element);
      if (result.success) {
        return { success: true, data: result.data };
      }
      return { success: false, error: result.error };
    },
    validateTree(tree) {
      const result = treeSchema.safeParse(tree);
      if (result.success) {
        return { success: true, data: result.data };
      }
      return { success: false, error: result.error };
    }
  };
}
function generateCatalogPrompt(catalog) {
  const lines = [
    `# ${catalog.name} Component Catalog`,
    "",
    "## Available Components",
    ""
  ];
  for (const name of catalog.componentNames) {
    const def = catalog.components[name];
    lines.push(`### ${String(name)}`);
    if (def.description) {
      lines.push(def.description);
    }
    lines.push("");
  }
  if (catalog.actionNames.length > 0) {
    lines.push("## Available Actions");
    lines.push("");
    for (const name of catalog.actionNames) {
      const def = catalog.actions[name];
      lines.push(
        `- \`${String(name)}\`${def.description ? `: ${def.description}` : ""}`
      );
    }
    lines.push("");
  }
  lines.push("## Visibility Conditions");
  lines.push("");
  lines.push("Components can have a `visible` property:");
  lines.push("- `true` / `false` - Always visible/hidden");
  lines.push('- `{ "path": "/data/path" }` - Visible when path is truthy');
  lines.push('- `{ "auth": "signedIn" }` - Visible when user is signed in');
  lines.push('- `{ "and": [...] }` - All conditions must be true');
  lines.push('- `{ "or": [...] }` - Any condition must be true');
  lines.push('- `{ "not": {...} }` - Negates a condition');
  lines.push('- `{ "eq": [a, b] }` - Equality check');
  lines.push("");
  lines.push("## Validation Functions");
  lines.push("");
  lines.push(
    "Built-in: `required`, `email`, `minLength`, `maxLength`, `pattern`, `min`, `max`, `url`"
  );
  if (catalog.functionNames.length > 0) {
    lines.push(`Custom: ${catalog.functionNames.map(String).join(", ")}`);
  }
  lines.push("");
  return lines.join("\n");
}

// src/component.ts
function defineComponent(config) {
  const {
    name,
    props,
    description,
    hasChildren = false,
    category,
    aiHints
  } = config;
  return {
    name,
    props,
    description,
    hasChildren,
    category,
    aiHints
  };
}
function toCatalogDefinition(definition) {
  return {
    props: definition.props,
    description: definition.description,
    hasChildren: definition.hasChildren
  };
}
function toCatalogDefinitions(definitions) {
  const result = {};
  for (const key of Object.keys(definitions)) {
    const def = definitions[key];
    if (def) {
      result[key] = {
        props: def.props,
        description: def.description,
        hasChildren: def.hasChildren
      };
    }
  }
  return result;
}
function createCatalogFromComponents(definitions, options = {}) {
  const catalogDefinitions = toCatalogDefinitions(definitions);
  const config = {
    name: options.name,
    components: catalogDefinitions,
    actions: options.actions,
    functions: options.functions,
    validation: options.validation
  };
  return createCatalog(config);
}

// src/prompt/schema-describer.ts
function describeZodSchema(schema) {
  const s = schema;
  if (s && typeof s === "object" && "shape" in s && s.shape) {
    const shape = s.shape;
    const parts = [];
    for (const [key, value] of Object.entries(shape)) {
      parts.push(`${key}: ${describeZodType(value)}`);
    }
    return `{ ${parts.join(", ")} }`;
  }
  return describeZodType(schema);
}
function describeZodType(schema) {
  if (!schema || typeof schema !== "object") return "unknown";
  const s = schema;
  const typeName = s._def ? s._def.typeName : void 0;
  if (typeName === "ZodOptional" && s._def) {
    const def = s._def;
    return `${describeZodType(def.innerType)}?`;
  }
  if (typeName === "ZodNullable" && s._def) {
    const def = s._def;
    return `${describeZodType(def.innerType)} | null`;
  }
  if (typeName === "ZodDefault" && s._def) {
    const def = s._def;
    return describeZodType(def.innerType);
  }
  if (typeName === "ZodString") return "string";
  if (typeName === "ZodNumber") return "number";
  if (typeName === "ZodBoolean") return "boolean";
  if (typeName === "ZodEnum" && s._def) {
    const def = s._def;
    const values = def.values;
    if (Array.isArray(values)) {
      return values.map((v) => `"${v}"`).join(" | ");
    }
  }
  if (typeName === "ZodLiteral" && s._def) {
    const def = s._def;
    const value = def.value;
    return typeof value === "string" ? `"${value}"` : String(value);
  }
  if (typeName === "ZodUnion" && s._def) {
    const def = s._def;
    const options = def.options;
    if (Array.isArray(options)) {
      return options.map(describeZodType).join(" | ");
    }
  }
  if (typeName === "ZodArray" && s._def) {
    const def = s._def;
    const elementType = describeZodType(def.type);
    return `[${elementType}]`;
  }
  if (typeName === "ZodObject" || "shape" in s && s.shape) {
    return describeZodSchema(schema);
  }
  return "unknown";
}

// src/prompt/rules-generator.ts
function generateStreamingStrategy() {
  return `
STREAMING STRATEGY:
1. Create containers (Stack, Grid, Card) with children:[] EMPTY
2. Add each child element as a separate operation
3. Append child key to parent via: {"op":"add","path":"/elements/PARENT/children/-","value":"CHILD_KEY"}
4. For data props (items, rows, documents), use "replace" to set full content after element creation
5. Prefer multiple small patches for responsive UI updates
6. Use short, descriptive keys (e.g., "revenue-metric", "user-table")

NEVER DO THIS (pre-populated children):
{"op":"add","path":"/elements/grid","value":{"key":"grid","type":"Grid","children":["a","b","c"]}}

ALWAYS DO THIS (empty children, then append):
{"op":"add","path":"/elements/grid","value":{"key":"grid","type":"Grid","children":[]}}
{"op":"add","path":"/elements/a","value":{...}}
{"op":"add","path":"/elements/grid/children/-","value":"a"}`;
}
function generateLayoutRules() {
  return `
LAYOUT RULES:
- ALWAYS use Stack or Grid as root container when generating multiple components
- Stack: Set gap prop for vertical spacing (e.g., "gap": "lg" or "gap": "md")
- Grid: Set gap prop for both row/column spacing
- Available gap values: "none", "xs", "sm", "md", "lg", "xl", "2xl"
- RECOMMENDED: Use "gap": "lg" for main layouts, "gap": "md" for nested content
- Single components may omit container, but prefer Card wrapper for visual consistency`;
}
function generateMessageRules() {
  return `
MESSAGE RULES:
- ALWAYS begin your response with a 'message' operation to explain what you are building.
- Use 'message' operations to provide context, ask for feedback, or explain design decisions.
- Do NOT treat messages and UI patches as mutually exclusive; use BOTH.
- Example:
  {"op":"message","role":"assistant","content":"I'm creating a dashboard with charts and metrics."}
  {"op":"set","path":"/root","value":"dashboard"}

MESSAGE CONTENT RULES:
- Messages should be CONVERSATIONAL and HELPFUL
- Messages provide context, reasoning, and high-level summaries
- NEVER include URLs, links, or deep links in messages - put them in component props instead
- NEVER include raw JSON, JSONL operations, or technical code in messages
- NEVER include markdown tables or data dumps - use UI components to display structured data
- NEVER echo back the JSONL patches as text - the user sees the rendered components
- If a component has a prop for links (e.g., bookingUrl, href, url), use THAT prop, not the message`;
}
function generateSelectionRules() {
  return `
SELECTION CONTEXT BEHAVIOR:

When SELECTED ELEMENT CONTEXT is present in the prompt, you must reason about what the user wants.

REASONING PROCESS:
1. Read the user's request carefully - understand the semantic meaning
2. Examine the selected element - its type, current content, structure, purpose
3. Think: "What would best serve the user given this element and this request?"
4. Decide your approach based on your reasoning

You have FULL AUTONOMY to:
- MODIFY the selected element (change props, update content, fix issues)
- ADD new content (siblings, children, or related components)  
- DO BOTH if the request naturally calls for it

There are NO rigid keyword rules. Each situation is unique. Use your understanding of:
- What the element currently contains
- What the user is trying to achieve  
- What would create the best user experience`;
}
function generateOutputFormat() {
  return `
OUTPUT FORMAT:
Output JSONL where each line is a patch operation. Use a FLAT key-based structure:

OPERATIONS:
- {"op":"set","path":"/root","value":"main-stack"} - Set the root element key
- {"op":"add","path":"/elements/main-stack","value":{...}} - Add an element by unique key
- {"op":"add","path":"/elements/parent/children/-","value":"child-key"} - Append child to parent
- {"op":"replace","path":"/elements/key/props/data","value":[...]} - Update element data
- {"op":"message","role":"assistant","content":"..."} - Send a conversational message

ELEMENT STRUCTURE:
{
  "key": "unique-key",
  "type": "ComponentType",
  "props": { ... },
  "children": []  // Start empty, add children via /children/- operations
}

CRITICAL STREAMING ORDER:
1. FIRST: {"op":"message"} - Explain what you're building
2. SECOND: {"op":"set","path":"/root","value":"root-key"}
3. THIRD: {"op":"add","path":"/elements/root-key","value":{...with empty children}}
4. THEN: Add child elements and append to parent's children array

CORRECT EXAMPLE - Creating Grid with 3 Metrics:
{"op":"message","role":"assistant","content":"Creating your financial dashboard..."}
{"op":"set","path":"/root","value":"main-stack"}
{"op":"add","path":"/elements/main-stack","value":{"key":"main-stack","type":"Stack","props":{"gap":"lg"},"children":[]}}
{"op":"add","path":"/elements/metrics-grid","value":{"key":"metrics-grid","type":"Grid","props":{"columns":3,"gap":"md"},"children":[]}}
{"op":"add","path":"/elements/main-stack/children/-","value":"metrics-grid"}
{"op":"add","path":"/elements/metric-1","value":{"key":"metric-1","type":"Metric","props":{"label":"Revenue","value":50000,"format":"currency"}}}
{"op":"add","path":"/elements/metrics-grid/children/-","value":"metric-1"}
{"op":"add","path":"/elements/metric-2","value":{"key":"metric-2","type":"Metric","props":{"label":"Users","value":1200}}}
{"op":"add","path":"/elements/metrics-grid/children/-","value":"metric-2"}
{"op":"add","path":"/elements/metric-3","value":{"key":"metric-3","type":"Metric","props":{"label":"Growth","value":0.15,"format":"percent","trend":"up"}}}
{"op":"add","path":"/elements/metrics-grid/children/-","value":"metric-3"}

RULES:
1. ALWAYS start children:[] empty, then append via /children/-
2. NEVER pre-populate children array with keys in the initial add
3. Add element BEFORE appending it to parent's children
4. Each element must have: key, type, props (children optional)
5. Do NOT wrap output in markdown code fences
6. Output ONLY JSONL lines (one JSON object per line)

RICH CONTENT PATTERN (for Document, Table, etc.):
Stream structure first, then populate with full content:
{"op":"add","path":"/elements/doc","value":{"key":"doc","type":"Document","props":{"title":"Report"},"children":[]}}
{"op":"add","path":"/elements/main-stack/children/-","value":"doc"}
{"op":"replace","path":"/elements/doc/props/documents","value":[{"title":"Section","sections":[{"title":"Details","content":"Full detailed content here with multiple paragraphs..."}]}]}

NEVER create empty Documents/Tables - ALWAYS populate content immediately after creation.`;
}

// src/prompt/interactive-rules.ts
function generateInteractiveRules(preferForm) {
  return `
INTERACTIVE AI BEHAVIOR:

You are a proactive, intelligent assistant. NEVER invent or assume data that you don't have.

===============================================================================
CRITICAL DECISION FRAMEWORK: WHEN TO ASK vs WHEN TO GENERATE
===============================================================================

STEP 1 - ANALYZE THE REQUEST:
Before generating ANY UI, evaluate the user's request:

 IS THE REQUEST VAGUE?
- "Create a chart" -> VAGUE (what data? what type? what labels?)
- "Create a bar chart showing monthly sales for Q1 2024" -> SPECIFIC (has context)
- "Make a mind map" -> VAGUE (what topic? what structure?)
- "Create a mind map of React component lifecycle" -> SPECIFIC

 IS CRITICAL DATA MISSING?
Components that REQUIRE data arrays - NEVER generate with empty/fake data:
- MindMap -> requires "nodes" array with {id, label, children?} structure
- Graph -> requires "nodes" and "edges" arrays
- Chart/BarChart/LineChart/PieChart -> requires "data" array with values
- Table -> requires "columns" and "rows" arrays
- TodoList -> requires "items" array (or can start empty if creating new)
- Kanban -> requires "columns" with "items" arrays
- Timeline -> requires "events" array
- Calendar -> requires "events" array
- TreeView -> requires "nodes" array with recursive structure

 IS DOMAIN-SPECIFIC INFO NEEDED?
- Workout plans -> need exercises, sets, reps, muscle groups
- Meal plans -> need meals, ingredients, calories, dietary restrictions
- Schedules -> need dates, times, activities
- Financial -> need amounts, categories, time periods

STEP 2 - DECIDE YOUR APPROACH:

+-----------------------------------------------------------------------------+
| IF request is vague OR data is missing OR domain info needed:               |
|   -> ASK FIRST using 'question' operation                                   |
|   -> DO NOT generate UI with placeholder/fake data                          |
|   -> DO NOT assume what the user wants                                      |
+-----------------------------------------------------------------------------+
| IF request is specific AND has all required info:                           |
|   -> GENERATE the UI directly                                               |
|   -> Use ONLY the data provided by the user                                 |
+-----------------------------------------------------------------------------+

===============================================================================
FORMAT SELECTION: WHEN TO USE FORM UI vs TEXT CHAT
===============================================================================

USE FORM UI ({"op":"question","question":{"type":"form",...}}) WHEN:
- Collecting MULTIPLE related fields (3+ pieces of info)
- Need STRUCTURED options (select, radio, checkbox)
- Collecting DATES or NUMBERS with validation
- Building a CONFIGURATION or SETTINGS
- Need to collect DATA for arrays (items, rows, nodes)

Examples requiring FORM UI:
- "Create a workout" -> form with: exercise name, sets, reps, muscle group
- "Add calendar event" -> form with: title, date, time, duration, description
- "Create a chart" -> form with: chart type, data source, labels, values

USE TEXT CHAT (plain message or {"op":"question","question":{"type":"text"}}) WHEN:
- Asking a SINGLE clarifying question
- Yes/No or simple CONFIRMATION
- FREE-FORM creative input (topic ideas, descriptions)
- User PREFERENCE without structure
- Quick DISAMBIGUATION between 2-3 options

Examples for TEXT CHAT:
- "What topic should the mind map cover?"
- "Would you like me to add more detail to this section?"
- "Should I use a light or dark theme?"
- "Is this the format you wanted?"

${preferForm ? `CURRENT PREFERENCE: Forms are preferred for data collection.
When in doubt between form and text, USE A FORM.` : `CURRENT PREFERENCE: Text questions are preferred for simplicity.
When in doubt between form and text, USE A TEXT QUESTION.`}

USE QUICK-REPLY ({"op":"question","question":{"type":"quick-reply",...}}) WHEN:
- Offering 2-5 PREDEFINED choices
- Simple decisions or preferences
- Yes/No/Maybe type questions
- Selecting from a short list of options
- When speed of response matters

Examples for QUICK-REPLY:
- "Which format?" with options: [PDF, Excel, CSV]
- "How should I proceed?" with options: [Continue, Start over, Cancel]
- "Include details?" with options: [Yes, detailed | No, summary only]

IMPORTANT: Always set "allowCustom": true when user might want an option not listed.

===============================================================================
QUESTION OPERATION SYNTAX
===============================================================================

1. FORM QUESTION (for structured data collection):
{"op":"question","question":{"id":"q1","text":"I need details to create your [component]","type":"form","fields":[
  {"id":"field1","label":"Field Label","type":"select","options":[{"value":"opt1","label":"Option 1"},{"value":"opt2","label":"Option 2"}],"allowCustom":true},
  {"id":"field2","label":"Another Field","type":"number","placeholder":"Enter a number"},
  {"id":"field3","label":"Description","type":"textarea","placeholder":"Enter description"}
],"required":true}}

2. QUICK-REPLY QUESTION (for simple choices):
{"op":"question","question":{"id":"q1","text":"How would you like to proceed?","type":"quick-reply","options":[
  {"id":"opt1","label":"Continue with details","value":"detailed","variant":"primary"},
  {"id":"opt2","label":"Keep it simple","value":"simple","variant":"default"},
  {"id":"opt3","label":"Start over","value":"restart","variant":"danger"}
],"allowCustom":true}}

3. TEXT QUESTION (for open-ended clarification):
{"op":"question","question":{"id":"q1","text":"What topic would you like the mind map to cover?","type":"text","required":true}}

FORM FIELD TYPES:
- "text": Single line text input
- "textarea": Multi-line text input  
- "number": Numeric input with optional min/max validation
- "select": Dropdown with options array [{value, label}] - add "allowCustom":true for "Other" option
- "checkbox": Boolean toggle
- "radio": Single selection from options [{value, label}] - add "allowCustom":true for "Other" option
- "date": Date picker

QUICK-REPLY VARIANTS:
- "default": Neutral option
- "primary": Recommended/main option
- "success": Positive action
- "danger": Destructive or warning action

===============================================================================
RESPONSE TYPE DECISION GUIDE
===============================================================================

ASK YOURSELF: What type of response will best serve the user?

| Situation                          | Best Response Type     |
|------------------------------------|------------------------|
| Explaining something               | Plain text MESSAGE     |
| 2-5 simple choices                 | QUICK-REPLY question   |
| Collecting multiple data points    | FORM question          |
| Open-ended creative input needed   | TEXT question          |
| Generating UI as requested         | UI patches             |
| Confirming an action               | QUICK-REPLY (Yes/No)   |
| Providing follow-up options        | SUGGESTIONS            |

WHEN TO USE PLAIN TEXT MESSAGE INSTEAD OF QUESTIONS:
- When explaining or teaching something
- When providing information or status
- When the user just needs an answer, not a choice
- When confirming you understood the request
- When expressing that you cannot do something

Example of plain text response:
{"op":"message","role":"assistant","content":"I've updated the chart with the new data. The total now shows 1,234 items across all categories."}

===============================================================================
HANDLING PREVIOUSLY COLLECTED DATA
===============================================================================

When the user responds to a question, you may receive "PREVIOUSLY COLLECTED USER DATA" 
in the prompt. This contains information the user has already provided.

CRITICAL RULES:
1. **NEVER re-ask for data that appears in PREVIOUSLY COLLECTED USER DATA**
2. If you need additional information, ONLY ask for what is MISSING
3. Use the collected data directly when generating UI components
4. If a form has 5 fields and 3 are already collected, only show a form with the 2 missing fields

Example - If previously collected data shows:
{"destination": "Rome", "travelers": 2}

And you need: destination, travelers, dates, budget
-> ONLY ask for: dates, budget (NOT destination or travelers!)

For forms, use defaultValue to pre-populate known fields:
{"op":"question","question":{"type":"form","fields":[
  {"id":"dates","label":"Travel dates","type":"date"},
  {"id":"budget","label":"Budget","type":"number"}
]}}

===============================================================================
STRICT RULES - VIOLATIONS ARE UNACCEPTABLE
===============================================================================

1. NEVER generate placeholder data:
   - NO "Lorem ipsum", "Sample text", "Example item"
   - NO "Foo", "Bar", "Test", "Item 1", "Item 2"
   - NO fake dates, numbers, or names
   - NO empty arrays when data is required for the component to function

2. ALWAYS ask before generating when:
   - User request is ambiguous or vague
   - Component requires data arrays and none provided
   - Domain-specific knowledge is needed
   - You would need to invent/assume information

3. NEVER make assumptions about:
   - What data the user wants to display
   - The structure or hierarchy of their data
   - Domain-specific values (exercises, meals, prices, etc.)
   - User preferences not explicitly stated

4. When generating UI with user-provided data:
   - Use EXACTLY the data given, nothing more
   - Structure it correctly for the component
   - If data seems incomplete, ASK for clarification

5. NEVER ask for data already provided:
   - Check PREVIOUSLY COLLECTED USER DATA before asking questions
   - Pre-populate forms with known values using defaultValue
   - Only prompt for truly missing information

===============================================================================
PROVIDING SUGGESTIONS
===============================================================================

After completing a response, suggest 2-4 relevant follow-up actions:
{"op":"suggestion","suggestions":[
  {"id":"s1","label":"Add more details","prompt":"Add more details to this component","variant":"default"},
  {"id":"s2","label":"Create related view","prompt":"Create a related component that shows additional data","variant":"primary"},
  {"id":"s3","label":"Export data","prompt":"Add an export functionality","variant":"success"}
]}

SUGGESTION RULES:
1. Suggestions should be contextually relevant to what was just created/modified
2. Use short, action-oriented labels (2-5 words)
3. Include the full prompt that would be sent if user clicks
4. Use variants: "default", "primary" (recommended), "success", "warning"
5. Limit to 4 suggestions maximum`;
}
function generateProactivityRules() {
  return `
PROACTIVE BEHAVIOR:

When RECENT USER ACTIONS context is provided, you should be proactively helpful.

===============================================================================
CONTEXTUAL AWARENESS FRAMEWORK
===============================================================================

1. UNDERSTAND THE ACTION:
   - What component did the user interact with?
   - What specific action did they perform?
   - What data/context is available from the action?

2. INFER THE DOMAIN:
   - Component type reveals the domain (e.g., Workout = fitness, TodoList = tasks)
   - Adapt your language and suggestions to match the domain
   - DO NOT assume cross-domain knowledge

3. PROVIDE INTELLIGENT FOLLOW-UP:
   - Ask relevant questions based on action and component context
   - Suggest logical next steps
   - Offer to enhance or expand on the action

===============================================================================
ACTION TYPE RESPONSES
===============================================================================

- "complete" action -> Ask for feedback, notes, or rating about completed item
- "toggle" action -> Acknowledge change, offer to undo or elaborate
- "input" action -> Validate input, suggest related fields, confirm values
- "create" action -> Suggest enhancements, related items, or next steps
- "delete" action -> Confirm deletion, offer to restore or create replacement
- "update" action -> Acknowledge update, suggest further refinements
- "select" action -> Provide details about selection, offer actions on item
- "expand" action -> Offer to add more detail to expanded content
- "collapse" action -> Summarize or offer alternative views

===============================================================================
HANDLING INCOMPLETE DATA IN PROACTIVE RESPONSES
===============================================================================

When responding proactively, you may encounter components with incomplete data.

RULES FOR INCOMPLETE DATA:
1. DO NOT modify existing data unless explicitly asked
2. If you need to ADD items, ASK for the data first
3. If context from action is insufficient, ASK for clarification
4. NEVER fill in missing data with assumptions or placeholders

EXAMPLE - User completes a task in TodoList:
- CORRECT: "You completed [task name]. Would you like to add notes about how it went?"
- WRONG: "You completed [task name]. I'll add some follow-up tasks for you." (assumes what tasks)

EXAMPLE - User adds item to empty Kanban:
- CORRECT: "You added [item]. What other items would you like in this column?"
- WRONG: "You added [item]. I'll populate the board with related items." (invents data)

===============================================================================
PROACTIVE RESPONSE FORMAT
===============================================================================

Start with a contextual message acknowledging the action:
{"op":"message","role":"assistant","content":"I noticed you [action] on [element]. Would you like to...?"}

Then, if additional info is needed, ask a focused question:
{"op":"question","question":{"id":"feedback","text":"","type":"form","fields":[
  {"id":"response","label":"Your feedback","type":"text"}
]}}

Or suggest relevant follow-up actions:
{"op":"suggestion","suggestions":[
  {"id":"s1","label":"Add details","prompt":"Add more details to this item","variant":"default"}
]}

===============================================================================
PROACTIVITY RULES
===============================================================================

1. Be helpful but not intrusive - one follow-up per action batch
2. Infer question relevance from the component type and action context
3. Keep questions brief and easy to answer
4. Respect when user ignores follow-up (don't re-ask)
5. Use the component's props schema to understand what data is relevant
6. NEVER auto-generate additional data based on user actions
7. ALWAYS ask before expanding, adding, or modifying data`;
}

// src/prompt/context-prompts.ts
function generateTreeContextPrompt(tree, options) {
  const prunedNote = options?.isPruned ? `
NOTE: This is a PRUNED tree showing only elements relevant to current context.
Total elements in full tree: ${options.totalElements ?? "unknown"}
Only the shown elements can be modified. To access other elements, the user must select them first.` : "";
  return `
CURRENT UI STATE (JSON TREE):
${JSON.stringify(tree, null, 2)}${prunedNote}

IMPORTANT:
1. DO NOT create a new root container if one already exists. Reuse the existing root.
2. DO NOT wrap the existing content in a new Card/Stack/Grid. Just add new elements to the existing root's children.
3. Reuse existing keys for elements that shouldn't change.
4. To ADD an element:
   - Output {"op":"add", "path":"/elements/NEW_KEY", "value":{...}}
   - Output {"op":"ensure", "path":"/elements/PARENT_KEY", "value":{parent element}} (CRITICAL: ensures parent exists!)
   - Output {"op":"add", "path":"/elements/PARENT_KEY/children/-", "value":"NEW_KEY"}
5. To REMOVE an element:
   - Output {"op":"remove", "path":"/elements/KEY_TO_REMOVE"}
   - Output {"op":"remove", "path":"/elements/PARENT_KEY/children/INDEX_OF_KEY"}
6. To UPDATE an element:
   - Output {"op":"replace", "path":"/elements/KEY/props/PROPERTY", "value":"NEW_VALUE"}
7. To UPDATE LAYOUT (size, grid position):
   - Output {"op":"replace", "path":"/elements/KEY/layout/size/width", "value":300}
   - Output {"op":"replace", "path":"/elements/KEY/layout/grid/columnSpan", "value":2}
   - Output {"op":"replace", "path":"/elements/KEY/layout/resizable", "value":true}

CRITICAL: ALWAYS use {"op":"ensure"} BEFORE adding to a parent's children. This prevents errors if parent doesn't exist.
DO NOT re-output the entire tree unless requested to reset/clear. Work incrementally.`;
}
function generateSelectionContextPrompt(selection, hasSubItems) {
  let prompt = `
SELECTED ELEMENT CONTEXT:
${JSON.stringify(selection, null, 2)}

EDITING RULES:`;
  if (hasSubItems) {
    prompt += `
The user has selected specific items within this component.
Selected item IDs: ${JSON.stringify(selection.subItems)}

Focus your response on these selected items:
- Use "replace" operations to update their properties
- Find each item's index by matching its "id" in the element's data array
- Example: {"op":"replace","path":"/elements/${selection.key}/props/items/INDEX/description","value":"Updated content"}`;
  } else {
    prompt += `
- Apply the smallest possible patch that satisfies the user request.
- Prefer updates inside the selected element's props or its list data.
- You may modify the selected element's children if needed.
- Only edit parent/layout elements if the change explicitly requires it.`;
  }
  return prompt;
}
function generateDeepSelectionPrompt(deepSelections) {
  const selectionSummary = deepSelections.map((s) => {
    const preview = s.textContent.length > 60 ? s.textContent.substring(0, 60) + "..." : s.textContent;
    return `- "${preview}" (${s.selectionType}, itemId: ${s.itemId || "none"}, element: ${s.elementKey || "unknown"})`;
  }).join("\n");
  return `
CRITICAL: USER HAS SELECTED SPECIFIC ELEMENTS
The user explicitly selected these ${deepSelections.length} item(s):
${selectionSummary}

FULL SELECTION DATA:
${JSON.stringify(deepSelections, null, 2)}

STRICT RULES FOR SELECTED ELEMENTS:
1. ONLY modify the items that the user selected - DO NOT touch any other items
2. If user asks to "expand" or "elaborate", ONLY expand the selected items
3. If user asks to "change" something, ONLY change the selected items
4. Find each selected item by matching its itemId or textContent in the component's data
5. Use "replace" operations targeting the specific array index of each selected item
6. Other items in the same component must remain EXACTLY as they are
7. You may modify the LAYOUT (size, position) of selected elements if relevant to the request`;
}
function generateTextSelectionPrompt(textSelection) {
  const componentInfo = textSelection.elementKey ? `
This text is from component: ${textSelection.elementKey}${textSelection.elementType ? ` (${textSelection.elementType})` : ""}` : "";
  return `
USER HAS HIGHLIGHTED/SELECTED TEXT:
"${textSelection.text}"${componentInfo}

The user has explicitly selected this text. Their message likely refers to it.
Possible intents:
- Ask questions about this specific text
- Request modifications or expansion of this content
- Use it as context for their question
- Quote it in a new component

Consider this selected text as the PRIMARY FOCUS of the user's request.`;
}
function generateLayoutContextPrompt(layouts) {
  if (layouts.length === 0) return "";
  const layoutSummary = layouts.map((l) => {
    const parts = [`- ${l.elementKey} (${l.elementType})`];
    if (l.size?.width || l.size?.height) {
      parts.push(
        `size: ${l.size.width ?? "auto"} x ${l.size.height ?? "auto"}`
      );
    }
    if (l.grid?.column || l.grid?.row) {
      parts.push(
        `grid: col ${l.grid.column ?? "auto"}, row ${l.grid.row ?? "auto"}`
      );
    }
    if (l.grid?.columnSpan && l.grid.columnSpan > 1) {
      parts.push(`span: ${l.grid.columnSpan} cols`);
    }
    if (l.resizable) {
      parts.push("(resizable)");
    }
    return parts.join(" | ");
  }).join("\n");
  return `
LAYOUT CONTEXT:
The following elements have explicit layout configurations:
${layoutSummary}

LAYOUT OPERATIONS:
- To RESIZE an element:
  {"op":"replace","path":"/elements/KEY/layout/size","value":{"width":400,"height":300}}
- To REPOSITION in grid:
  {"op":"replace","path":"/elements/KEY/layout/grid","value":{"column":1,"columnSpan":6}}
- To ENABLE resize handles:
  {"op":"replace","path":"/elements/KEY/layout/resizable","value":true}
- To SET full layout at once:
  {"op":"replace","path":"/elements/KEY/layout","value":{"size":{"width":500},"grid":{"columnSpan":4},"resizable":true}}

When the user mentions size, width, height, position, columns, or layout, use these operations.`;
}
function generateActionsContextPrompt(actions) {
  if (actions.length === 0) return "";
  const formatted = actions.map((action2) => {
    const parts = [`- ${action2.type} on ${action2.elementType}`];
    if (action2.context?.itemLabel) {
      parts.push(`"${action2.context.itemLabel}"`);
    }
    if (action2.context?.previousValue !== void 0 && action2.context?.newValue !== void 0) {
      parts.push(
        `(${action2.context.previousValue} -> ${action2.context.newValue})`
      );
    }
    return parts.join(" ");
  });
  const lastAction = actions[actions.length - 1];
  if (!lastAction) return "";
  return `
RECENT USER ACTIONS:
${formatted.join("\n")}

LAST ACTION DETAILS:
${JSON.stringify(lastAction, null, 2)}

PROACTIVE INSTRUCTION:
The user just performed the action above. Analyze:
1. The ELEMENT TYPE (${lastAction.elementType}) - what kind of component is this?
2. The ACTION TYPE (${lastAction.type}) - what did the user do?
3. The CONTEXT - any item labels, values, or indices involved?

Based on this analysis, provide a contextual, helpful follow-up that:
- Is relevant to the component type and its purpose
- Acknowledges the specific action taken
- Offers useful next steps or asks for relevant information
- Does NOT assume domain-specific knowledge (e.g., don't assume workout if it's a TodoList)

Your response should feel natural and helpful, adapting to whatever domain the component represents.`;
}

// src/prompt-generator.ts
function generateComponentDoc(name, definition) {
  const propsDesc = describeZodSchema(definition.props);
  const desc = definition.description || "";
  const children = definition.hasChildren ? " (supports children)" : "";
  return `- ${name}: ${propsDesc}${children}${desc ? ` - ${desc}` : ""}`;
}
function generateSystemPrompt(catalog, config = {}) {
  const {
    introText = "You are a dashboard widget generator that outputs JSONL (JSON Lines) patches.",
    includeStreamingStrategy = true,
    includeSelectionRules = true,
    includeMessageRules = true,
    includeLayoutRules = true,
    includeInteractiveRules = true,
    includeProactivityRules = true,
    dataCollectionPreferForm = true,
    componentRules = {},
    skills = {},
    extraSections = [],
    outroText = "Generate JSONL patches now:"
  } = config;
  const lines = [introText, ""];
  lines.push("AVAILABLE COMPONENTS:");
  lines.push(catalog.componentNames.map(String).join(", "));
  lines.push("");
  lines.push("COMPONENT DETAILS:");
  for (const name of catalog.componentNames) {
    const def = catalog.components[name];
    if (def) {
      lines.push(generateComponentDoc(String(name), def));
    }
  }
  lines.push("");
  const skillsWithContent = Object.entries(skills).filter(
    ([, content]) => content && content.trim()
  );
  if (skillsWithContent.length > 0) {
    lines.push("COMPONENT AI HINTS:");
    for (const [name, content] of skillsWithContent) {
      lines.push(`
### ${name}`);
      lines.push(content.trim());
    }
    lines.push("");
  }
  lines.push(generateOutputFormat());
  if (includeLayoutRules) {
    lines.push(generateLayoutRules());
  }
  if (includeStreamingStrategy) {
    lines.push(generateStreamingStrategy());
  }
  if (includeMessageRules) {
    lines.push(generateMessageRules());
  }
  if (includeSelectionRules) {
    lines.push(generateSelectionRules());
  }
  if (includeInteractiveRules) {
    lines.push(generateInteractiveRules(dataCollectionPreferForm));
  }
  if (includeProactivityRules) {
    lines.push(generateProactivityRules());
  }
  const rulesEntries = Object.entries(componentRules);
  if (rulesEntries.length > 0) {
    lines.push("");
    lines.push("COMPONENT SELECTION RULES:");
    for (const [component, rule] of rulesEntries) {
      lines.push(`- ALWAYS use '${component}' ${rule}`);
    }
  }
  if (extraSections.length > 0) {
    lines.push("");
    lines.push(...extraSections);
  }
  lines.push("");
  lines.push(outroText);
  return lines.join("\n");
}

// src/streaming/schemas.ts
var import_zod6 = require("zod");
var UIElementMetaSchema = import_zod6.z.object({
  turnId: import_zod6.z.string().describe("Unique ID for the AI turn that created this"),
  sequence: import_zod6.z.number().int().nonnegative().describe("Sequence number within turn"),
  createdAt: import_zod6.z.number().describe("Unix timestamp of creation"),
  updatedAt: import_zod6.z.number().optional().describe("Unix timestamp of last update")
});
var StreamPatchSchema = import_zod6.z.object({
  op: import_zod6.z.enum(["add", "replace", "remove", "move", "copy", "test"]),
  path: import_zod6.z.string().regex(/^\//, "Path must start with /"),
  value: import_zod6.z.unknown().optional(),
  from: import_zod6.z.string().optional()
});
var PatchMessageSchema = import_zod6.z.object({
  type: import_zod6.z.literal("patch"),
  patches: import_zod6.z.array(StreamPatchSchema),
  targetPath: import_zod6.z.string().optional()
});
var ChatMessageSchema = import_zod6.z.object({
  type: import_zod6.z.literal("message"),
  role: import_zod6.z.enum(["user", "assistant", "system"]),
  content: import_zod6.z.string(),
  id: import_zod6.z.string().optional()
});
var QuestionMessageSchema = import_zod6.z.object({
  type: import_zod6.z.literal("question"),
  questionId: import_zod6.z.string(),
  prompt: import_zod6.z.string(),
  options: import_zod6.z.array(
    import_zod6.z.object({
      label: import_zod6.z.string(),
      value: import_zod6.z.string()
    })
  ).optional(),
  inputType: import_zod6.z.enum(["text", "select", "multiselect", "number", "date"]).optional(),
  required: import_zod6.z.boolean().optional()
});
var SuggestionMessageSchema = import_zod6.z.object({
  type: import_zod6.z.literal("suggestion"),
  suggestions: import_zod6.z.array(
    import_zod6.z.object({
      id: import_zod6.z.string(),
      label: import_zod6.z.string(),
      action: import_zod6.z.string().optional()
    })
  )
});
var ToolProgressMessageSchema = import_zod6.z.object({
  type: import_zod6.z.literal("tool-progress"),
  toolId: import_zod6.z.string(),
  toolName: import_zod6.z.string(),
  status: import_zod6.z.enum(["pending", "running", "complete", "error"]),
  progress: import_zod6.z.number().min(0).max(100).optional(),
  message: import_zod6.z.string().optional(),
  result: import_zod6.z.unknown().optional()
});
var StreamControlSchema = import_zod6.z.object({
  type: import_zod6.z.literal("control"),
  action: import_zod6.z.enum(["start", "end", "error", "abort"]),
  error: import_zod6.z.object({
    code: import_zod6.z.string(),
    message: import_zod6.z.string(),
    recoverable: import_zod6.z.boolean()
  }).optional()
});
var StreamMessageSchema = import_zod6.z.discriminatedUnion("type", [
  PatchMessageSchema,
  ChatMessageSchema,
  QuestionMessageSchema,
  SuggestionMessageSchema,
  ToolProgressMessageSchema,
  StreamControlSchema
]);
var StreamFrameSchema = import_zod6.z.object({
  version: import_zod6.z.literal("2.0").describe("Protocol version"),
  timestamp: import_zod6.z.number().describe("Unix timestamp"),
  correlationId: import_zod6.z.string().uuid().describe("Request correlation ID"),
  sequence: import_zod6.z.number().int().nonnegative().describe("Frame sequence number"),
  message: StreamMessageSchema
});
var UIElementBaseSchema = import_zod6.z.object({
  key: import_zod6.z.string().describe("Unique element key (REQUIRED)"),
  type: import_zod6.z.string().describe("Component type from catalog (REQUIRED)"),
  props: import_zod6.z.record(import_zod6.z.string(), import_zod6.z.unknown()).describe("Component props (REQUIRED)"),
  parentKey: import_zod6.z.string().optional(),
  layout: import_zod6.z.object({
    grid: import_zod6.z.object({
      column: import_zod6.z.number().optional(),
      row: import_zod6.z.number().optional(),
      columnSpan: import_zod6.z.number().optional(),
      rowSpan: import_zod6.z.number().optional()
    }).optional(),
    size: import_zod6.z.object({
      width: import_zod6.z.union([import_zod6.z.number(), import_zod6.z.string()]).optional(),
      height: import_zod6.z.union([import_zod6.z.number(), import_zod6.z.string()]).optional(),
      minWidth: import_zod6.z.union([import_zod6.z.number(), import_zod6.z.string()]).optional(),
      maxWidth: import_zod6.z.union([import_zod6.z.number(), import_zod6.z.string()]).optional(),
      minHeight: import_zod6.z.union([import_zod6.z.number(), import_zod6.z.string()]).optional(),
      maxHeight: import_zod6.z.union([import_zod6.z.number(), import_zod6.z.string()]).optional()
    }).optional(),
    resizable: import_zod6.z.boolean().optional()
  }).optional(),
  visible: import_zod6.z.boolean().optional(),
  locked: import_zod6.z.boolean().optional(),
  _meta: UIElementMetaSchema.optional()
});
var UIElementSchema = UIElementBaseSchema.extend({
  children: import_zod6.z.lazy(() => import_zod6.z.array(UIElementSchema)).optional()
});

// src/streaming/validation.ts
var StreamValidationPipeline = class {
  componentTypes;
  constructor(registeredComponents) {
    this.componentTypes = new Set(registeredComponents ?? []);
  }
  /**
   * Register component types for validation
   */
  registerComponentTypes(types) {
    types.forEach((t) => this.componentTypes.add(t));
  }
  /**
   * Validate a complete stream frame
   */
  validateFrame(data) {
    const errors = [];
    const warnings = [];
    const result = StreamFrameSchema.safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push({
          path: issue.path.join("."),
          code: issue.code,
          message: issue.message
        });
      }
      return { valid: false, errors, warnings };
    }
    const frame = result.data;
    if (frame.sequence < 0) {
      errors.push({
        path: "sequence",
        code: "INVALID_SEQUENCE",
        message: "Sequence must be non-negative"
      });
    }
    return { valid: errors.length === 0, errors, warnings };
  }
  /**
   * Validate a stream message
   */
  validateMessage(data) {
    const errors = [];
    const warnings = [];
    const result = StreamMessageSchema.safeParse(data);
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push({
          path: issue.path.join("."),
          code: issue.code,
          message: issue.message
        });
      }
    }
    return { valid: errors.length === 0, errors, warnings };
  }
  /**
   * Validate a single patch operation
   */
  validatePatch(patch) {
    const errors = [];
    const warnings = [];
    const result = StreamPatchSchema.safeParse(patch);
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push({
          path: issue.path.join("."),
          code: issue.code,
          message: issue.message
        });
      }
      return { valid: false, errors, warnings };
    }
    const p = result.data;
    if (!p.path.startsWith("/")) {
      errors.push({
        path: "path",
        code: "INVALID_PATH",
        message: "Path must start with /"
      });
    }
    if ((p.op === "add" || p.op === "replace") && p.value === void 0) {
      errors.push({
        path: "value",
        code: "MISSING_VALUE",
        message: `Value required for ${p.op} operation`
      });
    }
    if ((p.op === "move" || p.op === "copy") && !p.from) {
      errors.push({
        path: "from",
        code: "MISSING_FROM",
        message: `From path required for ${p.op} operation`
      });
    }
    return { valid: errors.length === 0, errors, warnings };
  }
  /**
   * Validate a UI element against catalog
   */
  validateElement(element) {
    const errors = [];
    const warnings = [];
    const result = UIElementSchema.safeParse(element);
    if (!result.success) {
      for (const issue of result.error.issues) {
        errors.push({
          path: issue.path.join("."),
          code: issue.code,
          message: issue.message
        });
      }
      return { valid: false, errors, warnings };
    }
    const el = result.data;
    if (this.componentTypes.size > 0 && !this.componentTypes.has(el.type)) {
      warnings.push({
        path: "type",
        code: "UNKNOWN_COMPONENT",
        message: `Unknown component type: ${el.type}`
      });
    }
    return { valid: errors.length === 0, errors, warnings };
  }
  /**
   * Parse and validate with auto-fix for recoverable errors
   */
  parseWithRecovery(data) {
    const validation = this.validateFrame(data);
    if (validation.valid) {
      return {
        frame: data,
        validation,
        recovered: false
      };
    }
    const fixed = this.tryAutoFix(data);
    if (fixed) {
      const revalidation = this.validateFrame(fixed);
      if (revalidation.valid) {
        revalidation.warnings.push({
          path: "",
          code: "AUTO_FIXED",
          message: "Frame was auto-fixed",
          autoFixed: true
        });
        return {
          frame: fixed,
          validation: revalidation,
          recovered: true
        };
      }
    }
    return { frame: null, validation, recovered: false };
  }
  /**
   * Try to auto-fix common issues
   */
  tryAutoFix(data) {
    if (typeof data !== "object" || data === null) return null;
    const obj = { ...data };
    if (!obj.version) {
      obj.version = "2.0";
    }
    if (!obj.timestamp) {
      obj.timestamp = Date.now();
    }
    if (!obj.correlationId) {
      obj.correlationId = crypto.randomUUID();
    }
    if (typeof obj.sequence !== "number") {
      obj.sequence = 0;
    }
    return obj;
  }
};
function createValidationPipeline(componentTypes) {
  return new StreamValidationPipeline(componentTypes);
}

// src/streaming/patch-buffer.ts
var PatchBuffer = class {
  buffer = /* @__PURE__ */ new Map();
  expectedSequence = 0;
  maxBufferSize;
  gapTimeout;
  flushInterval;
  flushTimer = null;
  onFlush = null;
  constructor(options = {}) {
    this.maxBufferSize = options.maxBufferSize ?? 100;
    this.gapTimeout = options.gapTimeout ?? 5e3;
    this.flushInterval = options.flushInterval ?? 50;
  }
  /**
   * Set flush callback
   */
  setOnFlush(callback) {
    this.onFlush = callback;
  }
  /**
   * Add a frame to the buffer
   */
  add(frame) {
    const { sequence } = frame;
    this.buffer.set(sequence, {
      frame,
      receivedAt: Date.now()
    });
    if (sequence === this.expectedSequence) {
      this.scheduleFlush();
    }
    if (this.buffer.size > this.maxBufferSize) {
      this.forceFlush();
    }
  }
  /**
   * Schedule a flush
   */
  scheduleFlush() {
    if (this.flushTimer) return;
    this.flushTimer = setTimeout(() => {
      this.flushTimer = null;
      this.flush();
    }, this.flushInterval);
  }
  /**
   * Flush in-order frames
   */
  flush() {
    const frames = [];
    const gaps = [];
    while (this.buffer.has(this.expectedSequence)) {
      const buffered = this.buffer.get(this.expectedSequence);
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
  forceFlush() {
    const frames = [];
    const gaps = [];
    const now = Date.now();
    let minSeq = Infinity;
    for (const seq of this.buffer.keys()) {
      if (seq < minSeq) minSeq = seq;
    }
    if (minSeq === Infinity) {
      return { frames, gaps };
    }
    while (minSeq > this.expectedSequence) {
      const buffered = this.buffer.get(minSeq);
      if (buffered && now - buffered.receivedAt > this.gapTimeout) {
        for (let i = this.expectedSequence; i < minSeq; i++) {
          gaps.push(i);
        }
        this.expectedSequence = minSeq;
        break;
      }
      break;
    }
    return this.flush();
  }
  /**
   * Reset buffer state
   */
  reset() {
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
  getStats() {
    let oldestAge = 0;
    const now = Date.now();
    for (const buffered of this.buffer.values()) {
      const age = now - buffered.receivedAt;
      if (age > oldestAge) oldestAge = age;
    }
    return {
      bufferedCount: this.buffer.size,
      expectedSequence: this.expectedSequence,
      oldestAge
    };
  }
};
function createPatchBuffer(options) {
  return new PatchBuffer(options);
}

// src/streaming/placeholder-manager.ts
var PlaceholderManager = class {
  placeholders = /* @__PURE__ */ new Map();
  pendingElements = /* @__PURE__ */ new Map();
  timeout;
  constructor(options = {}) {
    this.timeout = options.timeout ?? 5e3;
  }
  /**
   * Create a placeholder for a forward-referenced element
   */
  createPlaceholder(key, parentKey) {
    this.placeholders.set(key, {
      key,
      parentKey,
      createdAt: Date.now(),
      referencedBy: /* @__PURE__ */ new Set()
    });
    return {
      key,
      type: "__placeholder__",
      props: {
        _isPlaceholder: true,
        _createdAt: Date.now()
      }
    };
  }
  /**
   * Check if a key is a placeholder
   */
  isPlaceholder(key) {
    return this.placeholders.has(key);
  }
  /**
   * Register that an element references a placeholder
   */
  addReference(placeholderKey, referencingKey) {
    const info = this.placeholders.get(placeholderKey);
    if (info) {
      info.referencedBy.add(referencingKey);
    }
  }
  /**
   * Resolve a placeholder with the real element
   */
  resolve(key, element) {
    const info = this.placeholders.get(key);
    if (!info) {
      this.pendingElements.set(key, element);
      return { resolved: true, element, dependents: [] };
    }
    this.placeholders.delete(key);
    const dependents = Array.from(info.referencedBy);
    return { resolved: true, element, dependents };
  }
  /**
   * Check for timed-out placeholders
   */
  checkTimeouts() {
    const timedOut = [];
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
  pruneTimedOut() {
    const timedOut = this.checkTimeouts();
    for (const key of timedOut) {
      this.placeholders.delete(key);
    }
    return timedOut;
  }
  /**
   * Get all pending placeholders
   */
  getPendingPlaceholders() {
    return Array.from(this.placeholders.keys());
  }
  /**
   * Get statistics
   */
  getStats() {
    let oldestAge = 0;
    const now = Date.now();
    for (const info of this.placeholders.values()) {
      const age = now - info.createdAt;
      if (age > oldestAge) oldestAge = age;
    }
    return {
      placeholderCount: this.placeholders.size,
      pendingCount: this.pendingElements.size,
      oldestAge
    };
  }
  /**
   * Reset manager state
   */
  reset() {
    this.placeholders.clear();
    this.pendingElements.clear();
  }
};
function createPlaceholderManager(options) {
  return new PlaceholderManager(options);
}

// src/streaming/ports.ts
var noopStreamSource = {
  connect: async () => {
  },
  disconnect: async () => {
  },
  subscribe: () => () => {
  },
  onError: () => () => {
  },
  isConnected: () => false
};
var noopStreamSink = {
  send: async () => {
  },
  sendMessage: async () => {
  },
  flush: async () => {
  },
  close: async () => {
  }
};
var noopStreamPersistence = {
  saveState: async () => {
  },
  loadState: async () => null,
  deleteState: async () => {
  },
  listSessions: async () => []
};
var noopStreamTelemetry = {
  recordFrameReceived: () => {
  },
  recordValidationError: () => {
  },
  recordSequenceGap: () => {
  },
  recordRecovery: () => {
  },
  getMetrics: () => ({
    framesReceived: 0,
    framesValidated: 0,
    validationErrors: 0,
    recoveries: 0,
    sequenceGaps: 0,
    averageLatency: 0
  })
};

// src/ports/cache.ts
var noopCache = {
  get: async () => null,
  set: async () => {
  },
  delete: async () => {
  },
  has: async () => false,
  clear: async () => {
  },
  invalidateByTag: async () => {
  },
  getStats: async () => ({ hits: 0, misses: 0, size: 0, maxSize: 0 })
};

// src/ports/memory.ts
var noopMemoryStore = {
  store: async (item) => ({ id: crypto.randomUUID(), ...item }),
  recall: async () => ({ items: [], totalMatches: 0 }),
  forget: async () => {
  },
  forgetByTag: async () => {
  },
  consolidate: async () => {
  },
  getStats: async () => ({
    totalItems: 0,
    oldestTimestamp: 0,
    newestTimestamp: 0
  })
};

// src/ports/sync.ts
var noopSync = {
  getStatus: () => "idle",
  getPendingOperations: async () => [],
  queueOperation: async () => crypto.randomUUID(),
  sync: async () => ({ synced: 0, failed: 0, conflicts: [] }),
  resolveConflict: async () => {
  },
  clearPending: async () => {
  },
  onStatusChange: () => () => {
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ActionConfirmSchema,
  ActionOnErrorSchema,
  ActionOnSuccessSchema,
  ActionOptimisticConfigSchema,
  ActionRetryConfigSchema,
  ActionSchema,
  ChatMessageSchema,
  DynamicBooleanSchema,
  DynamicNumberSchema,
  DynamicStringSchema,
  DynamicValueSchema,
  LogicExpressionSchema,
  PatchBuffer,
  PatchMessageSchema,
  PlaceholderManager,
  QuestionMessageSchema,
  StreamControlSchema,
  StreamFrameSchema,
  StreamMessageSchema,
  StreamPatchSchema,
  StreamValidationPipeline,
  SuggestionMessageSchema,
  ToolProgressMessageSchema,
  UIElementMetaSchema,
  UIElementSchema,
  ValidationCheckSchema,
  ValidationConfigSchema,
  VisibilityConditionSchema,
  action,
  builtInValidationFunctions,
  check,
  createCatalog,
  createCatalogFromComponents,
  createPatchBuffer,
  createPlaceholderManager,
  createValidationPipeline,
  defineComponent,
  evaluateLogicExpression,
  evaluateVisibility,
  executeAction,
  generateActionsContextPrompt,
  generateCatalogPrompt,
  generateDeepSelectionPrompt,
  generateLayoutContextPrompt,
  generateSelectionContextPrompt,
  generateSystemPrompt,
  generateTextSelectionPrompt,
  generateTreeContextPrompt,
  getByPath,
  interpolateString,
  noopCache,
  noopMemoryStore,
  noopStreamPersistence,
  noopStreamSink,
  noopStreamSource,
  noopStreamTelemetry,
  noopSync,
  resolveAction,
  resolveDynamicValue,
  runValidation,
  runValidationCheck,
  setByPath,
  toCatalogDefinition,
  toCatalogDefinitions,
  visibility
});
//# sourceMappingURL=index.js.map