import type { Metadata } from "next";
import { connectDB } from "@/lib/mongoose";
import BlogPost from "@/models/BlogPost";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    await connectDB();
    const post = await BlogPost.findOne({ slug, status: "published" }).select("title summary tags").lean();
    
    if (post) {
      return {
        title: `${post.title}`,
        description: post.summary,
        keywords: [...(post.tags || []), "TechySaumya Blog", "Saumyadeep Chakraborty Blog"],
        openGraph: {
          title: post.title,
          description: post.summary,
          type: "article",
          url: `https://techysaumyadeep.vercel.app/blog/${slug}`,
        },
        twitter: {
          card: "summary_large_image",
          title: post.title,
          description: post.summary,
        }
      };
    }
  } catch (e) {
    console.error("Failed to generate metadata for blog post:", e);
  }

  return {
    title: "Blog Post",
    description: "Read the latest article on TechySaumya Logs.",
  };
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
