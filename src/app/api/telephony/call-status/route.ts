import { NextResponse } from "next/server";

import { updateCallLog } from "@/server/telephony/log-writer";

export async function POST(request: Request) {
  const form = await request.formData();
  const callSid = form.get("CallSid");
  const callStatus = form.get("CallStatus");
  const callDuration = form.get("CallDuration");

  if (typeof callSid !== "string") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await updateCallLog(callSid, {
    completedAt: new Date(),
    durationSeconds: callDuration ? Number(callDuration) : undefined,
    metadata: {
      ...(callStatus ? { callStatus } : {}),
      ...(callDuration ? { callDuration: Number(callDuration) } : {})
    }
  });

  return NextResponse.json({ ok: true });
}
