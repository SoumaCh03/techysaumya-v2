"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { Calendar, Clock, ArrowLeft, Share2, Tag, Loader2, Copy, Check } from "lucide-react";

interface BlogPost {
  title: string;
  summary: string;
  content: string;
  coverImage: string;
  tags: string[];
  readingTime: number;
  createdAt: string;
}

// Custom Markdown to Safe HTML parser for premium rendering without external dependencies
function markdownToHtml(markdown: string): string {
  if (!markdown) return "";
  let html = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headers
  html = html.replace(/^# (.*?)$/gm, '<h1 class="text-3xl md:text-4xl font-display font-black text-white mt-10 mb-5 tracking-tight">$1</h1>');
  html = html.replace(/^## (.*?)$/gm, '<h2 class="text-2xl md:text-3xl font-display font-bold text-white mt-8 mb-4 border-b border-white/5 pb-2.5">$1</h2>');
  html = html.replace(/^### (.*?)$/gm, '<h3 class="text-xl font-display font-semibold text-white mt-6 mb-3">$1</h3>');

  // Images: ![alt](url)
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<div class="my-8 rounded-2xl overflow-hidden border border-white/5 bg-black shadow-2xl"><img src="$2" alt="$1" class="w-full h-auto object-cover max-h-[550px]" /><p class="text-xs text-center text-text-muted mt-3.5 font-sans font-medium">$1</p></div>');

  // Links: [label](url)
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-cyan-accent hover:underline font-semibold">$1</a>');

  // Bold: **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');

  // Code: `code`
  html = html.replace(/`(.*?)`/g, '<code class="bg-white/5 border border-white/10 px-2 py-0.5 rounded font-mono text-xs text-cyan-accent">$1</code>');

  // Blockquotes: > quote
  html = html.replace(/^> (.*?)$/gm, '<blockquote class="border-l-4 border-cyan-accent bg-cyan-accent/5 px-5 py-4 my-6 rounded-r-2xl text-text-secondary italic font-sans leading-relaxed">$1</blockquote>');

  // Bullet Lists
  const lines = html.split("\n");
  let inList = false;
  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const content = trimmed.substring(2);
      let listLine = "";
      if (!inList) {
        inList = true;
        listLine += '<ul class="list-disc list-inside text-text-secondary text-sm md:text-base leading-relaxed my-5 flex flex-col gap-2.5 font-sans font-medium pl-6">';
      }
      listLine += `<li>${content}</li>`;
      return listLine;
    } else {
      let listLine = "";
      if (inList) {
        inList = false;
        listLine += '</ul>';
      }
      return listLine + line;
    }
  });
  if (inList) {
    processedLines.push('</ul>');
  }
  html = processedLines.join("\n");

  // Paragraphs
  const blocks = html.split(/\n\n+/);
  html = blocks.map(block => {
    const trimmed = block.trim();
    if (!trimmed) return "";
    if (trimmed.startsWith("<h") || trimmed.startsWith("<div") || trimmed.startsWith("<blockquote") || trimmed.startsWith("<ul") || trimmed.startsWith("<p")) {
      return trimmed;
    }
    return `<p class="text-text-secondary text-sm md:text-base leading-relaxed my-5 font-sans font-medium">${trimmed}</p>`;
  }).join("\n");

  return html;
}

export default function BlogDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;

    async function fetchPost() {
      try {
        const res = await fetch(`/api/admin/blogs?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
        } else {
          // Redirect if not found
          router.push("/blog");
        }
      } catch (e) {
        console.error("Error loading blog details:", e);
        router.push("/blog");
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug, router]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow min-h-screen bg-bg-base text-text-primary px-4 md:px-8 py-32 relative z-10 max-w-4xl mx-auto flex flex-col w-full">
        {/* Navigation back */}
        <div className="flex items-center justify-between mb-8 pb-5 border-b border-white/5">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-white transition-all font-sans"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-accent" /> Back to Articles
          </Link>

          {!loading && post && (
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-accent hover:text-white transition-all font-sans bg-cyan-accent/5 border border-cyan-accent/10 hover:border-cyan-accent/30 px-3.5 py-2 rounded-xl"
              title="Copy link to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> Link Copied!
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" /> Share
                </>
              )}
            </button>
          )}
        </div>

        {loading ? (
          <div className="animate-pulse flex flex-col w-full">
            {/* Cover Image Hero Skeleton */}
            <div className="w-full h-[280px] md:h-[400px] rounded-3xl bg-white/5 border border-white/5 mb-12 shadow-2xl" />

            {/* Article Meta Header Skeleton */}
            <div className="flex flex-col gap-4 mb-8">
              <div className="flex items-center gap-4 text-xs">
                <div className="h-3.5 w-24 bg-white/5 rounded" />
                <div className="h-3.5 w-20 bg-white/5 rounded" />
              </div>
              <div className="h-10 w-3/4 bg-white/10 rounded mt-2" />
              <div className="h-6 w-full bg-white/5 rounded mt-3" />
              <div className="flex gap-2 mt-2">
                <div className="h-5 w-16 bg-white/5 rounded-lg" />
                <div className="h-5 w-16 bg-white/5 rounded-lg" />
              </div>
            </div>

            <div className="h-[1px] bg-white/5 w-full my-6" />

            {/* Content Body Skeleton */}
            <div className="flex flex-col gap-4 w-full mt-4">
              <div className="h-4 w-full bg-white/5 rounded" />
              <div className="h-4 w-5/6 bg-white/5 rounded" />
              <div className="h-4 w-11/12 bg-white/5 rounded" />
              <div className="h-4 w-4/5 bg-white/5 rounded" />
              <div className="h-4 w-full bg-white/5 rounded mt-4" />
              <div className="h-4 w-3/4 bg-white/5 rounded" />
            </div>
          </div>
        ) : post ? (
          <>
            {/* Cover Image Hero */}
            <div className="w-full h-[280px] md:h-[400px] rounded-3xl overflow-hidden border border-white/5 bg-black relative mb-12 shadow-2xl">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-bg-base to-transparent" />
            </div>

            {/* Article Meta Header */}
            <div className="flex flex-col gap-4 mb-8">
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs font-sans font-semibold text-text-secondary">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-cyan-accent" />
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-cyan-accent" />
                  {post.readingTime} min read
                </span>
              </div>

              {/* Title */}
              <h1 className="font-display font-black text-3xl md:text-5xl tracking-tight text-white leading-tight">
                {post.title}
              </h1>

              {/* Summary / Lead Paragraph */}
              <p className="text-text-secondary text-base md:text-lg leading-relaxed font-sans font-semibold italic border-l-2 border-white/10 pl-4 py-1 mt-2">
                {post.summary}
              </p>

              {/* Tags list */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-lg bg-white/2 border border-white/5 text-[10px] font-mono font-medium text-cyan-accent uppercase tracking-wider"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Dividers */}
            <div className="h-[1px] bg-white/5 w-full my-6" />

            {/* Content Body */}
            <article 
              className="w-full prose prose-invert max-w-none text-text-secondary"
              dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }}
            />
          </>
        ) : null}

        {/* Footer actions */}
        <div className="h-[1px] bg-white/5 w-full my-12" />
        
        <div className="flex items-center justify-between">
          <Link
            href="/blog"
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-text-secondary hover:text-white transition-all font-sans"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-accent" /> Back to Articles
          </Link>

          {!loading && post && (
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white/3 hover:bg-white/5 rounded-xl border border-white/10 text-xs font-semibold tracking-wider uppercase text-white hover:text-cyan-accent transition-all duration-300"
            >
              {copied ? "Link Copied!" : "Copy Post Link"}
            </button>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
