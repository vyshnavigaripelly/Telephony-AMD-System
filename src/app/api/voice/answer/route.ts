import { NextResponse } from "next/server";
import Twilio from "twilio";

function buildTwiml(strategy: string) {
  const mediaStreamUrl = process.env.MEDIA_STREAM_URL;

  if (!mediaStreamUrl) {
    throw new Error("MEDIA_STREAM_URL is not configured");
  }

  const response = new Twilio.twiml.VoiceResponse();
  response.say({ voice: "Polly.Joanna" }, "Please hold while we connect your call.");
  response.connect({ action: `/api/voice/bridge?strategy=${strategy}` }).stream({ url: mediaStreamUrl });
  return response.toString();
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const strategy = url.searchParams.get("strategy") ?? "twilio-native";
    const xml = buildTwiml(strategy);
    return new NextResponse(xml, { headers: { "Content-Type": "text/xml" } });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to build TwiML" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const strategy = typeof form.get("strategy") === "string" ? (form.get("strategy") as string) : "twilio-native";
    const xml = buildTwiml(strategy);
    return new NextResponse(xml, { headers: { "Content-Type": "text/xml" } });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to build TwiML" },
      { status: 500 }
    );
  }
}
