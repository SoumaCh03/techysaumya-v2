import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Resume & ATS CV",
  description:
    "Professional CV of Saumyadeep Chakraborty (TechySaumya). High-performance React/Next.js developer, full stack systems engineer, and backend architect.",
  keywords: [
    "Saumyadeep Chakraborty Resume",
    "TechySaumya CV",
    "full stack engineer resume",
    "React developer portfolio cv",
    "systems architect contact details",
  ],
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
