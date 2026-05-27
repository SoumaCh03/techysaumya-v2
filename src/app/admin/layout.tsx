import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Panel | TechySaumya",
  description: "Administrative console for managing blog posts, photography albums, and portfolio logs.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
