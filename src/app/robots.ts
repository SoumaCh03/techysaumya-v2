import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin", // Prevent search bots indexing administrative actions
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://techysaumyadeep.vercel.app"}/sitemap.xml`,
  };
}
