import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import BlogPost from "@/models/BlogPost";
import { isAuthorized } from "@/lib/auth";

// 1. GET (Public & Admin): Retrieves blogs
// Public reads published blogs, Admin reads all (drafts + published)
export async function GET(req: Request) {
  try {
    await connectDB();
    const authorized = await isAuthorized();
    
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const tag = searchParams.get("tag");

    // Single post lookup
    if (slug) {
      const query: any = { slug };
      if (!authorized) {
        query.status = "published";
      }
      const post = await BlogPost.findOne(query).lean();
      if (!post) {
        return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
      }
      return NextResponse.json(post);
    }

    // List query
    const query: any = {};
    if (!authorized) {
      query.status = "published";
    }
    if (tag) {
      query.tags = tag;
    }

    const posts = await BlogPost.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json(posts);
  } catch (e) {
    console.error("Blogs GET Error:", e);
    return NextResponse.json({ error: "Failed to fetch blog posts." }, { status: 500 });
  }
}

// 2. POST (Admin Only): Create a new blog post
export async function POST(req: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();
    const { title, slug, summary, content, coverImage, tags, status } = body;

    if (!title || !slug || !summary || !content) {
      return NextResponse.json({ error: "Title, Slug, Summary, and Content are required." }, { status: 400 });
    }

    // Verify slug uniqueness
    const exists = await BlogPost.findOne({ slug: slug.toLowerCase().trim() });
    if (exists) {
      return NextResponse.json({ error: "A blog post with this slug already exists." }, { status: 400 });
    }

    // Calculate reading time (200 words per minute average)
    const wordCount = content.trim().split(/\s+/).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const newPost = await BlogPost.create({
      title,
      slug: slug.toLowerCase().trim(),
      summary,
      content,
      coverImage: coverImage || undefined,
      tags: tags || [],
      status: status || "draft",
      readingTime,
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch (e) {
    console.error("Blogs POST Error:", e);
    return NextResponse.json({ error: "Failed to create blog post." }, { status: 500 });
  }
}

// 3. PUT (Admin Only): Update an existing blog post
export async function PUT(req: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();
    const { id, title, slug, summary, content, coverImage, tags, status } = body;

    if (!id) {
      return NextResponse.json({ error: "Blog post ID is required for updates." }, { status: 400 });
    }

    const post = await BlogPost.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }

    // If slug is changing, verify it is still unique
    if (slug && slug !== post.slug) {
      const exists = await BlogPost.findOne({ slug: slug.toLowerCase().trim() });
      if (exists) {
        return NextResponse.json({ error: "A blog post with this slug already exists." }, { status: 400 });
      }
      post.slug = slug.toLowerCase().trim();
    }

    if (title !== undefined) post.title = title;
    if (summary !== undefined) post.summary = summary;
    if (content !== undefined) {
      post.content = content;
      // Recalculate reading time
      const wordCount = content.trim().split(/\s+/).length;
      post.readingTime = Math.max(1, Math.ceil(wordCount / 200));
    }
    if (coverImage !== undefined) post.coverImage = coverImage;
    if (tags !== undefined) post.tags = tags;
    if (status !== undefined) post.status = status;

    await post.save();
    return NextResponse.json({ success: true, post });
  } catch (e) {
    console.error("Blogs PUT Error:", e);
    return NextResponse.json({ error: "Failed to update blog post." }, { status: 500 });
  }
}

// 4. DELETE (Admin Only): Delete a blog post
export async function DELETE(req: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Blog post ID is required." }, { status: 400 });
    }

    const deleted = await BlogPost.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Blog post not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Blog post deleted successfully." });
  } catch (e) {
    console.error("Blogs DELETE Error:", e);
    return NextResponse.json({ error: "Failed to delete blog post." }, { status: 500 });
  }
}
