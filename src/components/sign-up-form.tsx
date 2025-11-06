"use client";

import { useState } from "react";

export function SignUpForm() {
  const [email, setEmail] = useState("");
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
          const response = await fetch("/api/auth/sign-up", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
          });

          if (!response.ok) {
            const payload = await response.json();
            throw new Error(payload?.error ?? "Failed to request access");
          }

          setStatus("Request received – check your inbox for next steps.");
        } catch (error) {
          setStatus((error as Error).message);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <label className="grid gap-1 text-sm" htmlFor="sign-up-email">
        Work email
        <input
          id="sign-up-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
        />
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Submitting…" : "Request access"}
      </button>
      {status ? <p className="text-xs text-muted-foreground">{status}</p> : null}
    </form>
  );
}
