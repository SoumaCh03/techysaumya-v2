import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SnappySaumya Photography | Visual Travel Diary",
  description: "Scenic photography, street narratives, and mountain expeditions captured by Saumyadeep Chakraborty. Explore galleries and visual travel stories.",
  alternates: {
    canonical: "/photography",
  },
  openGraph: {
    type: "website",
    title: "SnappySaumya Photography | Visual Travel Diary",
    description: "Scenic photography, street narratives, and mountain expeditions captured by Saumyadeep Chakraborty.",
    url: "/photography",
    images: [
      {
        url: "/preview-image.png",
        width: 1200,
        height: 630,
        alt: "SnappySaumya Photography Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SnappySaumya Photography | Visual Travel Diary",
    description: "Scenic photography, street narratives, and mountain expeditions captured by Saumyadeep Chakraborty.",
    images: ["/preview-image.png"],
  },
};

export default function PhotographyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
