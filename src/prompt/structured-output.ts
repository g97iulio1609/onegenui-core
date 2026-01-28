/**
 * Structured Output Prompt Generator
 *
 * Generates prompts optimized for structured JSON output with streaming support.
 */
import type { Catalog, ComponentDefinition } from "../catalog";
import type { TypedComponentDefinition } from "../component";
import type { ActionDefinition } from "../actions";
import type { ValidationFunction } from "../validation";
import { describeZodSchema } from "./schema-describer";

/**
 * Configuration for structured output prompt generation
 */
export interface StructuredOutputConfig {
  /** Enable streaming frame format (with sequence numbers) */
  streaming?: boolean;
  /** Include validation hints */
  includeValidationHints?: boolean;
  /** Maximum nesting depth for UI elements */
  maxNestingDepth?: number;
  /** Include sequence ordering rules */
  includeSequenceRules?: boolean;
}

/**
 * Generate structured output format rules
 */
export function generateStructuredOutputFormat(
  config: StructuredOutputConfig = {},
): string {
  const {
    streaming = true,
    includeSequenceRules = true,
    maxNestingDepth = 5,
  } = config;

  const lines: string[] = [];

  lines.push("STRUCTURED OUTPUT FORMAT:");
  lines.push("");
  lines.push("Output JSONL where each line is a complete JSON object.");
  lines.push(
    "Each line MUST be valid JSON - no trailing commas, proper quotes.",
  );
  lines.push("");

  if (streaming) {
    lines.push("FRAME STRUCTURE:");
    lines.push("Each line represents a stream frame with this structure:");
    lines.push(
      JSON.stringify(
        {
          version: "2.0",
          timestamp: "<unix_ms>",
          correlationId: "<uuid>",
          sequence: "<number>",
          message: { type: "<message_type>", "...": "message-specific-fields" },
        },
        null,
        2,
      ),
    );
    lines.push("");

    lines.push("MESSAGE TYPES:");
    lines.push("- patch: UI modification operation");
    lines.push("- message: Conversational text to user");
    lines.push("- question: Ask user for input");
    lines.push("- suggestion: Offer clickable suggestions");
    lines.push("- tool-progress: Report tool execution status");
    lines.push("- control: Stream lifecycle (start, end, error)");
    lines.push("");
  }

  if (includeSequenceRules) {
    lines.push("SEQUENCE RULES:");
    lines.push("1. Start sequence at 0, increment by 1 for each frame");
    lines.push("2. Never skip sequence numbers");
    lines.push("3. Never repeat sequence numbers");
    lines.push("4. Client uses sequence to order out-of-order frames");
    lines.push("");
  }

  lines.push("PATCH MESSAGE FORMAT:");
  lines.push(
    JSON.stringify(
      {
        type: "patch",
        patches: [
          {
            op: "add",
            path: "/elements/key",
            value: { key: "...", type: "...", props: {} },
          },
        ],
      },
      null,
      2,
    ),
  );
  lines.push("");

  lines.push("CHAT MESSAGE FORMAT:");
  lines.push(
    JSON.stringify(
      {
        type: "message",
        role: "assistant",
        content: "Explanatory text here",
      },
      null,
      2,
    ),
  );
  lines.push("");

  lines.push(`NESTING: Maximum ${maxNestingDepth} levels of nesting allowed.`);
  lines.push("");

  return lines.join("\n");
}

/**
 * Generate component schema hints for structured output
 */
export function generateComponentSchemas<
  TComponents extends Record<string, ComponentDefinition>,
>(components: TComponents): string {
  const lines: string[] = [];

  lines.push("COMPONENT SCHEMAS:");
  lines.push("");

  for (const [name, def] of Object.entries(components)) {
    const typedDef = def as ComponentDefinition | TypedComponentDefinition;
    const propsDesc = describeZodSchema(typedDef.props);
    const desc = typedDef.description || "";
    const children = typedDef.hasChildren
      ? " (children: array of element keys)"
      : "";

    lines.push(`${name}:`);
    lines.push(`  props: ${propsDesc}`);
    if (desc) lines.push(`  description: ${desc}`);
    if (children) lines.push(`  ${children.trim()}`);
    lines.push("");
  }

  return lines.join("\n");
}

/**
 * Generate validation hints for structured output
 */
export function generateValidationHints(): string {
  return `
VALIDATION REQUIREMENTS:
- Every element MUST have: key (string), type (string), props (object)
- Keys must be unique within the response
- Type must match a component from the catalog
- Props must match the component's schema
- Children (if present) must be an array of valid element keys
- Forward references: can reference elements not yet created, they'll be resolved

COMMON ERRORS TO AVOID:
- Missing required props for component type
- Invalid prop types (string where number expected)
- Circular children references
- Keys with special characters (use alphanumeric + hyphen only)
- Empty type strings`;
}

/**
 * Generate a complete structured output system prompt
 */
export function generateStructuredOutputPrompt<
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
  config: StructuredOutputConfig = {},
): string {
  const { includeValidationHints = true, streaming = true } = config;

  const lines: string[] = [];

  lines.push("You generate structured UI updates as JSONL frames.");
  lines.push("");
  lines.push(
    "AVAILABLE COMPONENTS: " + catalog.componentNames.map(String).join(", "),
  );
  lines.push("");
  lines.push(generateComponentSchemas(catalog.components));
  lines.push(generateStructuredOutputFormat(config));

  if (includeValidationHints) {
    lines.push(generateValidationHints());
  }

  if (streaming) {
    lines.push(`
STREAMING STRATEGY:
1. Send control frame with action:"start" as first frame
2. Send message frame explaining what you're building
3. Create containers with empty children arrays
4. Add child elements, then append to parent's children
5. Send control frame with action:"end" as last frame

EXAMPLE STREAM:
{"version":"2.0","timestamp":1234567890,"correlationId":"abc-123","sequence":0,"message":{"type":"control","action":"start"}}
{"version":"2.0","timestamp":1234567891,"correlationId":"abc-123","sequence":1,"message":{"type":"message","role":"assistant","content":"Creating your dashboard..."}}
{"version":"2.0","timestamp":1234567892,"correlationId":"abc-123","sequence":2,"message":{"type":"patch","patches":[{"op":"set","path":"/root","value":"main"}]}}
{"version":"2.0","timestamp":1234567893,"correlationId":"abc-123","sequence":3,"message":{"type":"patch","patches":[{"op":"add","path":"/elements/main","value":{"key":"main","type":"Stack","props":{"gap":"lg"},"children":[]}}]}}
...
{"version":"2.0","timestamp":1234567899,"correlationId":"abc-123","sequence":10,"message":{"type":"control","action":"end"}}`);
  }

  lines.push("");
  lines.push("Generate JSONL frames now:");

  return lines.join("\n");
}
