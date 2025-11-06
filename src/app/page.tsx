import { AMDStrategyPicker } from "@/components/amd-strategy-picker";
import { CallHistoryTable } from "@/components/call-history-table";
import { DialerForm } from "@/components/dialer-form";
import { RequireAuth } from "@/components/require-auth";
import { getCallLogs } from "@/server/telephony/call-log-queries";

export default async function Home() {
  const logs = await getCallLogs();

  return (
    <RequireAuth>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 py-12">
        <section className="grid gap-4 rounded-lg border border-border bg-card p-6 shadow-sm">
          <header className="space-y-1">
            <h1 className="text-2xl font-semibold">Advanced Dialer</h1>
            <p className="text-sm text-muted-foreground">
              Launch an outbound call with the answering machine detection strategy of your choice.
            </p>
          </header>
          <AMDStrategyPicker />
          <DialerForm />
        </section>
        <CallHistoryTable initialLogs={logs} />
      </main>
    </RequireAuth>
  );
}
