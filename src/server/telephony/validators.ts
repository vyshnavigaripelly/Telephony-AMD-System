import { z } from "zod";

import { AMD_STRATEGIES } from "@/config/amd";

const PhoneE164RegExp = /^\+?[1-9]\d{6,14}$/;

export const DialRequestSchema = z.object({
  targetNumber: z
    .string({ required_error: "Target phone number is required" })
    .regex(PhoneE164RegExp, "Must be a valid E.164 phone number"),
  strategy: z
    .enum(AMD_STRATEGIES.map((strategy) => strategy.id) as [string, ...string[]])
    .describe("Identifier of the answering machine detection strategy"),
  metadata: z
    .record(z.string(), z.unknown())
    .optional()
    .default({})
});

export const AMDWebhookSchema = z.object({
  callSid: z.string(),
  strategy: z.string(),
  status: z.string(),
  confidence: z.number().min(0).max(1).nullable(),
  durationSeconds: z.number().int().nonnegative().nullable(),
  metadata: z.record(z.string(), z.unknown()).optional()
});

export function normalizeStatus(raw: string): "human" | "machine" | "timeout" | "unknown" {
  const value = raw.toLowerCase();
  if (value.includes("human")) return "human";
  if (value.includes("machine")) return "machine";
  if (value.includes("timeout") || value.includes("no-answer")) return "timeout";
  return "unknown";
}
