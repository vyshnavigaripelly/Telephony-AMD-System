import { NextResponse } from "next/server";
import Twilio from "twilio";

import { updateCallLog } from "@/server/telephony/log-writer";
import { normalizeStatus } from "@/server/telephony/validators";

export async function POST(request: Request) {
  const form = await request.formData();
  const callSid = form.get("CallSid");
  const strategy = form.get("strategy") ?? form.get("Strategy") ?? "twilio-native";
  const answeredBy = form.get("AnsweredBy");
  const normalized = typeof answeredBy === "string" ? normalizeStatus(answeredBy) : "unknown";

  const response = new Twilio.twiml.VoiceResponse();

  if (normalized === "human") {
    const bridgeNumber = process.env.AGENT_BRIDGE_NUMBER;
    if (bridgeNumber) {
      response.say("Connecting you with an agent.");
      response.dial(bridgeNumber);
    } else {
      response.say("An agent will call you shortly. Goodbye.");
      response.hangup();
    }
  } else {
    response.hangup();
  }

  if (typeof callSid === "string") {
    await updateCallLog(callSid, {
      detectionOutcome: normalized,
      metadata: { strategy }
    });
  }

  return new NextResponse(response.toString(), {
    headers: { "Content-Type": "text/xml" }
  });
}
