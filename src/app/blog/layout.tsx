import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Technical Insights",
  description:
    "Explore development tutorials, systems engineering guides, motorcycle touring logs, and photography diaries by Saumyadeep Chakraborty (TechySaumya).",
  keywords: [
    "TechySaumya Blog",
    "Saumyadeep Chakraborty Blog",
    "programming tutorials",
    "backend development logs",
    "system architecture logs",
    "motorcycle riding diaries",
    "photography guides",
  ],
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
