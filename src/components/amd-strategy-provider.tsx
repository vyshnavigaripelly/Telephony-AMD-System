"use client";

import { createContext, useContext, useState } from "react";

import { AMD_STRATEGIES, type AMDStrategyId } from "@/config/amd";

type AMDStrategyContextValue = {
  activeStrategy: AMDStrategyId;
  setActiveStrategy: (strategy: AMDStrategyId) => void;
};

const AMDStrategyContext = createContext<AMDStrategyContextValue | undefined>(undefined);

export function AMDStrategyProvider({ children }: { children: React.ReactNode }) {
  const [activeStrategy, setActiveStrategy] = useState<AMDStrategyId>("twilio-native");

  return (
    <AMDStrategyContext.Provider value={{ activeStrategy, setActiveStrategy }}>
      {children}
    </AMDStrategyContext.Provider>
  );
}

export function useAMDStrategy() {
  const context = useContext(AMDStrategyContext);
  if (!context) {
    throw new Error("useAMDStrategy must be used within an AMDStrategyProvider");
  }
  return context;
}

export { AMD_STRATEGIES };
