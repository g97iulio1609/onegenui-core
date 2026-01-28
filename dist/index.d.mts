import { z } from 'zod';
export { getByPath } from '@onegenui/utils';

/**
 * Dynamic value - can be a literal or a path reference to data model
 */
type DynamicValue<T = unknown> = T | {
    path: string;
};
/**
 * Dynamic string value
 */
type DynamicString = DynamicValue<string>;
/**
 * Dynamic number value
 */
type DynamicNumber = DynamicValue<number>;
/**
 * Dynamic boolean value
 */
type DynamicBoolean = DynamicValue<boolean>;
/**
 * Zod schema for dynamic values
 */
declare const DynamicValueSchema: z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodObject<{
    path: z.ZodString;
}, z.core.$strip>]>;
declare const DynamicStringSchema: z.ZodUnion<readonly [z.ZodString, z.ZodObject<{
    path: z.ZodString;
}, z.core.$strip>]>;
declare const DynamicNumberSchema: z.ZodUnion<readonly [z.ZodNumber, z.ZodObject<{
    path: z.ZodString;
}, z.core.$strip>]>;
declare const DynamicBooleanSchema: z.ZodUnion<readonly [z.ZodBoolean, z.ZodObject<{
    path: z.ZodString;
}, z.core.$strip>]>;
/**
 * Sizing configuration for UI elements
 */
