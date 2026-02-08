/**
 * Stream Wire Protocol v3
 *
 * Single transport contract for backend -> frontend streaming.
 */
import { z } from "zod";
import { JsonPatchSchema } from "../types";
import { StrictUiPatchSchema } from "./ui-patch-contract";

export const WireProtocolVersionSchema = z.literal("3.0");

export const WireControlEventSchema = z.object({
  kind: z.literal("control"),
  action: z.enum([
    "start",
    "heartbeat",
    "persisted-attachments",
    "document-index-ui",
    "citations",
    "usage",
    "plan-created",
    "step-started",
    "step-done",
    "subtask-started",
    "subtask-done",
    "level-started",
    "level-completed",
    "orchestration-done",
    "abort",
  ]),
  state: z.string().optional(),
  data: z.unknown().optional(),
});

export const WireProgressEventSchema = z.object({
  kind: z.literal("progress"),
  state: z.string().optional(),
  toolName: z.string().optional(),
  toolCallId: z.string().optional(),
  status: z
    .enum(["pending", "starting", "progress", "running", "complete", "error"])
    .optional(),
  message: z.string().optional(),
  progress: z.number().min(0).max(100).optional(),
  data: z.unknown().optional(),
});

const LegacyInteractionPatchSchema = JsonPatchSchema.refine(
  (patch) =>
    patch.op === "message" ||
    patch.op === "question" ||
    patch.op === "suggestion",
  {
    message:
      'Only "message", "question", or "suggestion" legacy operations are allowed here.',
  },
);

const WirePatchPayloadSchema = z.union([
  StrictUiPatchSchema,
  LegacyInteractionPatchSchema,
]);

export const WirePatchEventSchema = z
  .object({
    kind: z.literal("patch"),
    patch: WirePatchPayloadSchema.optional(),
    patches: z.array(WirePatchPayloadSchema).optional(),
    atomic: z.boolean().optional(),
  })
  .refine((value) => !!value.patch || (value.patches?.length ?? 0) > 0, {
    message: "patch or patches is required",
  });

export const WireMessageEventSchema = z.object({
  kind: z.literal("message"),
  id: z.string().min(1).optional(),
  mode: z.enum(["append", "replace", "final"]).default("final"),
  role: z.enum(["user", "assistant", "system"]).default("assistant"),
  content: z.string().min(1),
});

export const WireErrorEventSchema = z.object({
  kind: z.literal("error"),
  code: z.string().min(1),
  message: z.string().min(1),
  recoverable: z.boolean().default(false),
  state: z.string().optional(),
  data: z.unknown().optional(),
});

export const WireDoneEventSchema = z.object({
  kind: z.literal("done"),
  state: z.string().optional(),
  data: z.unknown().optional(),
});

export const WireEventSchema = z.discriminatedUnion("kind", [
  WireControlEventSchema,
  WireProgressEventSchema,
  WirePatchEventSchema,
  WireMessageEventSchema,
  WireErrorEventSchema,
  WireDoneEventSchema,
]);

export const WireFrameSchema = z.object({
  version: WireProtocolVersionSchema,
  correlationId: z.string().min(1),
  sequence: z.number().int().nonnegative(),
  timestamp: z.number().int().nonnegative(),
  event: WireEventSchema,
});

export type WireEvent = z.infer<typeof WireEventSchema>;
export type WireFrame = z.infer<typeof WireFrameSchema>;
export type WireControlEvent = z.infer<typeof WireControlEventSchema>;
export type WireProgressEvent = z.infer<typeof WireProgressEventSchema>;
export type WirePatchEvent = z.infer<typeof WirePatchEventSchema>;
export type WireMessageEvent = z.infer<typeof WireMessageEventSchema>;
export type WireErrorEvent = z.infer<typeof WireErrorEventSchema>;
export type WireDoneEvent = z.infer<typeof WireDoneEventSchema>;

export interface CreateWireFrameInput {
  correlationId: string;
  sequence: number;
  event: WireEvent;
  timestamp?: number;
}

export function createWireFrame(input: CreateWireFrameInput): WireFrame {
  return {
    version: "3.0",
    correlationId: input.correlationId,
    sequence: input.sequence,
    timestamp: input.timestamp ?? Date.now(),
    event: input.event,
  };
}
