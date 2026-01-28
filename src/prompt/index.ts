/**
 * Prompt generation module
 * Centralized exports for all prompt-related utilities
 */

export { describeZodSchema, describeZodType } from "./schema-describer";

export {
  generateStreamingStrategy,
  generateLayoutRules,
  generateMessageRules,
  generateSelectionRules,
  generateOutputFormat,
} from "./rules-generator";

export {
  generateInteractiveRules,
  generateProactivityRules,
} from "./interactive-rules";

export {
  generateTreeContextPrompt,
  generateSelectionContextPrompt,
  generateDeepSelectionPrompt,
  generateTextSelectionPrompt,
  generateLayoutContextPrompt,
  generateActionsContextPrompt,
} from "./context-prompts";

export type {
  TextSelectionForPrompt,
  LayoutInfoForPrompt,
  TrackedActionType,
  TrackedActionForPrompt,
} from "./context-prompts";
