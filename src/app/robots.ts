import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://saumyadeep.co.in";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/api",
        ],
      },
      {
        userAgent: ["Googlebot", "Bingbot"],
        allow: "/",
        disallow: [
          "/admin",
          "/api",
        ],
      },
      {
        userAgent: ["YandexBot", "Baiduspider"],
        allow: "/",
        disallow: [
          "/admin",
          "/api",
        ],
        crawlDelay: 2,
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