interface ElementSize {
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
interface ElementGridLayout {
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
interface ElementResizeConfig {
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
interface ElementLayout {
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
interface UIElement<T extends string = string, P = Record<string, unknown>> {
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
        turnId?: string;
        createdAt?: number;
    };
}
/**
 * Visibility condition types
 */
type VisibilityCondition = boolean | {
    path: string;
} | {
    auth: "signedIn" | "signedOut";
} | {
    role: string | string[];
} | {
    feature: string | string[];
} | {
    device: "mobile" | "tablet" | "desktop" | ("mobile" | "tablet" | "desktop")[];
} | LogicExpression;
/**
 * Logic expression for complex conditions
 */
type LogicExpression = {
    and: LogicExpression[];
} | {
    or: LogicExpression[];
} | {
    not: LogicExpression;
} | {
    path: string;
} | {
    eq: [DynamicValue, DynamicValue];
} | {
    neq: [DynamicValue, DynamicValue];
} | {
    gt: [DynamicValue<number>, DynamicValue<number>];
} | {
    gte: [DynamicValue<number>, DynamicValue<number>];
} | {
    lt: [DynamicValue<number>, DynamicValue<number>];
} | {
    lte: [DynamicValue<number>, DynamicValue<number>];
};
/**
 * Flat UI tree structure (optimized for LLM generation)
 */
interface UITree {
    /** Root element key */
    root: string;
    /** Flat map of elements by key */
    elements: Record<string, UIElement>;
}
/**
 * Auth state for visibility evaluation
 */
interface AuthState {
    isSignedIn: boolean;
    user?: Record<string, unknown>;
    roles?: string[];
}
/**
 * Feature flags state
 */
interface FeatureFlags {
    enabled: string[];
}
/**
 * Device detection state
 */
interface DeviceState {
    type: "mobile" | "tablet" | "desktop";
    isTouchDevice?: boolean;
}
/**
 * Data model type
 */
type DataModel = Record<string, unknown>;
/**
 * Component schema definition using Zod
 */
type ComponentSchema = z.ZodType<Record<string, unknown>>;
/**
 * Validation mode for catalog validation
 */
type ValidationMode = "strict" | "warn" | "ignore";
/**
 * JSON patch operation types
 */
type PatchOp = "add" | "remove" | "replace" | "set" | "ensure" | "message" | "question" | "suggestion";
/**
 * JSON patch operation
 */
interface JsonPatch {
    op: PatchOp;
    path: string;
    value?: unknown;
    /** Question payload (for op: "question") */
    question?: unknown;
    /** Suggestions array (for op: "suggestion") */
    suggestions?: unknown[];
}
/**
 * Resolve a dynamic value against a data model
 */
declare function resolveDynamicValue<T>(value: DynamicValue<T>, dataModel: DataModel): T | undefined;
/**
 * Set a value in an object by JSON Pointer path
 */
declare function setByPath(obj: Record<string, unknown>, path: string, value: unknown): void;
/**
 * A node in the document index tree
 */
interface DocumentIndexNode {
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
interface DocumentIndex {
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
type StreamEventType = "tool-progress" | "document-index-ui" | "persisted-attachments" | "plan-created" | "level-started" | "step-started" | "step-done" | "subtask-started" | "subtask-done" | "orchestration-done";
/**
 * Tool progress status
 */
type ToolProgressStatus = "starting" | "progress" | "complete" | "error";
/**
 * Tool progress stream event
 */
interface ToolProgressEvent {
    type: "tool-progress";
    toolName: string;
    toolCallId: string;
    status: ToolProgressStatus;
    message?: string;
    data?: unknown;
    progress?: number;
    timestamp?: number;
}
/**
 * Document index UI stream event
 */
interface DocumentIndexEvent {
    type: "document-index-ui";
    uiComponent: {
        type: "DocumentIndex";
        props: DocumentIndex;
    };
}

/**
 * Logic expression schema (recursive)
 * Using a more permissive schema that aligns with runtime behavior
 */
declare const LogicExpressionSchema: z.ZodType<LogicExpression>;
/**
 * Visibility condition schema
 */
declare const VisibilityConditionSchema: z.ZodType<VisibilityCondition>;
/**
 * Context for evaluating visibility
 */
interface VisibilityContext {
    dataModel: DataModel;
    authState?: AuthState;
    featureFlags?: FeatureFlags;
    deviceState?: DeviceState;
}
/**
 * Evaluate a logic expression against data and auth state
 */
declare function evaluateLogicExpression(expr: LogicExpression, ctx: VisibilityContext): boolean;
/**
 * Evaluate a visibility condition
 */
declare function evaluateVisibility(condition: VisibilityCondition | undefined, ctx: VisibilityContext): boolean;
/**
 * Helper to create visibility conditions
 */
declare const visibility: {
    /** Always visible */
    always: true;
    /** Never visible */
    never: false;
    /** Visible when path is truthy */
    when: (path: string) => VisibilityCondition;
    /** Visible when signed in */
    signedIn: {
        readonly auth: "signedIn";
    };
    /** Visible when signed out */
    signedOut: {
        readonly auth: "signedOut";
    };
    /** AND multiple conditions */
    and: (...conditions: LogicExpression[]) => LogicExpression;
    /** OR multiple conditions */
    or: (...conditions: LogicExpression[]) => LogicExpression;
    /** NOT a condition */
    not: (condition: LogicExpression) => LogicExpression;
    /** Equality check */
    eq: (left: DynamicValue, right: DynamicValue) => LogicExpression;
    /** Not equal check */
    neq: (left: DynamicValue, right: DynamicValue) => LogicExpression;
    /** Greater than */
    gt: (left: DynamicValue<number>, right: DynamicValue<number>) => LogicExpression;
    /** Greater than or equal */
    gte: (left: DynamicValue<number>, right: DynamicValue<number>) => LogicExpression;
    /** Less than */
    lt: (left: DynamicValue<number>, right: DynamicValue<number>) => LogicExpression;
    /** Less than or equal */
    lte: (left: DynamicValue<number>, right: DynamicValue<number>) => LogicExpression;
    /** Visible for specific roles */
    hasRole: (role: string | string[]) => VisibilityCondition;
    /** Visible when feature flag is enabled */
    hasFeature: (feature: string | string[]) => VisibilityCondition;
    /** Visible on specific devices */
    onDevice: (device: "mobile" | "tablet" | "desktop" | ("mobile" | "tablet" | "desktop")[]) => VisibilityCondition;
    /** Visible only on mobile */
    mobileOnly: {
        readonly device: "mobile";
    };
    /** Visible only on desktop */
    desktopOnly: {
        readonly device: "desktop";
    };
};

/**
 * Confirmation dialog configuration
 */
interface ActionConfirm {
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "default" | "danger";
}
/**
 * Action success handler
 */
type ActionOnSuccess = {
    navigate: string;
} | {
    set: Record<string, unknown>;
} | {
    action: string;
};
/**
 * Action error handler
 */
type ActionOnError = {
    set: Record<string, unknown>;
} | {
    action: string;
};
/**
 * Retry configuration for actions
 */
interface ActionRetryConfig {
    /** Maximum number of retry attempts */
    maxAttempts: number;
    /** Initial delay in ms between retries */
    delayMs?: number;
    /** Multiplier for exponential backoff */
    backoffMultiplier?: number;
    /** Maximum delay in ms */
    maxDelayMs?: number;
}
/**
 * Optimistic update configuration
 */
interface ActionOptimisticConfig {
    /** Path to update optimistically */
    path: string;
    /** Value to set before action completes */
    value: unknown;
    /** Whether to revert on error (default: true) */
    revertOnError?: boolean;
}
/**
 * Rich action definition
 */
interface Action {
    /** Action name (must be in catalog) */
    name: string;
    /** Parameters to pass to the action handler */
    params?: Record<string, DynamicValue>;
    /** Confirmation dialog before execution */
    confirm?: ActionConfirm;
    /** Handler after successful execution */
    onSuccess?: ActionOnSuccess;
    /** Handler after failed execution */
    onError?: ActionOnError;
    /** Throttle action execution (ms) - ignores calls during cooldown */
    throttleMs?: number;
    /** Debounce action execution (ms) - delays execution, resets on new calls */
    debounceMs?: number;
    /** Retry configuration for failed actions */
    retry?: ActionRetryConfig;
    /** Optimistic update configuration */
    optimistic?: ActionOptimisticConfig;
}
/**
 * Schema for action confirmation
 */
declare const ActionConfirmSchema: z.ZodObject<{
    title: z.ZodString;
    message: z.ZodString;
    confirmLabel: z.ZodOptional<z.ZodString>;
    cancelLabel: z.ZodOptional<z.ZodString>;
    variant: z.ZodOptional<z.ZodEnum<{
        default: "default";
        danger: "danger";
    }>>;
}, z.core.$strip>;
/**
 * Schema for success handlers
 */
declare const ActionOnSuccessSchema: z.ZodUnion<readonly [z.ZodObject<{
    navigate: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    set: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, z.core.$strip>, z.ZodObject<{
    action: z.ZodString;
}, z.core.$strip>]>;
/**
 * Schema for error handlers
 */
declare const ActionOnErrorSchema: z.ZodUnion<readonly [z.ZodObject<{
    set: z.ZodRecord<z.ZodString, z.ZodUnknown>;
}, z.core.$strip>, z.ZodObject<{
    action: z.ZodString;
}, z.core.$strip>]>;
/**
 * Schema for retry configuration
 */
declare const ActionRetryConfigSchema: z.ZodObject<{
    maxAttempts: z.ZodNumber;
    delayMs: z.ZodOptional<z.ZodNumber>;
    backoffMultiplier: z.ZodOptional<z.ZodNumber>;
    maxDelayMs: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
/**
 * Schema for optimistic update configuration
 */
declare const ActionOptimisticConfigSchema: z.ZodObject<{
    path: z.ZodString;
    value: z.ZodUnknown;
    revertOnError: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
/**
 * Full action schema
 */
declare const ActionSchema: z.ZodObject<{
    name: z.ZodString;
    params: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodObject<{
        path: z.ZodString;
    }, z.core.$strip>]>>>;
    confirm: z.ZodOptional<z.ZodObject<{
        title: z.ZodString;
        message: z.ZodString;
        confirmLabel: z.ZodOptional<z.ZodString>;
        cancelLabel: z.ZodOptional<z.ZodString>;
        variant: z.ZodOptional<z.ZodEnum<{
            default: "default";
            danger: "danger";
        }>>;
    }, z.core.$strip>>;
    onSuccess: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
        navigate: z.ZodString;
    }, z.core.$strip>, z.ZodObject<{
        set: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    }, z.core.$strip>, z.ZodObject<{
        action: z.ZodString;
    }, z.core.$strip>]>>;
    onError: z.ZodOptional<z.ZodUnion<readonly [z.ZodObject<{
        set: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    }, z.core.$strip>, z.ZodObject<{
        action: z.ZodString;
    }, z.core.$strip>]>>;
    throttleMs: z.ZodOptional<z.ZodNumber>;
    debounceMs: z.ZodOptional<z.ZodNumber>;
    retry: z.ZodOptional<z.ZodObject<{
        maxAttempts: z.ZodNumber;
        delayMs: z.ZodOptional<z.ZodNumber>;
        backoffMultiplier: z.ZodOptional<z.ZodNumber>;
        maxDelayMs: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    optimistic: z.ZodOptional<z.ZodObject<{
        path: z.ZodString;
        value: z.ZodUnknown;
        revertOnError: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
}, z.core.$strip>;
/**
 * Action handler function signature
 */
type ActionHandler<TParams = Record<string, unknown>, TResult = unknown> = (params: TParams) => Promise<TResult> | TResult;
/**
 * Action definition in catalog
 */
interface ActionDefinition<TParams = Record<string, unknown>> {
    /** Zod schema for params validation */
    params?: z.ZodType<TParams>;
    /** Description for AI */
    description?: string;
}
/**
 * Resolved action with all dynamic values resolved
 */
interface ResolvedAction {
    name: string;
    params: Record<string, unknown>;
    confirm?: ActionConfirm;
    onSuccess?: ActionOnSuccess;
    onError?: ActionOnError;
}
/**
 * Resolve all dynamic values in an action
 */
declare function resolveAction(action: Action, dataModel: DataModel): ResolvedAction;
/**
 * Interpolate ${path} expressions in a string
 */
declare function interpolateString(template: string, dataModel: DataModel): string;
/**
 * Context for action execution
 */
interface ActionExecutionContext {
    /** The resolved action */
    action: ResolvedAction;
    /** The action handler from the host */
    handler: ActionHandler;
    /** Function to update data model */
    setData: (path: string, value: unknown) => void;
    /** Function to navigate */
    navigate?: (path: string) => void;
    /** Function to execute another action */
    executeAction?: (name: string) => Promise<void>;
}
/**
 * Execute an action with all callbacks
 */
declare function executeAction(ctx: ActionExecutionContext): Promise<void>;
/**
 * Helper to create actions
 */
declare const action: {
    /** Create a simple action */
    simple: (name: string, params?: Record<string, DynamicValue>) => Action;
    /** Create an action with confirmation */
    withConfirm: (name: string, confirm: ActionConfirm, params?: Record<string, DynamicValue>) => Action;
    /** Create an action with success handler */
    withSuccess: (name: string, onSuccess: ActionOnSuccess, params?: Record<string, DynamicValue>) => Action;
    /** Create a throttled action (ignores calls during cooldown) */
    throttled: (name: string, throttleMs: number, params?: Record<string, DynamicValue>) => Action;
    /** Create a debounced action (delays execution, resets on new calls) */
    debounced: (name: string, debounceMs: number, params?: Record<string, DynamicValue>) => Action;
    /** Create an action with retry */
    withRetry: (name: string, retry: ActionRetryConfig, params?: Record<string, DynamicValue>) => Action;
    /** Create an action with optimistic update */
    optimistic: (name: string, optimistic: ActionOptimisticConfig, params?: Record<string, DynamicValue>) => Action;
};

/**
 * Validation check definition
 */
interface ValidationCheck {
    /** Function name (built-in or from catalog) */
    fn: string;
    /** Additional arguments for the function */
    args?: Record<string, DynamicValue>;
    /** Error message to display if check fails */
    message: string;
    /** Condition for when this check should run */
    when?: LogicExpression;
}
/**
 * Validation configuration for a field
 */
interface ValidationConfig {
    /** Array of checks to run */
    checks?: ValidationCheck[];
    /** When to run validation */
    validateOn?: "change" | "blur" | "submit";
    /** Condition for when validation is enabled */
    enabled?: LogicExpression;
}
/**
 * Schema for validation check
 */
declare const ValidationCheckSchema: z.ZodObject<{
    fn: z.ZodString;
    args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodObject<{
        path: z.ZodString;
    }, z.core.$strip>]>>>;
    message: z.ZodString;
    when: z.ZodOptional<z.ZodType<LogicExpression, unknown, z.core.$ZodTypeInternals<LogicExpression, unknown>>>;
}, z.core.$strip>;
/**
 * Schema for validation config
 */
declare const ValidationConfigSchema: z.ZodObject<{
    checks: z.ZodOptional<z.ZodArray<z.ZodObject<{
        fn: z.ZodString;
        args: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<readonly [z.ZodString, z.ZodNumber, z.ZodBoolean, z.ZodNull, z.ZodObject<{
            path: z.ZodString;
        }, z.core.$strip>]>>>;
        message: z.ZodString;
        when: z.ZodOptional<z.ZodType<LogicExpression, unknown, z.core.$ZodTypeInternals<LogicExpression, unknown>>>;
    }, z.core.$strip>>>;
    validateOn: z.ZodOptional<z.ZodEnum<{
        change: "change";
        blur: "blur";
        submit: "submit";
    }>>;
    enabled: z.ZodOptional<z.ZodType<LogicExpression, unknown, z.core.$ZodTypeInternals<LogicExpression, unknown>>>;
}, z.core.$strip>;
/**
 * Validation function signature
 */
type ValidationFunction = (value: unknown, args?: Record<string, unknown>) => boolean;
/**
 * Validation function definition in catalog
 */
interface ValidationFunctionDefinition {
    /** The validation function */
    validate: ValidationFunction;
    /** Description for AI */
    description?: string;
}
/**
 * Built-in validation functions
 */
declare const builtInValidationFunctions: Record<string, ValidationFunction>;
/**
 * Validation result for a single check
 */
interface ValidationCheckResult {
    fn: string;
    valid: boolean;
    message: string;
}
/**
 * Full validation result for a field
 */
interface ValidationResult$1 {
    valid: boolean;
    errors: string[];
    checks: ValidationCheckResult[];
}
/**
 * Context for running validation
 */
interface ValidationContext {
    /** Current value to validate */
    value: unknown;
    /** Full data model for resolving paths */
    dataModel: DataModel;
    /** Custom validation functions from catalog */
    customFunctions?: Record<string, ValidationFunction>;
}
/**
 * Run a single validation check
 */
declare function runValidationCheck(check: ValidationCheck, ctx: ValidationContext): ValidationCheckResult;
/**
 * Run all validation checks for a field
 */
declare function runValidation(config: ValidationConfig, ctx: ValidationContext & {
    authState?: {
        isSignedIn: boolean;
    };
}): ValidationResult$1;
/**
 * Helper to create validation checks
 */
declare const check: {
    required: (message?: string) => ValidationCheck;
    email: (message?: string) => ValidationCheck;
    minLength: (min: number, message?: string) => ValidationCheck;
    maxLength: (max: number, message?: string) => ValidationCheck;
    pattern: (pattern: string, message?: string) => ValidationCheck;
    min: (min: number, message?: string) => ValidationCheck;
    max: (max: number, message?: string) => ValidationCheck;
    url: (message?: string) => ValidationCheck;
    matches: (otherPath: string, message?: string) => ValidationCheck;
    phone: (message?: string) => ValidationCheck;
    date: (message?: string) => ValidationCheck;
    isoDate: (message?: string) => ValidationCheck;
    futureDate: (message?: string) => ValidationCheck;
    pastDate: (message?: string) => ValidationCheck;
    alphanumeric: (message?: string) => ValidationCheck;
    minItems: (min: number, message?: string) => ValidationCheck;
    maxItems: (max: number, message?: string) => ValidationCheck;
    /** Create a conditional check (only runs when condition is true) */
    when: (condition: LogicExpression, check: ValidationCheck) => ValidationCheck;
};

/**
 * Component definition with visibility and validation support
 */
interface ComponentDefinition<TProps extends ComponentSchema = ComponentSchema> {
    /** Zod schema for component props */
    props: TProps;
    /** Whether this component can have children */
    hasChildren?: boolean;
    /** Description for AI generation */
    description?: string;
}
/**
 * Catalog configuration
 */
interface CatalogConfig<TComponents extends Record<string, ComponentDefinition> = Record<string, ComponentDefinition>, TActions extends Record<string, ActionDefinition> = Record<string, ActionDefinition>, TFunctions extends Record<string, ValidationFunction> = Record<string, ValidationFunction>> {
    /** Catalog name */
    name?: string;
    /** Component definitions */
    components: TComponents;
    /** Action definitions with param schemas */
    actions?: TActions;
    /** Custom validation functions */
    functions?: TFunctions;
    /** Validation mode */
    validation?: ValidationMode;
}
/**
 * Catalog instance
 */
interface Catalog<TComponents extends Record<string, ComponentDefinition> = Record<string, ComponentDefinition>, TActions extends Record<string, ActionDefinition> = Record<string, ActionDefinition>, TFunctions extends Record<string, ValidationFunction> = Record<string, ValidationFunction>> {
    /** Catalog name */
    readonly name: string;
    /** Component names */
    readonly componentNames: (keyof TComponents)[];
    /** Action names */
    readonly actionNames: (keyof TActions)[];
    /** Function names */
    readonly functionNames: (keyof TFunctions)[];
    /** Validation mode */
    readonly validation: ValidationMode;
    /** Component definitions */
    readonly components: TComponents;
    /** Action definitions */
    readonly actions: TActions;
    /** Custom validation functions */
    readonly functions: TFunctions;
    /** Full element schema for AI generation */
    readonly elementSchema: z.ZodType<UIElement>;
    /** Full UI tree schema */
    readonly treeSchema: z.ZodType<UITree>;
    /** Check if component exists */
    hasComponent(type: string): boolean;
    /** Check if action exists */
    hasAction(name: string): boolean;
    /** Check if function exists */
    hasFunction(name: string): boolean;
    /** Validate an element */
    validateElement(element: unknown): {
        success: boolean;
        data?: UIElement;
        error?: z.ZodError;
    };
    /** Validate a UI tree */
    validateTree(tree: unknown): {
        success: boolean;
        data?: UITree;
        error?: z.ZodError;
    };
}
/**
 * Create a v2 catalog with visibility, actions, and validation support
 */
declare function createCatalog<TComponents extends Record<string, ComponentDefinition>, TActions extends Record<string, ActionDefinition> = Record<string, ActionDefinition>, TFunctions extends Record<string, ValidationFunction> = Record<string, ValidationFunction>>(config: CatalogConfig<TComponents, TActions, TFunctions>): Catalog<TComponents, TActions, TFunctions>;
/**
 * Generate a prompt for AI that describes the catalog
 */
declare function generateCatalogPrompt<TComponents extends Record<string, ComponentDefinition>, TActions extends Record<string, ActionDefinition>, TFunctions extends Record<string, ValidationFunction>>(catalog: Catalog<TComponents, TActions, TFunctions>): string;
/**
 * Type helper to infer component props from catalog
 */
type InferCatalogComponentProps<C extends Catalog<Record<string, ComponentDefinition>>> = {
    [K in keyof C["components"]]: z.infer<C["components"][K]["props"]>;
};

/**
 * Configuration for defineComponent
 */
interface DefineComponentConfig<TName extends string, TProps extends ComponentSchema> {
    /** Unique component name */
    name: TName;
    /** Zod schema for component props */
    props: TProps;
    /** Description for AI generation and documentation */
    description: string;
    /** Whether this component can have children */
    hasChildren?: boolean;
    /** Category for organization (e.g., "layout", "data-display") */
    category?: string;
    /** AI generation hints and rules */
    aiHints?: string[];
}
/**
 * Component definition with full type inference
 */
interface TypedComponentDefinition<TName extends string = string, TProps extends ComponentSchema = ComponentSchema> extends ComponentDefinition<TProps> {
    /** Component name with literal type */
    readonly name: TName;
    /** Props schema */
    readonly props: TProps;
    /** Description */
    readonly description: string;
    /** Has children */
    readonly hasChildren: boolean;
    /** Category */
    readonly category?: string;
    /** AI hints */
    readonly aiHints?: string[];
}
/**
 * Define a component with full type inference and validation.
 *
 * @example
 * ```ts
 * const CardDefinition = defineComponent({
 *   name: "Card",
 *   props: z.object({
 *     title: z.string().optional(),
 *     padding: z.enum(["sm", "md", "lg"]).default("md"),
 *   }),
 *   description: "A card container with optional title",
 *   hasChildren: true,
 *   category: "layout",
 * });
 *
 * // Type-safe props inference
 * type CardProps = InferComponentProps<typeof CardDefinition>;
 * ```
 */
declare function defineComponent<TName extends string, TProps extends ComponentSchema>(config: DefineComponentConfig<TName, TProps>): TypedComponentDefinition<TName, TProps>;
/**
 * Infer props type from a component definition
 */
type InferComponentProps<T extends TypedComponentDefinition> = z.infer<T["props"]>;
/**
 * Infer component name from a component definition
 */
type InferComponentName<T extends TypedComponentDefinition> = T["name"];
/**
 * Convert a typed component definition to a catalog-compatible format
 */
declare function toCatalogDefinition<T extends TypedComponentDefinition>(definition: T): ComponentDefinition<T["props"]>;
/**
 * Convert multiple typed component definitions to catalog-compatible format
 */
declare function toCatalogDefinitions<T extends Record<string, TypedComponentDefinition>>(definitions: T): {
    [K in keyof T]: ComponentDefinition<T[K]["props"]>;
};
/**
 * Options for createCatalogFromComponents
 */
interface CreateCatalogFromComponentsOptions<TActions extends Record<string, ActionDefinition> = Record<string, ActionDefinition>, TFunctions extends Record<string, ValidationFunction> = Record<string, ValidationFunction>> {
    /** Catalog name */
    name?: string;
    /** Action definitions */
    actions?: TActions;
    /** Custom validation functions */
    functions?: TFunctions;
    /** Validation mode: "strict" | "warn" | "ignore" */
    validation?: ValidationMode;
}
/**
 * Create a catalog directly from typed component definitions.
 * This is a convenience function that combines toCatalogDefinitions + createCatalog.
 *
 * @example
 * ```ts
 * import { CardDefinition, MetricDefinition } from "@onegenui/components";
 *
 * const catalog = createCatalogFromComponents(
 *   { Card: CardDefinition, Metric: MetricDefinition },
 *   { name: "my-catalog" }
 * );
 * ```
 */
declare function createCatalogFromComponents<T extends Record<string, TypedComponentDefinition>, TActions extends Record<string, ActionDefinition> = Record<string, ActionDefinition>, TFunctions extends Record<string, ValidationFunction> = Record<string, ValidationFunction>>(definitions: T, options?: CreateCatalogFromComponentsOptions<TActions, TFunctions>): Catalog<{
    [K in keyof T]: ComponentDefinition<T[K]["props"]>;
}, TActions, TFunctions>;

/**
 * Info about native browser text selection
 */
interface TextSelectionForPrompt {
    /** The selected text */
    text: string;
    /** The JSON-UI element key containing the selection */
    elementKey?: string;
    /** The component type */
    elementType?: string;
}
/**
 * Layout info for prompt generation
 */
interface LayoutInfoForPrompt {
    elementKey: string;
    elementType: string;
    size?: {
        width?: number | string;
        height?: number | string;
    };
    grid?: {
        column?: number;
        row?: number;
        columnSpan?: number;
        rowSpan?: number;
    };
    resizable?: boolean;
}
/**
 * Action type for tracked user actions
 */
type TrackedActionType = "toggle" | "input" | "select" | "click" | "complete" | "create" | "delete" | "update" | "submit" | "expand" | "collapse" | "drag" | "drop";
/**
 * Tracked action interface for prompt generation
 */
interface TrackedActionForPrompt {
    type: TrackedActionType;
    elementKey: string;
    elementType: string;
    timestamp: number;
    context?: {
        itemId?: string;
        itemIndex?: number;
        itemLabel?: string;
        previousValue?: unknown;
        newValue?: unknown;
    };
}
/**
 * Generate context-aware prompt additions for tree state
 */
declare function generateTreeContextPrompt(tree: unknown, options?: {
    isPruned?: boolean;
    totalElements?: number;
}): string;
/**
 * Generate context-aware prompt additions for selection
 */
declare function generateSelectionContextPrompt(selection: {
    key: string;
    subItems?: string[];
}, hasSubItems: boolean): string;
/**
 * Generate deep selection context prompt
 */
declare function generateDeepSelectionPrompt(deepSelections: Array<{
    textContent: string;
    itemId?: string;
    selectionType: string;
    elementKey?: string;
}>): string;
/**
 * Generate prompt section for native text selection
 */
declare function generateTextSelectionPrompt(textSelection: TextSelectionForPrompt): string;
/**
 * Generate prompt section for layout-aware operations
 */
declare function generateLayoutContextPrompt(layouts: LayoutInfoForPrompt[]): string;
/**
 * Generate context-aware prompt for recent user actions (proactivity)
 */
declare function generateActionsContextPrompt(actions: TrackedActionForPrompt[]): string;

/**
 * Configuration for prompt generation
 */
interface PromptGeneratorConfig {
    /** Custom intro text before component list */
    introText?: string;
    /** Include streaming strategy hints */
    includeStreamingStrategy?: boolean;
    /** Include selection context rules */
    includeSelectionRules?: boolean;
    /** Include message rules */
    includeMessageRules?: boolean;
    /** Include layout rules for spacing */
    includeLayoutRules?: boolean;
    /** Include interactive AI rules (questions, suggestions) */
    includeInteractiveRules?: boolean;
    /** Include proactivity rules */
    includeProactivityRules?: boolean;
    /** Data collection preference: form or text */
    dataCollectionPreferForm?: boolean;
    /** Custom component-specific rules */
    componentRules?: Record<string, string>;
    /** Skills content from skills.md files (component name -> content) */
    skills?: Record<string, string>;
    /** Additional sections to append before the final prompt line */
    extraSections?: string[];
    /** Final prompt line (defaults to "Generate JSONL patches now:") */
    outroText?: string;
}
/**
 * Generate a complete system prompt from a catalog
 */
declare function generateSystemPrompt<TComponents extends Record<string, ComponentDefinition>, TActions extends Record<string, ActionDefinition> = Record<string, ActionDefinition>, TFunctions extends Record<string, ValidationFunction> = Record<string, ValidationFunction>>(catalog: Catalog<TComponents, TActions, TFunctions>, config?: PromptGeneratorConfig): string;

/**
 * Streaming Schemas - Zod schemas for structured streaming output
 */

declare const UIElementMetaSchema: z.ZodObject<{
    turnId: z.ZodString;
    sequence: z.ZodNumber;
    createdAt: z.ZodNumber;
    updatedAt: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
declare const StreamPatchSchema: z.ZodObject<{
    op: z.ZodEnum<{
        add: "add";
        remove: "remove";
        replace: "replace";
        move: "move";
        copy: "copy";
        test: "test";
    }>;
    path: z.ZodString;
    value: z.ZodOptional<z.ZodUnknown>;
    from: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const PatchMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"patch">;
    patches: z.ZodArray<z.ZodObject<{
        op: z.ZodEnum<{
            add: "add";
            remove: "remove";
            replace: "replace";
            move: "move";
            copy: "copy";
            test: "test";
        }>;
        path: z.ZodString;
        value: z.ZodOptional<z.ZodUnknown>;
        from: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    targetPath: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const ChatMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"message">;
    role: z.ZodEnum<{
        assistant: "assistant";
        user: "user";
        system: "system";
    }>;
    content: z.ZodString;
    id: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
declare const QuestionMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"question">;
    questionId: z.ZodString;
    prompt: z.ZodString;
    options: z.ZodOptional<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        value: z.ZodString;
    }, z.core.$strip>>>;
    inputType: z.ZodOptional<z.ZodEnum<{
        number: "number";
        date: "date";
        select: "select";
        text: "text";
        multiselect: "multiselect";
    }>>;
    required: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
declare const SuggestionMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"suggestion">;
    suggestions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        action: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const ToolProgressMessageSchema: z.ZodObject<{
    type: z.ZodLiteral<"tool-progress">;
    toolId: z.ZodString;
    toolName: z.ZodString;
    status: z.ZodEnum<{
        complete: "complete";
        error: "error";
        pending: "pending";
        running: "running";
    }>;
    progress: z.ZodOptional<z.ZodNumber>;
    message: z.ZodOptional<z.ZodString>;
    result: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strip>;
declare const StreamControlSchema: z.ZodObject<{
    type: z.ZodLiteral<"control">;
    action: z.ZodEnum<{
        error: "error";
        abort: "abort";
        start: "start";
        end: "end";
    }>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        recoverable: z.ZodBoolean;
    }, z.core.$strip>>;
}, z.core.$strip>;
declare const StreamMessageSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"patch">;
    patches: z.ZodArray<z.ZodObject<{
        op: z.ZodEnum<{
            add: "add";
            remove: "remove";
            replace: "replace";
            move: "move";
            copy: "copy";
            test: "test";
        }>;
        path: z.ZodString;
        value: z.ZodOptional<z.ZodUnknown>;
        from: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    targetPath: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"message">;
    role: z.ZodEnum<{
        assistant: "assistant";
        user: "user";
        system: "system";
    }>;
    content: z.ZodString;
    id: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"question">;
    questionId: z.ZodString;
    prompt: z.ZodString;
    options: z.ZodOptional<z.ZodArray<z.ZodObject<{
        label: z.ZodString;
        value: z.ZodString;
    }, z.core.$strip>>>;
    inputType: z.ZodOptional<z.ZodEnum<{
        number: "number";
        date: "date";
        select: "select";
        text: "text";
        multiselect: "multiselect";
    }>>;
    required: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"suggestion">;
    suggestions: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        label: z.ZodString;
        action: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"tool-progress">;
    toolId: z.ZodString;
    toolName: z.ZodString;
    status: z.ZodEnum<{
        complete: "complete";
        error: "error";
        pending: "pending";
        running: "running";
    }>;
    progress: z.ZodOptional<z.ZodNumber>;
    message: z.ZodOptional<z.ZodString>;
    result: z.ZodOptional<z.ZodUnknown>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"control">;
    action: z.ZodEnum<{
        error: "error";
        abort: "abort";
        start: "start";
        end: "end";
    }>;
    error: z.ZodOptional<z.ZodObject<{
        code: z.ZodString;
        message: z.ZodString;
        recoverable: z.ZodBoolean;
    }, z.core.$strip>>;
}, z.core.$strip>], "type">;
declare const StreamFrameSchema: z.ZodObject<{
    version: z.ZodLiteral<"2.0">;
    timestamp: z.ZodNumber;
    correlationId: z.ZodString;
    sequence: z.ZodNumber;
    message: z.ZodDiscriminatedUnion<[z.ZodObject<{
        type: z.ZodLiteral<"patch">;
        patches: z.ZodArray<z.ZodObject<{
            op: z.ZodEnum<{
                add: "add";
                remove: "remove";
                replace: "replace";
                move: "move";
                copy: "copy";
                test: "test";
            }>;
            path: z.ZodString;
            value: z.ZodOptional<z.ZodUnknown>;
            from: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        targetPath: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"message">;
        role: z.ZodEnum<{
            assistant: "assistant";
            user: "user";
            system: "system";
        }>;
        content: z.ZodString;
        id: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"question">;
        questionId: z.ZodString;
        prompt: z.ZodString;
        options: z.ZodOptional<z.ZodArray<z.ZodObject<{
            label: z.ZodString;
            value: z.ZodString;
        }, z.core.$strip>>>;
        inputType: z.ZodOptional<z.ZodEnum<{
            number: "number";
            date: "date";
            select: "select";
            text: "text";
            multiselect: "multiselect";
        }>>;
        required: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"suggestion">;
        suggestions: z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            label: z.ZodString;
            action: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"tool-progress">;
        toolId: z.ZodString;
        toolName: z.ZodString;
        status: z.ZodEnum<{
            complete: "complete";
            error: "error";
            pending: "pending";
            running: "running";
        }>;
        progress: z.ZodOptional<z.ZodNumber>;
        message: z.ZodOptional<z.ZodString>;
        result: z.ZodOptional<z.ZodUnknown>;
    }, z.core.$strip>, z.ZodObject<{
        type: z.ZodLiteral<"control">;
        action: z.ZodEnum<{
            error: "error";
            abort: "abort";
            start: "start";
            end: "end";
        }>;
        error: z.ZodOptional<z.ZodObject<{
            code: z.ZodString;
            message: z.ZodString;
            recoverable: z.ZodBoolean;
        }, z.core.$strip>>;
    }, z.core.$strip>], "type">;
}, z.core.$strip>;
declare const UIElementBaseSchema: z.ZodObject<{
    key: z.ZodString;
    type: z.ZodString;
    props: z.ZodRecord<z.ZodString, z.ZodUnknown>;
    parentKey: z.ZodOptional<z.ZodString>;
    layout: z.ZodOptional<z.ZodObject<{
        grid: z.ZodOptional<z.ZodObject<{
            column: z.ZodOptional<z.ZodNumber>;
            row: z.ZodOptional<z.ZodNumber>;
            columnSpan: z.ZodOptional<z.ZodNumber>;
            rowSpan: z.ZodOptional<z.ZodNumber>;
        }, z.core.$strip>>;
        size: z.ZodOptional<z.ZodObject<{
            width: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
            height: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
            minWidth: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
            maxWidth: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
            minHeight: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
            maxHeight: z.ZodOptional<z.ZodUnion<readonly [z.ZodNumber, z.ZodString]>>;
        }, z.core.$strip>>;
        resizable: z.ZodOptional<z.ZodBoolean>;
    }, z.core.$strip>>;
    visible: z.ZodOptional<z.ZodBoolean>;
    locked: z.ZodOptional<z.ZodBoolean>;
    _meta: z.ZodOptional<z.ZodObject<{
        turnId: z.ZodString;
        sequence: z.ZodNumber;
        createdAt: z.ZodNumber;
        updatedAt: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
}, z.core.$strip>;
type UIElementInput = z.input<typeof UIElementBaseSchema> & {
    children?: UIElementInput[];
};
declare const UIElementSchema: z.ZodType<UIElementInput>;

/**
 * Streaming Types - TypeScript types derived from schemas
 */

type StreamFrame = z.infer<typeof StreamFrameSchema>;
type StreamMessage = z.infer<typeof StreamMessageSchema>;
type StreamPatch = z.infer<typeof StreamPatchSchema>;
type StreamControl = z.infer<typeof StreamControlSchema>;
type UIElementMeta = z.infer<typeof UIElementMetaSchema>;
interface PatchMessage {
    type: "patch";
    patches: StreamPatch[];
    targetPath?: string;
}
interface ChatMessage {
    type: "message";
    role: "user" | "assistant" | "system";
    content: string;
    id?: string;
}
interface QuestionMessage {
    type: "question";
    questionId: string;
    prompt: string;
    options?: Array<{
        label: string;
        value: string;
    }>;
    inputType?: "text" | "select" | "multiselect" | "number" | "date";
    required?: boolean;
}
interface SuggestionMessage {
    type: "suggestion";
    suggestions: Array<{
        id: string;
        label: string;
        action?: string;
    }>;
}
interface ToolProgressMessage {
    type: "tool-progress";
    toolId: string;
    toolName: string;
    status: "pending" | "running" | "complete" | "error";
    progress?: number;
    message?: string;
    result?: unknown;
}
interface ControlMessage {
    type: "control";
    action: "start" | "end" | "error" | "abort";
    error?: {
        code: string;
        message: string;
        recoverable: boolean;
    };
}
interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
    warnings: ValidationWarning[];
}
interface ValidationError {
    path: string;
    code: string;
    message: string;
}
interface ValidationWarning {
    path: string;
    code: string;
    message: string;
    autoFixed?: boolean;
}
interface StreamOptions {
    timeout?: number;
    retries?: number;
    validateFrames?: boolean;
    bufferSize?: number;
}
interface StreamConnection {
    id: string;
    url: string;
    status: "connecting" | "connected" | "disconnected" | "error";
    lastSequence: number;
}

declare class StreamValidationPipeline {
    private componentTypes;
    constructor(registeredComponents?: string[]);
    /**
     * Register component types for validation
     */
    registerComponentTypes(types: string[]): void;
    /**
     * Validate a complete stream frame
     */
    validateFrame(data: unknown): ValidationResult;
    /**
     * Validate a stream message
     */
    validateMessage(data: unknown): ValidationResult;
    /**
     * Validate a single patch operation
     */
    validatePatch(patch: unknown): ValidationResult;
    /**
     * Validate a UI element against catalog
     */
    validateElement(element: unknown): ValidationResult;
    /**
     * Parse and validate with auto-fix for recoverable errors
     */
    parseWithRecovery(data: unknown): {
        frame: StreamFrame | null;
        validation: ValidationResult;
        recovered: boolean;
    };
    /**
     * Try to auto-fix common issues
     */
    private tryAutoFix;
}
declare function createValidationPipeline(componentTypes?: string[]): StreamValidationPipeline;

/**
 * Patch Buffer - Handles out-of-order patch reordering
 */

interface FlushResult {
    frames: StreamFrame[];
    gaps: number[];
}
declare class PatchBuffer {
    private buffer;
    private expectedSequence;
    private readonly maxBufferSize;
    private readonly gapTimeout;
    private readonly flushInterval;
    private flushTimer;
    private onFlush;
    constructor(options?: {
        maxBufferSize?: number;
        gapTimeout?: number;
        flushInterval?: number;
    });
    /**
     * Set flush callback
     */
    setOnFlush(callback: (frames: StreamFrame[]) => void): void;
    /**
     * Add a frame to the buffer
     */
    add(frame: StreamFrame): void;
    /**
     * Schedule a flush
     */
    private scheduleFlush;
    /**
     * Flush in-order frames
     */
    flush(): FlushResult;
    /**
     * Force flush with gap handling
     */
    forceFlush(): FlushResult;
    /**
     * Reset buffer state
     */
    reset(): void;
    /**
     * Get buffer statistics
     */
    getStats(): {
        bufferedCount: number;
        expectedSequence: number;
        oldestAge: number;
    };
}
declare function createPatchBuffer(options?: {
    maxBufferSize?: number;
    gapTimeout?: number;
    flushInterval?: number;
}): PatchBuffer;

/**
 * Placeholder Manager - Handles forward-reference resolution
 */

interface ResolutionResult {
    resolved: boolean;
    element: UIElement | null;
    dependents: string[];
}
declare class PlaceholderManager {
    private placeholders;
    private pendingElements;
    private readonly timeout;
    constructor(options?: {
        timeout?: number;
    });
    /**
     * Create a placeholder for a forward-referenced element
     */
    createPlaceholder(key: string, parentKey: string | null): UIElement;
    /**
     * Check if a key is a placeholder
     */
    isPlaceholder(key: string): boolean;
    /**
     * Register that an element references a placeholder
     */
    addReference(placeholderKey: string, referencingKey: string): void;
    /**
     * Resolve a placeholder with the real element
     */
    resolve(key: string, element: UIElement): ResolutionResult;
    /**
     * Check for timed-out placeholders
     */
    checkTimeouts(): string[];
    /**
     * Remove timed-out placeholders
     */
    pruneTimedOut(): string[];
    /**
     * Get all pending placeholders
     */
    getPendingPlaceholders(): string[];
    /**
     * Get statistics
     */
    getStats(): {
        placeholderCount: number;
        pendingCount: number;
        oldestAge: number;
    };
    /**
     * Reset manager state
     */
    reset(): void;
}
declare function createPlaceholderManager(options?: {
    timeout?: number;
}): PlaceholderManager;

/**
 * Streaming Ports - Hexagonal architecture ports for streaming
 */

/**
 * Port for receiving stream data
 */
interface StreamSourcePort {
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
    subscribe(callback: (frame: StreamFrame) => void): () => void;
    /**
     * Subscribe to errors
     */
    onError(callback: (error: Error) => void): () => void;
    /**
     * Get connection status
     */
    isConnected(): boolean;
}
/**
 * Port for emitting stream data
 */
interface StreamSinkPort {
    /**
     * Send a frame to the stream
     */
    send(frame: StreamFrame): Promise<void>;
    /**
     * Send a message (will be wrapped in a frame)
     */
    sendMessage(message: StreamMessage): Promise<void>;
    /**
     * Flush any buffered data
     */
    flush(): Promise<void>;
    /**
     * Close the stream
     */
    close(): Promise<void>;
}
/**
 * Port for validating stream data
 */
interface ValidationPort {
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
        frame: StreamFrame | null;
        validation: ValidationResult;
        recovered: boolean;
    };
    /**
     * Register component types for validation
     */
    registerComponentTypes(types: string[]): void;
}
/**
 * Port for persisting stream state
 */
interface StreamPersistencePort {
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
interface StreamState {
    sessionId: string;
    lastSequence: number;
    pendingFrames: StreamFrame[];
    timestamp: number;
}
/**
 * Port for stream telemetry/observability
 */
interface StreamTelemetryPort {
    /**
     * Record a frame received event
     */
    recordFrameReceived(frame: StreamFrame): void;
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
    recordRecovery(frame: StreamFrame): void;
    /**
     * Get metrics
     */
    getMetrics(): StreamMetrics;
}
/**
 * Stream metrics
 */
interface StreamMetrics {
    framesReceived: number;
    framesValidated: number;
    validationErrors: number;
    recoveries: number;
    sequenceGaps: number;
    averageLatency: number;
}
declare const noopStreamSource: StreamSourcePort;
declare const noopStreamSink: StreamSinkPort;
declare const noopStreamPersistence: StreamPersistencePort;
declare const noopStreamTelemetry: StreamTelemetryPort;

/**
 * Storage Port - Generic persistence abstraction
 */
/**
 * Paginated result for queries
 */
interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
}
/**
 * Pagination options
 */
interface PaginationOptions {
    page?: number;
    pageSize?: number;
}
/**
 * Sort options
 */
interface SortOptions<T> {
    sortBy?: keyof T;
    sortOrder?: "asc" | "desc";
}
/**
 * Generic storage port for CRUD operations
 */
interface StoragePort<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
    getAll(options?: PaginationOptions & SortOptions<T>): Promise<PaginatedResult<T>>;
    getById(id: string): Promise<T | null>;
    create(input: TCreate): Promise<T>;
    update(id: string, updates: TUpdate): Promise<T | null>;
    delete(id: string): Promise<void>;
    deleteMany(ids: string[]): Promise<void>;
    exists(id: string): Promise<boolean>;
    count(): Promise<number>;
}
/**
 * User-scoped storage port (multi-tenant)
 */
interface UserScopedStoragePort<T, TCreate = Partial<T>, TUpdate = Partial<T>> {
    getAll(userId: string, options?: PaginationOptions & SortOptions<T>): Promise<PaginatedResult<T>>;
    getById(id: string, userId: string): Promise<T | null>;
    create(input: TCreate & {
        userId: string;
    }): Promise<T>;
    update(id: string, userId: string, updates: TUpdate): Promise<T | null>;
    delete(id: string, userId: string): Promise<void>;
    deleteMany(ids: string[], userId: string): Promise<void>;
    exists(id: string, userId: string): Promise<boolean>;
    count(userId: string): Promise<number>;
}

/**
 * Cache Port - Caching abstraction
 */
/**
 * Cache entry with metadata
 */
interface CacheEntry<T> {
    value: T;
    expiresAt?: number;
    createdAt: number;
    tags?: string[];
}
/**
 * Cache options
 */
interface CacheOptions {
    ttl?: number;
    tags?: string[];
}
/**
 * Cache statistics
 */
interface CacheStats {
    hits: number;
    misses: number;
    size: number;
    maxSize: number;
}
/**
 * Generic cache port
 */
interface CachePort<T = unknown> {
    get(key: string): Promise<T | null>;
    set(key: string, value: T, options?: CacheOptions): Promise<void>;
    delete(key: string): Promise<void>;
    has(key: string): Promise<boolean>;
    clear(): Promise<void>;
    invalidateByTag(tag: string): Promise<void>;
    getStats(): Promise<CacheStats>;
}
/**
 * Multi-level cache port (L1: memory, L2: storage)
 */
interface MultiLevelCachePort<T = unknown> extends CachePort<T> {
    getWithFallback(key: string, fallback: () => Promise<T>): Promise<T>;
    warmup(keys: string[]): Promise<void>;
    getLevel(level: number): CachePort<T> | null;
}
/**
 * No-op cache implementation for testing
 */
declare const noopCache: CachePort;

/**
 * Memory/Recall Port - AI memory and context persistence
 */
/**
 * Memory item structure
 */
interface MemoryItem {
    id: string;
    content: string;
    embedding?: number[];
    metadata: {
        source: string;
        timestamp: number;
        importance?: number;
        tags?: string[];
    };
}
/**
 * Memory query options
 */
interface MemoryQueryOptions {
    limit?: number;
    minScore?: number;
    tags?: string[];
    since?: number;
}
/**
 * Memory query result
 */
interface MemoryQueryResult {
    items: Array<MemoryItem & {
        score: number;
    }>;
    totalMatches: number;
}
/**
 * Memory store port for AI context/recall
 */
interface MemoryStorePort {
    store(item: Omit<MemoryItem, "id">): Promise<MemoryItem>;
    recall(query: string, options?: MemoryQueryOptions): Promise<MemoryQueryResult>;
    forget(id: string): Promise<void>;
    forgetByTag(tag: string): Promise<void>;
    consolidate(): Promise<void>;
    getStats(): Promise<{
        totalItems: number;
        oldestTimestamp: number;
        newestTimestamp: number;
    }>;
}
/**
 * No-op memory store for testing
 */
declare const noopMemoryStore: MemoryStorePort;

/**
 * Sync Port - Offline/Online synchronization
 */
/**
 * Sync operation
 */
interface SyncOperation {
    id: string;
    type: "create" | "update" | "delete";
    entityType: string;
    entityId: string;
    payload: unknown;
    timestamp: number;
    retryCount: number;
}
/**
 * Sync status
 */
type SyncStatus = "idle" | "syncing" | "error" | "offline" | "conflict";
/**
 * Sync conflict
 */
interface SyncConflict {
    operationId: string;
    localData: unknown;
    remoteData: unknown;
    conflictType: "update-update" | "update-delete" | "delete-update";
}
/**
 * Conflict resolution strategy
 */
type ConflictResolution = "local-wins" | "remote-wins" | "merge" | "manual";
/**
 * Sync port for offline-first operations
 */
interface SyncPort {
    getStatus(): SyncStatus;
    getPendingOperations(): Promise<SyncOperation[]>;
    queueOperation(op: Omit<SyncOperation, "id" | "timestamp" | "retryCount">): Promise<string>;
    sync(): Promise<{
        synced: number;
        failed: number;
        conflicts: SyncConflict[];
    }>;
    resolveConflict(conflictId: string, resolution: ConflictResolution): Promise<void>;
    clearPending(): Promise<void>;
    onStatusChange(callback: (status: SyncStatus) => void): () => void;
}
/**
 * No-op sync port for testing
 */
declare const noopSync: SyncPort;

export { type Action, type ActionConfirm, ActionConfirmSchema, type ActionDefinition, type ActionExecutionContext, type ActionHandler, type ActionOnError, ActionOnErrorSchema, type ActionOnSuccess, ActionOnSuccessSchema, type ActionOptimisticConfig, ActionOptimisticConfigSchema, type ActionRetryConfig, ActionRetryConfigSchema, ActionSchema, type AuthState, type CacheEntry, type CacheOptions, type CachePort, type CacheStats, type Catalog, type CatalogConfig, type ChatMessage, ChatMessageSchema, type ComponentDefinition, type ComponentSchema, type ConflictResolution, type ControlMessage, type CreateCatalogFromComponentsOptions, type DataModel, type DefineComponentConfig, type DeviceState, type DocumentIndex, type DocumentIndexEvent, type DocumentIndexNode, type DynamicBoolean, DynamicBooleanSchema, type DynamicNumber, DynamicNumberSchema, type DynamicString, DynamicStringSchema, type DynamicValue, DynamicValueSchema, type ElementGridLayout, type ElementLayout, type ElementResizeConfig, type ElementSize, type FeatureFlags, type InferCatalogComponentProps, type InferComponentName, type InferComponentProps, type JsonPatch, type LayoutInfoForPrompt, type LogicExpression, LogicExpressionSchema, type MemoryItem, type MemoryQueryOptions, type MemoryQueryResult, type MemoryStorePort, type MultiLevelCachePort, type PaginatedResult, type PaginationOptions, PatchBuffer, type PatchMessage, PatchMessageSchema, type PatchOp, PlaceholderManager, type PromptGeneratorConfig, type QuestionMessage, QuestionMessageSchema, type ResolvedAction, type SortOptions, type StoragePort, type StreamConnection, type StreamControl, StreamControlSchema, type StreamEventType, type StreamFrame, StreamFrameSchema, type StreamMessage, StreamMessageSchema, type StreamMetrics, type StreamOptions, type StreamPatch, StreamPatchSchema, type StreamPersistencePort, type StreamSinkPort, type StreamSourcePort, type StreamState, type StreamTelemetryPort, StreamValidationPipeline, type SuggestionMessage, SuggestionMessageSchema, type SyncConflict, type SyncOperation, type SyncPort, type SyncStatus, type TextSelectionForPrompt, type ToolProgressEvent, type ToolProgressMessage, ToolProgressMessageSchema, type ToolProgressStatus, type TrackedActionForPrompt, type TrackedActionType, type TypedComponentDefinition, type UIElement, type UIElementMeta, UIElementMetaSchema, UIElementSchema, type UITree, type UserScopedStoragePort, type ValidationCheck, type ValidationCheckResult, ValidationCheckSchema, type ValidationConfig, ValidationConfigSchema, type ValidationContext, type ValidationError, type ValidationFunction, type ValidationFunctionDefinition, type ValidationMode, type ValidationPort, type ValidationResult$1 as ValidationResult, type ValidationWarning, type VisibilityCondition, VisibilityConditionSchema, type VisibilityContext, action, builtInValidationFunctions, check, createCatalog, createCatalogFromComponents, createPatchBuffer, createPlaceholderManager, createValidationPipeline, defineComponent, evaluateLogicExpression, evaluateVisibility, executeAction, generateActionsContextPrompt, generateCatalogPrompt, generateDeepSelectionPrompt, generateLayoutContextPrompt, generateSelectionContextPrompt, generateSystemPrompt, generateTextSelectionPrompt, generateTreeContextPrompt, interpolateString, noopCache, noopMemoryStore, noopStreamPersistence, noopStreamSink, noopStreamSource, noopStreamTelemetry, noopSync, resolveAction, resolveDynamicValue, runValidation, runValidationCheck, setByPath, toCatalogDefinition, toCatalogDefinitions, visibility };
