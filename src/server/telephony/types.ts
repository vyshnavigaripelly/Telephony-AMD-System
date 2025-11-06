import { z } from "zod";

import { DialRequestSchema } from "@/server/telephony/validators";

export type DialRequest = z.infer<typeof DialRequestSchema>;

export type CallLog = {
  id: string;
  sid: string;
  targetNumber: string;
  strategy: string;
  detectionOutcome: "human" | "machine" | "timeout" | "unknown";
  durationSeconds: number | null;
  startedAt: string;
  completedAt: string | null;
  confidence: number | null;
  metadata: Record<string, unknown> | null;
};

export type AMDDetectorResult = {
  outcome: CallLog["detectionOutcome"];
  confidence: number;
  durationSeconds?: number;
  metadata?: Record<string, unknown>;
};

export type AMDStreamChunk = {
  audio: Buffer;
  sequenceNumber: number;
  isFinal: boolean;
};

export type AMDDetector = {
  id: string;
  label: string;
  warmup: () => Promise<void>;
  processChunk: (chunk: AMDStreamChunk) => Promise<void>;
  finalize: () => Promise<AMDDetectorResult>;
};
