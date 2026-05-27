"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Camera, ArrowRight, MapPin, Calendar, Compass } from "lucide-react";

interface Photo {
  id: string;
  url: string;
  title: string;
  order: number;
}

interface Album {
  id: string;
  title: string;
  description: string;
  slug: string;
  coverImage: string;
  order: number;
  images: Photo[];
}

export default function PhotographyPreview() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const res = await fetch("/api/admin/albums");
        if (res.ok) {
          const data = await res.json();
          setAlbums(data.slice(0, 3)); // Show top 3 albums
        }
      } catch (e) {
        console.error("Failed to load photography preview albums", e);
      } finally {
        setLoading(false);
      }
    }
    fetchAlbums();
  }, []);

  return (
    <section
      id="photography-preview"
      className="w-full py-20 md:py-28 px-6 md:px-12 lg:px-20 relative bg-gradient-to-b from-bg-base via-bg-surface/20 to-bg-base border-b border-white/5 overflow-hidden"
    >
      <div className="absolute w-[400px] h-[400px] bg-amber-accent/5 filter blur-[100px] -bottom-[150px] -left-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-[11px] font-sans font-bold tracking-[3px] uppercase text-amber-accent mb-3 block">
              VISUAL JOURNAL
            </span>
            <h2 className="font-display font-black text-3xl md:text-5xl tracking-tight text-white mb-2 select-none">
              Captured Moments
            </h2>
            <p className="text-text-secondary text-sm md:text-base font-sans font-medium max-w-xl">
              Exploring the intersections of culture, landscapes, and light through the lens of a traveler.
            </p>
          </div>

          <Link
            href="/photography"
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-white/10 hover:border-amber-accent/30 hover:bg-amber-accent/5 hover:text-amber-accent text-xs font-semibold uppercase tracking-wider transition-all duration-300 font-sans w-fit cursor-pointer"
          >
            Explore Full Gallery <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Albums Preview Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="w-full h-80 rounded-2xl bg-white/2 border border-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {albums.map((album) => (
              <Link
                key={album.id || album.slug}
                href={`/photography#${album.slug}`}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                className="group relative h-96 rounded-2xl overflow-hidden border border-white/5 bg-black shadow-2xl flex flex-col justify-end p-6 hover:border-amber-accent/35 transition-all duration-500"
              >
                {/* Image background with zoom on hover */}
                <div className="absolute inset-0 z-0">
                  <img
                    src={album.coverImage}
                    alt={album.title}
                    onContextMenu={(e) => e.preventDefault()}
                    onDragStart={(e) => e.preventDefault()}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-75 select-none pointer-events-none -webkit-user-select-none -webkit-touch-callout-none touch-action-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
                </div>

                {/* Content Overlay */}
                <div className="relative z-20 flex flex-col">
                  <div className="flex items-center gap-1.5 text-amber-accent mb-2.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-sans font-bold tracking-widest uppercase">
                      {album.title === "Nongjrong Clouds" ? "MEGHALAYA" : album.title === "Banaras Ghats" ? "VARANASI" : "ROAD TRIP"}
                    </span>
                  </div>

                  <h3 className="font-display font-extrabold text-xl text-white mb-2 tracking-wide group-hover:text-amber-accent transition-colors">
                    {album.title}
                  </h3>

                  <p className="text-text-secondary text-xs line-clamp-2 leading-relaxed mb-4 font-sans font-medium">
                    {album.description}
                  </p>

                  <div className="flex items-center gap-1 text-[11px] font-bold text-white uppercase tracking-wider group-hover:translate-x-1.5 transition-transform">
                    <span>View Album</span>
                    <ArrowRight className="w-3 h-3 text-amber-accent" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
