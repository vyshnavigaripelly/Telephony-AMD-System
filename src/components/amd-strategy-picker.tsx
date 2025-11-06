"use client";

import { AMD_STRATEGIES, useAMDStrategy } from "@/components/amd-strategy-provider";

export function AMDStrategyPicker() {
  const { activeStrategy, setActiveStrategy } = useAMDStrategy();

  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium" htmlFor="amd-strategy">
        Answering Machine Detection Strategy
      </label>
      <select
        id="amd-strategy"
        value={activeStrategy}
        onChange={(event) => setActiveStrategy(event.target.value as typeof activeStrategy)}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
      >
        {AMD_STRATEGIES.map((strategy) => (
          <option key={strategy.id} value={strategy.id}>
            {strategy.label}
          </option>
        ))}
      </select>
      <p className="text-xs text-muted-foreground">
        {AMD_STRATEGIES.find((strategy) => strategy.id === activeStrategy)?.description}
      </p>
    </div>
  );
}
