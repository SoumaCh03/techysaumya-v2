import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume | Full Stack Systems Engineer",
  description: "View the professional resume of Saumyadeep Chakraborty. Specializing in Node.js, Next.js, React, MongoDB, scalable systems engineering, and custom AI/ML agents.",
  alternates: {
    canonical: "/resume",
  },
  openGraph: {
    type: "website",
    title: "Resume | Saumyadeep Chakraborty | Full Stack Systems Engineer",
    description: "Professional experience, tech stack, education, and credentials of Saumyadeep Chakraborty, Full Stack Systems Engineer.",
    url: "/resume",
    images: [
      {
        url: "/preview-image.png",
        width: 1200,
        height: 630,
        alt: "Saumyadeep Chakraborty Resume Overview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume | Full Stack Systems Engineer",
    description: "Professional experience, tech stack, education, and credentials of Saumyadeep Chakraborty.",
    images: ["/preview-image.png"],
  },
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
