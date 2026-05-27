import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SnappySaumya Case Study | High-Performance Media CDN & Gallery",
  description: "Detailed case study of SnappySaumya, a custom photography portfolio utilizing optimized image delivery algorithms, secure admin panels, and Cloudinary API.",
  alternates: {
    canonical: "/projects/snappysaumya",
  },
  openGraph: {
    type: "article",
    title: "SnappySaumya Case Study | High-Performance Media CDN & Gallery",
    description: "Detailed case study of SnappySaumya, a custom photography portfolio utilizing optimized image delivery algorithms, secure admin panels, and Cloudinary API.",
    url: "/projects/snappysaumya",
    images: [
      {
        url: "/preview-image.png",
        width: 1200,
        height: 630,
        alt: "SnappySaumya Project Architecture Schema",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SnappySaumya Case Study | High-Performance Gallery CDN",
    description: "High-performance media management & visual photography gallery case study by Saumyadeep Chakraborty.",
    images: ["/preview-image.png"],
  },
};

export default function SnappySaumyaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
