import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/server/auth/config";

const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export async function POST(request: Request) {
  const body = SignInSchema.safeParse(await request.json());
  if (!body.success) {
    return NextResponse.json({ error: body.error.message }, { status: 400 });
  }

  try {
    await auth.api.signInEmailPassword({
      body: {
        email: body.data.email,
        password: body.data.password
      }
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to sign in" },
      { status: 400 }
    );
  }
}
