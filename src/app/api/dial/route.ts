import { NextResponse } from "next/server";

import { DialRequestSchema } from "@/server/telephony/validators";
import { createDialSession } from "@/server/telephony/dialer";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const dialRequest = DialRequestSchema.parse(payload);

    const call = await createDialSession(dialRequest);

    return NextResponse.json({ sid: call.sid, strategy: dialRequest.strategy });
  } catch (error) {
    console.error("Dial API error", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to initiate call" },
      { status: 400 }
    );
  }
}
