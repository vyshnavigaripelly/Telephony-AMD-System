"use client";

import { useState } from "react";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  return (
    <form
      className="grid gap-3"
      onSubmit={async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setStatus(null);
        try {
          const response = await fetch("/api/auth/sign-in", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
          });

          if (!response.ok) {
            const payload = await response.json();
            throw new Error(payload?.error ?? "Failed to sign in");
          }

          setStatus("Sign-in request submitted to Better Auth backend.");
        } catch (error) {
          setStatus((error as Error).message);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <label className="grid gap-1 text-sm" htmlFor="email">
        Email
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
        />
      </label>
      <label className="grid gap-1 text-sm" htmlFor="password">
        Password
        <input
          id="password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
        />
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </button>
      {status ? <p className="text-xs text-muted-foreground">{status}</p> : null}
    </form>
  );
}
