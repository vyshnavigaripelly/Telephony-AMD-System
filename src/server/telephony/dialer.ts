import { headers } from "next/headers";

import { createAMDDetector } from "@/server/telephony/strategy-factory";
import { createTwilioClient } from "@/server/telephony/twilio";
import { createCallLog } from "@/server/telephony/log-writer";
import { type DialRequest } from "@/server/telephony/types";

export async function createDialSession(request: DialRequest) {
  const twilio = createTwilioClient();
  const detector = await createAMDDetector(request.strategy);
  await detector.warmup();

  const callbackBaseUrl = process.env.APP_BASE_URL ?? "http://localhost:3000";
  const outboundNumber = process.env.TWILIO_OUTBOUND_NUMBER;

  if (!outboundNumber) {
    throw new Error("TWILIO_OUTBOUND_NUMBER must be configured");
  }

  const authHeader = headers().get("authorization");

  const call = await twilio.calls.create({
    to: request.targetNumber,
    from: outboundNumber,
    url: `${callbackBaseUrl}/api/voice/answer?strategy=${request.strategy}`,
    machineDetection: "Enable",
    machineDetectionTimeout: 6,
    asyncAmd: true,
    asyncAmdStatusCallback: `${callbackBaseUrl}/api/amd-events`,
    asyncAmdStatusCallbackMethod: "POST",
    statusCallback: `${callbackBaseUrl}/api/telephony/call-status`,
    statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
    statusCallbackMethod: "POST"
  });

  await createCallLog({
    sid: call.sid,
    targetNumber: request.targetNumber,
    strategy: request.strategy,
    metadata: {
      authHeader: authHeader ? "present" : "missing",
      initiatedBy: "web-app"
    }
  });

  return call;
}
