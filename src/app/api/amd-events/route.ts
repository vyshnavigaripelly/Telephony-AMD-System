import { NextResponse } from "next/server";

import { updateCallLog } from "@/server/telephony/log-writer";
import { AMDWebhookSchema, normalizeStatus } from "@/server/telephony/validators";

function formDataToObject(form: FormData) {
  return Object.fromEntries(
    Array.from(form.entries()).map(([key, value]) => [key, typeof value === "string" ? value : String(value)])
  );
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    let data: unknown;

    if (contentType.includes("application/json")) {
      data = await request.json();
    } else {
      const form = await request.formData();
      data = {
        callSid: form.get("CallSid"),
        strategy: form.get("Strategy") ?? form.get("strategy") ?? "twilio-native",
        status: form.get("AnsweredBy") ?? form.get("AnsweringMachineDetectionStatus"),
        confidence: form.get("Confidence"),
        durationSeconds: form.get("Duration"),
        metadata: formDataToObject(form)
      };
    }

    const parsed = AMDWebhookSchema.parse({
      callSid: typeof (data as any).callSid === "string" ? (data as any).callSid : String((data as any).CallSid ?? ""),
      strategy: typeof (data as any).strategy === "string" ? (data as any).strategy : "twilio-native",
      status: typeof (data as any).status === "string" ? ((data as any).status as string) : "unknown",
      confidence:
        typeof (data as any).confidence === "number"
          ? (data as any).confidence
          : typeof (data as any).confidence === "string"
            ? Number.parseFloat((data as any).confidence)
            : null,
      durationSeconds:
        typeof (data as any).durationSeconds === "number"
          ? (data as any).durationSeconds
          : typeof (data as any).durationSeconds === "string"
            ? Number.parseInt((data as any).durationSeconds, 10)
            : null,
      metadata: (data as any).metadata ?? {}
    });

    await updateCallLog(parsed.callSid, {
      detectionOutcome: normalizeStatus(parsed.status),
      confidence: parsed.confidence,
      durationSeconds: parsed.durationSeconds,
      metadata: parsed.metadata ?? {}
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to process AMD webhook", error);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
