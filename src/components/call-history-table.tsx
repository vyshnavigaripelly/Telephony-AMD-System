"use client";

import { useMemo, useState } from "react";

import { type CallLog } from "@/server/telephony/types";

type CallHistoryTableProps = {
  initialLogs: CallLog[];
};

export function CallHistoryTable({ initialLogs }: CallHistoryTableProps) {
  const [filterStrategy, setFilterStrategy] = useState<string>("all");

  const filtered = useMemo(() => {
    if (filterStrategy === "all") return initialLogs;
    return initialLogs.filter((log) => log.strategy === filterStrategy);
  }, [filterStrategy, initialLogs]);

  return (
    <section className="grid gap-4 rounded-lg border border-border bg-card p-6 shadow-sm">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Recent calls</h2>
          <p className="text-sm text-muted-foreground">
            Filter by strategy to review success rates and detection outcomes.
          </p>
        </div>
        <select
          className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          value={filterStrategy}
          onChange={(event) => setFilterStrategy(event.target.value)}
        >
          <option value="all">All strategies</option>
          {Array.from(new Set(initialLogs.map((log) => log.strategy))).map((strategy) => (
            <option key={strategy} value={strategy}>
              {strategy}
            </option>
          ))}
        </select>
      </header>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Started</th>
              <th className="px-3 py-2 text-left font-medium">Number</th>
              <th className="px-3 py-2 text-left font-medium">Strategy</th>
              <th className="px-3 py-2 text-left font-medium">Result</th>
              <th className="px-3 py-2 text-left font-medium">Duration (s)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 ? (
              <tr>
                <td className="px-3 py-4 text-center text-muted-foreground" colSpan={5}>
                  No calls logged yet.
                </td>
              </tr>
            ) : (
              filtered.map((log) => {
                const started = new Date(log.startedAt);
                return (
                  <tr key={log.id}>
                    <td className="px-3 py-2 font-mono text-xs">{started.toLocaleString()}</td>
                    <td className="px-3 py-2 font-medium">{log.targetNumber}</td>
                    <td className="px-3 py-2 capitalize">{log.strategy.replace(/-/g, " ")}</td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium uppercase">
                        {log.detectionOutcome}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">{log.durationSeconds ?? "—"}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
