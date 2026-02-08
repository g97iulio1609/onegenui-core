import { z } from "zod";
import { JsonPatchSchema } from "../types";

type JsonPatchInput = z.input<typeof JsonPatchSchema>;

const ELEMENT_ROOT_PATH_REGEX = /^\/elements\/[^/]+$/;
const ELEMENT_PATH_REGEX = /^\/elements\/.+/;
const CHILDREN_APPEND_PATH_REGEX = /^\/elements\/[^/]+\/children(?:\/-|\/\d+)$/;
const CHILDREN_COLLECTION_PATH_REGEX = /^\/elements\/[^/]+\/children$/;

const UiElementPatchValueSchema = z
  .object({
    key: z.string().min(1),
    type: z.string().min(1),
    props: z.record(z.string(), z.unknown()),
    children: z.array(z.string()).optional(),
  })
  .passthrough();

function isStringifiedJson(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return false;
  try {
    const parsed = JSON.parse(trimmed);
    return parsed !== null && typeof parsed === "object";
  } catch {
    return false;
  }
}

function parseStringifiedJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export function normalizeUiPatch<TPatch extends JsonPatchInput>(
  patch: TPatch,
): TPatch {
  if (!patch || typeof patch !== "object") {
    return patch;
  }

  const normalized: JsonPatchInput = { ...patch };
  const path = normalized.path;

  if (typeof path !== "string" || typeof normalized.value !== "string") {
    return normalized as TPatch;
  }

  if (
    ELEMENT_ROOT_PATH_REGEX.test(path) &&
    isStringifiedJson(normalized.value)
  ) {
    normalized.value = parseStringifiedJson(normalized.value);
    return normalized as TPatch;
  }

  if (
    CHILDREN_COLLECTION_PATH_REGEX.test(path) &&
    isStringifiedJson(normalized.value)
  ) {
    const parsed = parseStringifiedJson(normalized.value);
    if (Array.isArray(parsed)) {
      normalized.value = parsed;
    }
    return normalized as TPatch;
  }

  return normalized as TPatch;
}

export function validateUiPatchContract(patch: JsonPatchInput): string[] {
  const errors: string[] = [];
  const elementPathParts = patch.path?.split("/");
  const elementKeyFromPath =
    elementPathParts && elementPathParts.length >= 3
      ? elementPathParts[2]
      : undefined;
  const fail = (message: string): void => {
    errors.push(message);
  };

  if (
    patch.op === "message" ||
    patch.op === "question" ||
    patch.op === "suggestion"
  ) {
    fail(
      `Unsupported op "${patch.op}" for UI patch tool. Use emit_ui_message for messages.`,
    );
    return errors;
  }

  const path = patch.path;
  if (!path || typeof path !== "string") {
    fail("Patch path is required.");
    return errors;
  }

  if (path === "/root") {
    if (patch.op !== "set") {
      fail('Only "set" is allowed on /root.');
    }
    if (typeof patch.value !== "string" || patch.value.trim().length === 0) {
      fail("Patch /root value must be a non-empty string.");
    }
    return errors;
  }

  if (ELEMENT_ROOT_PATH_REGEX.test(path)) {
    if (patch.op === "remove") return errors;

    if (
      patch.op !== "add" &&
      patch.op !== "replace" &&
      patch.op !== "ensure"
    ) {
      fail(
        `Unsupported op "${patch.op}" for element root path ${path}. Use add/replace/ensure/remove.`,
      );
      return errors;
    }

    if (typeof patch.value === "string" && isStringifiedJson(patch.value)) {
      fail(
        `Patch value for ${path} must be an object, not stringified JSON.`,
      );
      return errors;
    }

    const element = UiElementPatchValueSchema.safeParse(patch.value);
    if (!element.success) {
      const firstIssue = element.error.issues[0];
      fail(
        `Invalid UIElement payload for ${path}: ${firstIssue?.message ?? "unknown schema error"}.`,
      );
      return errors;
    }

    if (
      typeof elementKeyFromPath === "string" &&
      element.data.key !== elementKeyFromPath
    ) {
      fail(
        `Element key mismatch for ${path}: expected "${elementKeyFromPath}", got "${element.data.key}".`,
      );
    }
    return errors;
  }

  if (ELEMENT_PATH_REGEX.test(path)) {
    if (patch.op === "remove") return errors;

    if (patch.op !== "add" && patch.op !== "replace" && patch.op !== "set") {
      fail(
        `Unsupported op "${patch.op}" for nested element path ${path}. Use add/replace/set/remove.`,
      );
      return errors;
    }

    if (patch.value === undefined) {
      fail(`Patch ${path} requires a value.`);
      return errors;
    }

    if (
      CHILDREN_APPEND_PATH_REGEX.test(path) &&
      typeof patch.value !== "string"
    ) {
      fail(`Patch ${path} requires a child key string value.`);
    }

    if (
      CHILDREN_COLLECTION_PATH_REGEX.test(path) &&
      patch.value !== undefined &&
      (!Array.isArray(patch.value) ||
        patch.value.some((entry) => typeof entry !== "string"))
    ) {
      fail(`Patch ${path} requires an array of child key strings.`);
    }
    return errors;
  }

  fail(
    `Unsupported patch path "${path}". Allowed roots are /root and /elements/*.`,
  );
  return errors;
}

export function assertUiPatchContract<TPatch extends JsonPatchInput>(
  patch: TPatch,
): TPatch {
  const errors = validateUiPatchContract(patch);
  if (errors.length > 0) {
    throw new Error(`Invalid UI patch contract: ${errors.join(" ")}`);
  }
  return patch;
}

export const StrictUiPatchSchema = JsonPatchSchema.superRefine((patch, ctx) => {
  const errors = validateUiPatchContract(patch);
  for (const message of errors) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message,
    });
  }
});

export const NormalizedUiPatchSchema = z.preprocess(
  (value) => {
    if (!value || typeof value !== "object") return value;
    return normalizeUiPatch(value as JsonPatchInput);
  },
  StrictUiPatchSchema,
);
