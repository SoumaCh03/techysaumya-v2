import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://techysaumyadeep.vercel.app";

  // Core portfolio routes
  const routes = [
    "",
    "/photography",
    "/journey",
    "/resume",
    "/projects/autocraft",
    "/projects/snappysaumya",
    "/projects/move-cart",
    "/projects/others",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }));
}
