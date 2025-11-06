import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/server/auth/config";

const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12).optional()
});

export async function POST(request: Request) {
  const body = SignUpSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: body.error.message }, { status: 400 });
  }

  try {
    await auth.api.signUpEmailPassword({
      body: {
        email: body.data.email,
        password: body.data.password ?? randomUUID()
      }
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to sign up" },
      { status: 400 }
    );
  }
}
