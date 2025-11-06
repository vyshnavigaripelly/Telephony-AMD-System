import { createGeminiDetector } from "@/server/amd/gemini-detector";
import { createHuggingFaceDetector } from "@/server/amd/hugging-face-detector";
import { createJambonzDetector } from "@/server/amd/jambonz-detector";
import { createTwilioNativeDetector } from "@/server/amd/twilio-detector";
import { type AMDDetector } from "@/server/telephony/types";

export async function createAMDDetector(strategy: string): Promise<AMDDetector> {
  switch (strategy) {
    case "twilio-native":
      return createTwilioNativeDetector();
    case "twilio-jambonz":
      return createJambonzDetector();
    case "hugging-face":
      return createHuggingFaceDetector();
    case "gemini-flash":
      return createGeminiDetector();
    default:
      throw new Error(`Unknown strategy: ${strategy}`);
  }
}
