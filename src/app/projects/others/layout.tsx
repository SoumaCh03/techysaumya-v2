import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Development Showcases & Sandbox",
  description: "Collection of open-source utilities, terminal tools, keyboard testers, and backend automation modules built by Saumyadeep Chakraborty.",
  keywords: ["keyboard tester tool", "open source utilities", "node automation logs", "developer sandbox"],
};

export default function OthersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
