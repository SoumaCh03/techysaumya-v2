import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AutoCraft Case Study | AI Mechanical Engine & Diagnostics Visualizer",
  description: "Detailed case study of AutoCraft, an AI-powered automotive diagnostic routing engine and parts overlay visualizer built by Saumyadeep Chakraborty.",
  alternates: {
    canonical: "/projects/autocraft",
  },
  openGraph: {
    type: "article",
    title: "AutoCraft Case Study | AI Mechanical Engine & Diagnostics Visualizer",
    description: "Detailed case study of AutoCraft, an AI-powered automotive diagnostic routing engine and parts overlay visualizer built by Saumyadeep Chakraborty.",
    url: "/projects/autocraft",
    images: [
      {
        url: "/preview-image.png",
        width: 1200,
        height: 630,
        alt: "AutoCraft AI Mechanical Diagnostics System Diagram",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoCraft Case Study | AI Mechanical Engine",
    description: "AI-powered mechanical routing system & diagnostics visualizer engineered by Saumyadeep Chakraborty.",
    images: ["/preview-image.png"],
  },
};

export default function AutoCraftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
