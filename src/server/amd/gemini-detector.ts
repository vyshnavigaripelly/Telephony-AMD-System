import { type AMDDetector, type AMDStreamChunk } from "@/server/telephony/types";

const GEMINI_URL = process.env.GEMINI_STREAM_URL ?? "https://generativelanguage.googleapis.com";

export async function createGeminiDetector(): Promise<AMDDetector> {
  const chunks: AMDStreamChunk[] = [];

  return {
    id: "gemini-flash",
    label: "Gemini 2.5 Flash",
    warmup: async () => {
      // Perform a lightweight readiness check so developers surface auth errors early.
      if (process.env.GEMINI_API_KEY) {
        await fetch(`${GEMINI_URL}/v1beta/models`, {
          headers: { Authorization: `Bearer ${process.env.GEMINI_API_KEY}` }
        }).catch(() => undefined);
      }
    },
    processChunk: async (chunk) => {
      chunks.push(chunk);
    },
    finalize: async () => {
      if (!process.env.GEMINI_API_KEY) {
        return {
          outcome: "unknown",
          confidence: 0,
          metadata: { reason: "missing_api_key" }
        };
      }

      try {
        const response = await fetch(`${GEMINI_URL}/v1beta/models/gemini-2.0-flash-exp:streamGenerateContent?key=${process.env.GEMINI_API_KEY}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    inlineData: {
                      mimeType: "audio/wav",
                      data: Buffer.concat(chunks.map((chunk) => chunk.audio)).toString("base64")
                    }
                  },
                  {
                    text: "Determine if the greeting is by a human or an answering machine. Respond with a JSON object {\"label\":\"human|voicemail\",\"confidence\":number}."
                  }
                ]
              }
            ]
          })
        });

        const payload = await response.json();
        const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        const match = text.match(/"label"\s*:\s*"(human|voicemail)".*?"confidence"\s*:\s*(0?.\d+|1(?:\.0+)?)/);
        if (!match) {
          return { outcome: "unknown", confidence: 0, metadata: { raw: text } };
        }

        const label = match[1] as "human" | "voicemail";
        const confidence = Number.parseFloat(match[2]);
        return {
          outcome: label === "human" ? "human" : "machine",
          confidence,
          metadata: { raw: text }
        };
      } catch (error) {
        console.warn("Gemini detector failed", error);
        return { outcome: "unknown", confidence: 0 };
      }
    }
  };
}
