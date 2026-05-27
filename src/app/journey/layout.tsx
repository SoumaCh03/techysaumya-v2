import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Journey | Software Engineer & Motorcyclist",
  description: "The professional and personal journey of Saumyadeep Chakraborty. Track projects, milestones, coding experiences, and motorcycle touring logs.",
  alternates: {
    canonical: "/journey",
  },
  openGraph: {
    type: "website",
    title: "My Journey | Software Engineer & Motorcyclist | Saumyadeep Chakraborty",
    description: "The professional and personal journey of Saumyadeep Chakraborty. Track projects, milestones, coding experiences, and motorcycle touring logs.",
    url: "/journey",
    images: [
      {
        url: "/preview-image.png",
        width: 1200,
        height: 630,
        alt: "Saumyadeep Chakraborty's Journey Timeline",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Journey | Software Engineer & Motorcyclist",
    description: "Track the professional milestones, coding experiences, and motorcycle touring logs of Saumyadeep Chakraborty.",
    images: ["/preview-image.png"],
  },
};

export default function JourneyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
