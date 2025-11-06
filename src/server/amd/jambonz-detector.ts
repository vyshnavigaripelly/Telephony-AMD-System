import { type AMDDetector } from "@/server/telephony/types";

export async function createJambonzDetector(): Promise<AMDDetector> {
  let lastChunkAt = Date.now();

  return {
    id: "twilio-jambonz",
    label: "Twilio + Jambonz",
    warmup: async () => {
      // Jambonz handles AMD via SIP session. Warm-up placeholder.
      lastChunkAt = Date.now();
    },
    processChunk: async (chunk) => {
      // For documentation completeness we track chunk timing for debugging.
      if (!chunk.isFinal) {
        lastChunkAt = Date.now();
      }
    },
    finalize: async () => ({
      outcome: "unknown",
      confidence: 0.5,
      metadata: { lastChunkAt }
    })
  };
}
