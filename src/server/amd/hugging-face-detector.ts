import { type AMDDetector, type AMDStreamChunk } from "@/server/telephony/types";

const HF_SERVICE_URL = process.env.HF_SERVICE_URL ?? "http://localhost:8000";

export async function createHuggingFaceDetector(): Promise<AMDDetector> {
  const chunks: AMDStreamChunk[] = [];

  return {
    id: "hugging-face",
    label: "Hugging Face wav2vec AMD",
    warmup: async () => {
      if (process.env.NODE_ENV === "development") {
        await fetch(`${HF_SERVICE_URL}/healthz`).catch(() => undefined);
      }
    },
    processChunk: async (chunk) => {
      chunks.push(chunk);
    },
    finalize: async () => {
      try {
        const response = await fetch(`${HF_SERVICE_URL}/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            frames: chunks.map((chunk) => chunk.audio.toString("base64"))
          })
        });
        const payload = (await response.json()) as {
          label: "human" | "voicemail";
          confidence: number;
        };

        return {
          outcome: payload.label === "human" ? "human" : "machine",
          confidence: payload.confidence,
          metadata: { frames: chunks.length }
        };
      } catch (error) {
        console.warn("Hugging Face detector failed", error);
        return { outcome: "unknown", confidence: 0 };
      }
    }
  };
}
