"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/navigation/Footer";
import { Search, Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  coverImage: string;
  tags: string[];
  readingTime: number;
  createdAt: string;
}

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/admin/blogs");
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (e) {
        console.error("Failed to load blog posts:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  // Collect all unique tags for filter navigation
  const allTags = Array.from(
    new Set(posts.flatMap((post) => post.tags || []))
  ).sort();

  // Filter posts based on search query and tag selection
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag ? post.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <>
      <Navbar />
      
      <main className="flex-grow min-h-screen bg-bg-base text-text-primary px-4 md:px-8 py-32 relative z-10 max-w-7xl mx-auto flex flex-col w-full">
        {/* Page Header */}
        <div className="flex flex-col items-center text-center mb-16 relative">
          <div className="absolute top-0 w-72 h-72 bg-cyan-accent/5 rounded-full filter blur-[80px] pointer-events-none -z-10" />
          
          <div className="w-14 h-14 rounded-2xl bg-cyan-accent/10 border border-cyan-accent/25 flex items-center justify-center text-cyan-accent mb-4">
            <BookOpen className="w-6 h-6 animate-pulse" />
          </div>
          <h1 className="font-display font-black text-4xl md:text-5xl tracking-tight text-white">
            The TechySaumya <span className="text-cyan-accent">Logs</span>
          </h1>
          <p className="text-text-secondary text-sm md:text-base mt-3 max-w-xl font-sans font-medium">
            Stories, technical guides, motorcycle riding chronicles, and development insights.
          </p>
        </div>

        {/* Search & Tag Filter Bar */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12 w-full">
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-3 text-text-secondary w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search posts by title or keyword..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/10 bg-white/2 text-white outline-none focus:border-cyan-accent/40 font-sans transition-all text-sm"
            />
          </div>

          {/* Tags scroll bar */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 items-center justify-end w-full md:w-auto">
              <button
                onClick={() => setSelectedTag(null)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  !selectedTag
                    ? "bg-cyan-accent text-bg-base"
                    : "bg-white/5 border border-white/10 text-text-secondary hover:text-white"
                }`}
              >
                All Tags
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                    selectedTag === tag
                      ? "bg-cyan-accent text-bg-base"
                      : "bg-white/5 border border-white/10 text-text-secondary hover:text-white"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Blog Post Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full flex-grow">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="glass-panel border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-pulse"
              >
                {/* Image Placeholder */}
                <div className="w-full h-48 bg-white/5 relative" />
                
                {/* Content Placeholder */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="h-3 w-20 bg-white/5 rounded" />
                    <div className="h-3 w-16 bg-white/5 rounded" />
                  </div>
                  
                  <div className="h-6 w-3/4 bg-white/10 rounded mb-3" />
                  
                  <div className="h-3 w-full bg-white/5 rounded mb-2" />
                  <div className="h-3 w-5/6 bg-white/5 rounded mb-6" />
                  
                  <div className="flex flex-col gap-4 mt-auto">
                    <div className="flex gap-1.5">
                      <div className="h-4.5 w-12 bg-white/5 rounded" />
                      <div className="h-4.5 w-12 bg-white/5 rounded" />
                    </div>
                    <div className="h-[1px] bg-white/5 w-full" />
                    <div className="h-4 w-28 bg-cyan-accent/15 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-24 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-text-secondary flex-grow">
            <BookOpen className="w-12 h-12 text-white/15 mb-3" />
            <p className="font-sans font-semibold text-white/60">No articles matched your search.</p>
            <p className="text-xs mt-1 font-sans font-medium">Try checking another tag or clearing filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full flex-grow">
            {filteredPosts.map((post) => (
              <article
                key={post._id}
                className="glass-panel border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col group relative transition-all duration-300 hover:border-cyan-accent/25 hover:translate-y-[-4px]"
              >
                {/* Image */}
                <Link href={`/blog/${post.slug}`} className="w-full h-48 overflow-hidden bg-black block relative">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                  />
                </Link>

                {/* Body details */}
                <div className="p-6 flex flex-col flex-grow">
                  {/* Metadata */}
                  <div className="flex items-center gap-4 text-[11px] font-sans font-semibold text-text-secondary mb-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-cyan-accent" />
                      {new Date(post.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-cyan-accent" />
                      {post.readingTime} min read
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-display font-black text-xl text-white mb-2 leading-tight group-hover:text-cyan-accent transition-colors">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>

                  {/* Summary */}
                  <p className="text-text-secondary text-xs leading-relaxed font-sans font-medium mb-6 flex-grow line-clamp-3">
                    {post.summary}
                  </p>

                  {/* Footer (tags & CTA) */}
                  <div className="flex flex-col gap-4 mt-auto">
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {post.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 rounded bg-white/2 border border-white/5 text-[9px] font-mono font-medium text-text-secondary uppercase"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="h-[1px] bg-white/5 w-full" />
                    
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-xs font-bold tracking-wider uppercase text-cyan-accent hover:text-white transition-all inline-flex items-center gap-1.5 group-hover:gap-2.5"
                    >
                      Read Article <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
