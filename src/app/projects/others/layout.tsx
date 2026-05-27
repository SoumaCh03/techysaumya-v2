import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Other Projects | Archive & Code Experiments",
  description: "Explore the archive of side projects, AI bots, mini games, keyboard testing utilities, and celebration pages crafted by Saumyadeep Chakraborty.",
  alternates: {
    canonical: "/projects/others",
  },
  openGraph: {
    type: "website",
    title: "Other Projects | Archive & Code Experiments | Saumyadeep Chakraborty",
    description: "Explore the archive of side projects, AI bots, mini games, keyboard testing utilities, and celebration pages crafted by Saumyadeep Chakraborty.",
    url: "/projects/others",
    images: [
      {
        url: "/preview-image.png",
        width: 1200,
        height: 630,
        alt: "Saumyadeep Chakraborty Project Archive",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Other Projects | Archive & Code Experiments",
    description: "A collection of minor experiments, static landing pages, and diagnostic web tools by Saumyadeep Chakraborty.",
    images: ["/preview-image.png"],
  },
};

export default function OthersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
