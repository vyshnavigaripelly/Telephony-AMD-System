import { type AMDDetector } from "@/server/telephony/types";

export async function createTwilioNativeDetector(): Promise<AMDDetector> {
  let result: AMDDetector["finalize"] | undefined;

  return {
    id: "twilio-native",
    label: "Twilio native AMD",
    warmup: async () => {
      result = async () => ({ outcome: "unknown", confidence: 0 });
    },
    processChunk: async () => {
      // Twilio performs detection server-side. We simply await callbacks.
    },
    finalize: async () => {
      if (!result) {
        throw new Error("Detector not warmed up");
      }
      return result();
    }
  };
}
