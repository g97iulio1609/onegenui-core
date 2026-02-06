import type { Catalog, ComponentDefinition } from "./catalog";
import type { TypedComponentDefinition } from "./component";
import type { ActionDefinition } from "./actions";
import type { ValidationFunction } from "./validation";

// Import from modular prompt utilities
import { describeZodSchema } from "./prompt/schema-describer";
import {
  generateStreamingStrategy,
  generateLayoutRules,
  generateMessageRules,
  generateSelectionRules,
  generateOutputFormat,
} from "./prompt/rules-generator";
import {
  generateInteractiveRules,
  generateProactivityRules,
} from "./prompt/interactive-rules";
import {
  generateTreeContextPrompt,
  generateSelectionContextPrompt,
  generateDeepSelectionPrompt,
  generateTextSelectionPrompt,
  generateLayoutContextPrompt,
  generateActionsContextPrompt,
} from "./prompt/context-prompts";
import {
  generateStructuredOutputPrompt,
  generateStructuredOutputFormat,
  generateComponentSchemas,
  generateValidationHints,
} from "./prompt/structured-output";

// Re-export for convenience
export {
  describeZodSchema,
  generateStreamingStrategy,
  generateLayoutRules,
  generateMessageRules,
  generateSelectionRules,
  generateOutputFormat,
  generateInteractiveRules,
  generateProactivityRules,
  generateTreeContextPrompt,
  generateSelectionContextPrompt,
  generateDeepSelectionPrompt,
  generateTextSelectionPrompt,
  generateLayoutContextPrompt,
  generateActionsContextPrompt,
  // New structured output exports
  generateStructuredOutputPrompt,
  generateStructuredOutputFormat,
  generateComponentSchemas,
  generateValidationHints,
};

export type {
  TextSelectionForPrompt,
  LayoutInfoForPrompt,
  TrackedActionType,
  TrackedActionForPrompt,
} from "./prompt/context-prompts";

export type { StructuredOutputConfig } from "./prompt/structured-output";

/**
 * Configuration for prompt generation
 */
export interface PromptGeneratorConfig {
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
  /** Filter to include only specific components (if set, only these names appear) */
  componentFilter?: string[];
  /** Additional sections to append before the final prompt line */
  extraSections?: string[];
  /** Final prompt line (defaults to "Generate JSONL patches now:") */
  outroText?: string;
}

/**
 * Generate component documentation from a definition
 */
function generateComponentDoc(
  name: string,
  definition: ComponentDefinition | TypedComponentDefinition,
): string {
  const propsDesc = describeZodSchema(definition.props);
  const desc = definition.description || "";
  const children = definition.hasChildren ? " (supports children)" : "";

  return `- ${name}: ${propsDesc}${children}${desc ? ` - ${desc}` : ""}`;
}

/**
 * Generate a complete system prompt from a catalog
 */
export function generateSystemPrompt<
  TComponents extends Record<string, ComponentDefinition>,
  TActions extends Record<string, ActionDefinition> = Record<
    string,
    ActionDefinition
  >,
  TFunctions extends Record<string, ValidationFunction> = Record<
    string,
    ValidationFunction
  >,
>(
  catalog: Catalog<TComponents, TActions, TFunctions>,
  config: PromptGeneratorConfig = {},
): string {
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
    componentFilter,
    extraSections = [],
    outroText = "Generate JSONL patches now:",
  } = config;

  const lines: string[] = [introText, ""];

  // Filter component names if componentFilter is provided
  const activeComponents = componentFilter
    ? catalog.componentNames.filter((n) => componentFilter.includes(String(n)))
    : catalog.componentNames;

  // Component list
  lines.push("AVAILABLE COMPONENTS:");
  lines.push(activeComponents.map(String).join(", "));
  lines.push("");

  // Component details
  lines.push("COMPONENT DETAILS:");
  for (const name of activeComponents) {
    const def = catalog.components[name];
    if (def) {
      lines.push(generateComponentDoc(String(name), def));
    }
  }
  lines.push("");

  // Skills (from skills.md files)
  const skillsWithContent = Object.entries(skills).filter(
    ([, content]) => content && content.trim(),
  );
  if (skillsWithContent.length > 0) {
    lines.push("COMPONENT AI HINTS:");
    for (const [name, content] of skillsWithContent) {
      lines.push(`\n### ${name}`);
      lines.push(content.trim());
    }
    lines.push("");
  }

  // Output format
  lines.push(generateOutputFormat());

  // Layout rules
  if (includeLayoutRules) {
    lines.push(generateLayoutRules());
  }

  // Streaming strategy
  if (includeStreamingStrategy) {
    lines.push(generateStreamingStrategy());
  }

  // Message rules
  if (includeMessageRules) {
    lines.push(generateMessageRules());
  }

  // Selection rules
  if (includeSelectionRules) {
    lines.push(generateSelectionRules());
  }

  // Interactive AI rules (questions, suggestions)
  if (includeInteractiveRules) {
    lines.push(generateInteractiveRules(dataCollectionPreferForm));
  }

  // Proactivity rules
  if (includeProactivityRules) {
    lines.push(generateProactivityRules());
  }

  // Custom component rules
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
