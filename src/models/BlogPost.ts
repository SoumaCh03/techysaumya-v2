import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  summary: string;
  content: string; // Markdown text content
  coverImage: string;
  tags: string[];
  status: "draft" | "published";
  readingTime: number; // minutes
  createdAt: Date;
  updatedAt: Date;
}

const BlogPostSchema = new Schema<IBlogPost>(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    summary:     { type: String, required: true, trim: true },
    content:     { type: String, required: true },
    coverImage:  { type: String, default: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80" },
    tags:        { type: [String], default: [] },
    status:      { type: String, enum: ["draft", "published"], default: "draft" },
    readingTime: { type: Number, default: 1 },
  },
  { timestamps: true }
);

BlogPostSchema.index({ status: 1, createdAt: -1 });

const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", BlogPostSchema);

export default BlogPost;
