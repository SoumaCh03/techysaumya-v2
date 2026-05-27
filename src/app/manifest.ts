import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Saumyadeep Chakraborty | TechySaumya Portfolio",
    short_name: "TechySaumya",
    description: "Official portfolio of Saumyadeep Chakraborty (TechySaumya) - Full Stack Systems Engineer and Photographer.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
