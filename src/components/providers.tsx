"use client";

import { ThemeProvider } from "next-themes";

import { AMDStrategyProvider } from "@/components/amd-strategy-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AMDStrategyProvider>{children}</AMDStrategyProvider>
    </ThemeProvider>
  );
}
