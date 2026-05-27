import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MoveCart Case Study | High-Speed E-Commerce Shopping Flow",
  description: "Detailed case study of MoveCart, a high-performance shopping cart catalog with Redux state synchronization, express backends, and transaction flows under 100ms.",
  alternates: {
    canonical: "/projects/move-cart",
  },
  openGraph: {
    type: "article",
    title: "MoveCart Case Study | High-Speed E-Commerce Shopping Flow",
    description: "Detailed case study of MoveCart, a high-performance shopping cart catalog with Redux state synchronization, express backends, and transaction flows under 100ms.",
    url: "/projects/move-cart",
    images: [
      {
        url: "/preview-image.png",
        width: 1200,
        height: 630,
        alt: "MoveCart State Sync and checkout flowchart",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MoveCart Case Study | High-Speed E-Commerce",
    description: "High-speed client-side shopping cart & checkout catalog case study by Saumyadeep Chakraborty.",
    images: ["/preview-image.png"],
  },
};

export default function MoveCartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
