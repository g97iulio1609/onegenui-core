import { z } from "zod";
import type { ComponentSchema, ValidationMode } from "./types";
import type { ComponentDefinition, Catalog, CatalogConfig } from "./catalog";
import { createCatalog } from "./catalog";
import type { ActionDefinition } from "./actions";
import type { ValidationFunction } from "./validation";

/**
 * Configuration for defineComponent
 */
export interface DefineComponentConfig<
  TName extends string,
  TProps extends ComponentSchema,
> {
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
export interface TypedComponentDefinition<
  TName extends string = string,
  TProps extends ComponentSchema = ComponentSchema,
> extends ComponentDefinition<TProps> {
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
export function defineComponent<
  TName extends string,
  TProps extends ComponentSchema,
>(
  config: DefineComponentConfig<TName, TProps>,
): TypedComponentDefinition<TName, TProps> {
  const {
    name,
    props,
    description,
    hasChildren = false,
    category,
    aiHints,
  } = config;

  return {
    name,
    props,
    description,
    hasChildren,
    category,
    aiHints,
  };
}

/**
 * Infer props type from a component definition
 */
export type InferComponentProps<T extends TypedComponentDefinition> = z.infer<
  T["props"]
>;

/**
 * Infer component name from a component definition
 */
export type InferComponentName<T extends TypedComponentDefinition> = T["name"];

/**
 * Convert a typed component definition to a catalog-compatible format
 */
export function toCatalogDefinition<T extends TypedComponentDefinition>(
  definition: T,
): ComponentDefinition<T["props"]> {
  return {
    props: definition.props,
    description: definition.description,
    hasChildren: definition.hasChildren,
  };
}

/**
 * Convert multiple typed component definitions to catalog-compatible format
 */
export function toCatalogDefinitions<
  T extends Record<string, TypedComponentDefinition>,
>(definitions: T): { [K in keyof T]: ComponentDefinition<T[K]["props"]> } {
  const result = {} as { [K in keyof T]: ComponentDefinition<T[K]["props"]> };

  for (const key of Object.keys(definitions)) {
    const def = definitions[key];
    if (def) {
      result[key as keyof T] = {
        props: def.props,
        description: def.description,
        hasChildren: def.hasChildren,
      };
    }
  }

  return result;
}

/**
 * Options for createCatalogFromComponents
 */
export interface CreateCatalogFromComponentsOptions<
  TActions extends Record<string, ActionDefinition> = Record<
    string,
    ActionDefinition
  >,
  TFunctions extends Record<string, ValidationFunction> = Record<
    string,
    ValidationFunction
  >,
> {
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
export function createCatalogFromComponents<
  T extends Record<string, TypedComponentDefinition>,
  TActions extends Record<string, ActionDefinition> = Record<
    string,
    ActionDefinition
  >,
  TFunctions extends Record<string, ValidationFunction> = Record<
    string,
    ValidationFunction
  >,
>(
  definitions: T,
  options: CreateCatalogFromComponentsOptions<TActions, TFunctions> = {},
): Catalog<
  { [K in keyof T]: ComponentDefinition<T[K]["props"]> },
  TActions,
  TFunctions
> {
  const catalogDefinitions = toCatalogDefinitions(definitions);

  const config: CatalogConfig<
    { [K in keyof T]: ComponentDefinition<T[K]["props"]> },
    TActions,
    TFunctions
  > = {
    name: options.name,
    components: catalogDefinitions,
    actions: options.actions,
    functions: options.functions,
    validation: options.validation,
  };

  return createCatalog(config);
}
