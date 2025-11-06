import { cache } from "react";

import { prisma } from "@/server/db/client";
import { type CallLog } from "@/server/telephony/types";

export const getCallLogs = cache(async (): Promise<CallLog[]> => {
  try {
    const logs = await prisma.callLog.findMany({
      orderBy: { startedAt: "desc" },
      take: 25
    });

    return logs.map((log) => ({
      id: log.id,
      sid: log.sid,
      targetNumber: log.targetNumber,
      strategy: log.strategy,
      detectionOutcome: log.detectionOutcome as CallLog["detectionOutcome"],
      durationSeconds: log.durationSeconds,
      startedAt: log.startedAt.toISOString(),
      completedAt: log.completedAt ? log.completedAt.toISOString() : null,
      confidence: log.confidence,
      metadata: (log.metadata as Record<string, unknown> | null) ?? null
    }));
  } catch (error) {
    console.warn("Failed to load call logs", error);
    return [];
  }
});
