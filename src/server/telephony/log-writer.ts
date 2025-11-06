import { prisma } from "@/server/db/client";

export async function createCallLog({
  sid,
  targetNumber,
  strategy,
  metadata
}: {
  sid: string;
  targetNumber: string;
  strategy: string;
  metadata?: Record<string, unknown>;
}) {
  try {
    await prisma.callLog.create({
      data: {
        sid,
        targetNumber,
        strategy,
        detectionOutcome: "unknown",
        confidence: null,
        durationSeconds: null,
        metadata: metadata ?? {}
      }
    });
  } catch (error) {
    console.warn("Failed to create call log", error);
  }
}

export async function updateCallLog(sid: string, updates: Record<string, unknown>) {
  try {
    await prisma.callLog.update({
      where: { sid },
      data: updates
    });
  } catch (error) {
    console.warn("Failed to update call log", error);
  }
}
