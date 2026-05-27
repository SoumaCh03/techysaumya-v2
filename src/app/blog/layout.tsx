import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Official Blog | TechySaumya Tech Chronicles",
  description: "Insightful articles on full stack engineering, API designs, database management, performance optimization, and AI written by Saumyadeep Chakraborty.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    type: "website",
    title: "Official Blog | TechySaumya Tech Chronicles",
    description: "Insightful articles on full stack development, API designs, database management, Cloudinary optimization, and AI development written by Saumyadeep Chakraborty.",
    url: "/blog",
    images: [
      {
        url: "/preview-image.png",
        width: 1200,
        height: 630,
        alt: "TechySaumya Blog Chronicles Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Official Blog | TechySaumya Tech Chronicles",
    description: "Articles on full stack development, API designs, database management, and AI development by Saumyadeep Chakraborty.",
    images: ["/preview-image.png"],
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
