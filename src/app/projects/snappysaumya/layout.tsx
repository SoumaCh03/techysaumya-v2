import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SnappySaumya Cloud Portfolio",
  description: "A high-performance cloud photo gallery and photographer portfolio built to showcase visual travel logs and high-definition galleries.",
  keywords: ["SnappySaumya", "Cloud Gallery", "Cloudinary Photo Management", "Sharp WebP optimization"],
};

export default function SnappySaumyaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
