import type { Metadata } from "next";
import { connectDB } from "@/lib/mongoose";
import BlogPost from "@/models/BlogPost";

interface BlogLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: BlogLayoutProps): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    await connectDB();
    const post = await BlogPost.findOne({ slug, status: "published" }).lean();
    if (!post) {
      return {
        title: "Blog Post Not Found | TechySaumya",
        description: "The requested blog post could not be found.",
      };
    }

    const title = `${post.title} | TechySaumya Blog`;
    const description = post.summary || "Insightful tech article by Saumyadeep Chakraborty.";
    const coverUrl = post.coverImage || "/preview-image.png";

    return {
      title,
      description,
      alternates: {
        canonical: `/blog/${slug}`,
      },
      openGraph: {
        type: "article",
        title,
        description,
        url: `/blog/${slug}`,
        publishedTime: post.createdAt ? new Date(post.createdAt).toISOString() : undefined,
        modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
        authors: ["Saumyadeep Chakraborty"],
        tags: post.tags || [],
        images: [
          {
            url: coverUrl,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [coverUrl],
      },
    };
  } catch (e) {
    console.error("Error generating metadata for blog post:", e);
    return {
      title: "Blog Post | TechySaumya",
      description: "Articles and case studies on engineering and design.",
    };
  }
}

export default async function BlogPostLayout({
  children,
  params,
}: BlogLayoutProps) {
  const { slug } = await params;
  let blogPostLd = null;

  try {
    await connectDB();
    const post = await BlogPost.findOne({ slug, status: "published" }).lean();
    if (post) {
      blogPostLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.summary,
        "image": post.coverImage || "https://saumyadeep.co.in/preview-image.png",
        "datePublished": post.createdAt ? new Date(post.createdAt).toISOString() : new Date().toISOString(),
        "dateModified": post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date().toISOString(),
        "author": {
          "@type": "Person",
          "name": "Saumyadeep Chakraborty",
          "url": "https://saumyadeep.co.in/",
        },
        "publisher": {
          "@type": "Organization",
          "name": "TechySaumya",
          "logo": {
            "@type": "ImageObject",
            "url": "https://saumyadeep.co.in/favicon.svg",
          },
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://saumyadeep.co.in/blog/${slug}`,
        },
      };
    }
  } catch (e) {
    console.error("Error creating JSON-LD for blog post:", e);
  }

  return (
    <>
      {blogPostLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostLd) }}
        />
      )}
      {children}
    </>
  );
}
