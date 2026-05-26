import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SnappySaumya Photography Portfolio",
  description:
    "Visual travel diaries, street photography narratives, and motorcycle touring expeditions captured along the road by Saumyadeep Chakraborty (TechySaumya).",
  keywords: [
    "SnappySaumya",
    "TechySaumya Photography",
    "Nikon D7500",
    "landscape photography",
    "Varanasi street photography",
    "Meghalaya photography",
    "motorcycle tour photos",
  ],
};

export default function PhotographyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
