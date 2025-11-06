"use client";

import { useState } from "react";

import { useAMDStrategy } from "@/components/amd-strategy-provider";
import { DialRequestSchema } from "@/server/telephony/validators";

export function DialerForm() {
  const { activeStrategy } = useAMDStrategy();
  const [targetNumber, setTargetNumber] = useState("+1");
  const [status, setStatus] = useState<string | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);

  return (
    <form
      className="grid gap-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setSubmitting(true);
        setStatus(null);
        const formData = {
          targetNumber,
          strategy: activeStrategy
        };

        const parseResult = DialRequestSchema.safeParse(formData);
        if (!parseResult.success) {
          setStatus("Invalid request: " + parseResult.error.message);
          setSubmitting(false);
          return;
        }

        try {
          const response = await fetch("/api/dial", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parseResult.data)
          });

          const payload = await response.json();

          if (!response.ok) {
            throw new Error(payload?.error ?? "Failed to start call");
          }

          setStatus(`Call initiated: ${payload.sid}`);
        } catch (error) {
          setStatus((error as Error).message);
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <div className="grid gap-2">
        <label className="text-sm font-medium" htmlFor="targetNumber">
          Target phone number
        </label>
        <input
          id="targetNumber"
          type="tel"
          required
          value={targetNumber}
          onChange={(event) => setTargetNumber(event.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
          placeholder="+18005550123"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Dialing…" : "Dial now"}
      </button>
      {status ? <p className="text-xs text-muted-foreground">{status}</p> : null}
    </form>
  );
}
