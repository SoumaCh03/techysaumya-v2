import { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongoose";
import BlogPost from "@/models/BlogPost";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://saumyadeep.co.in";

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
    "/blog",
  ];

  const sitemapEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Fetch dynamic blog posts from MongoDB Atlas
  try {
    await connectDB();
    const publishedPosts = await BlogPost.find({ status: "published" }).select("slug updatedAt").lean();
    
    publishedPosts.forEach((post: { slug: string; updatedAt?: Date | string; createdAt?: Date | string }) => {
      sitemapEntries.push({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt || post.createdAt || Date.now()),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });
  } catch (e) {
    console.error("Failed to append dynamic blog posts to sitemap:", e);
  }

  return sitemapEntries;
}
