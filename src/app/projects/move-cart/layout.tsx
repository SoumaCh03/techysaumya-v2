import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Move-Cart E-Commerce Case Study",
  description: "Highly scalable, concurrent shopping cart system and order manager built to process thousands of transactions per minute.",
  keywords: ["Move-Cart", "E-commerce platform", "redis cache system", "stripe transactional gateway"],
};

export default function MoveCartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
