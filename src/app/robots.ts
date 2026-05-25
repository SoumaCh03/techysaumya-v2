import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin", // Prevent search bots indexing administrative actions
    },
    sitemap: "https://techysaumyadeep.vercel.app/sitemap.xml",
  };
}
