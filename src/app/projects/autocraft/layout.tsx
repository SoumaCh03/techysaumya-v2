import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AutoCraft AI Case Study",
  description: "Mechanical diagnostics and diagnostic code visualizer. AutoCraft converts automotive telemetry into dynamic parts mapping overlays.",
  keywords: ["AutoCraft", "diagnostics visualizer", "automotive telemetry", "FastAPI backend classifier"],
};

export default function AutoCraftLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
