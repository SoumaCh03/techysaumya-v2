import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Professional Journey & Milestones",
  description:
    "Explore the chronology of technical milestones, codebase deployments, and open-highway motorcycle expeditions of Saumyadeep Chakraborty (TechySaumya).",
  keywords: [
    "TechySaumya Journey",
    "Saumyadeep Chakraborty Career",
    "full stack developer milestones",
    "software engineer history",
    "motorcycle riding chronology",
  ],
};

export default function JourneyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
