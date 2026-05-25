"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Camera, X, ArrowLeft as ChevronLeft, ArrowRight as ChevronRight, Calendar } from "lucide-react";

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

export default function PhotographyPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeAlbum, setActiveAlbum] = useState<Album | null>(null);
  
  // Lightbox States
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(-1);

  useEffect(() => {
    async function fetchAlbums() {
      try {
        const res = await fetch("/api/admin/albums");
        if (res.ok) {
          const data: Album[] = await res.json();
          setAlbums(data);

          // Handle url hash routing to specific album directly (e.g. /photography#nongjrong)
          const hash = window.location.hash.replace("#", "");
          if (hash) {
            const found = data.find((a) => a.slug === hash);
            if (found) {
              setActiveAlbum(found);
            } else {
              setActiveAlbum(data[0] || null);
            }
          } else {
            setActiveAlbum(data[0] || null);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchAlbums();
  }, []);

  const selectAlbum = (album: Album) => {
    setActiveAlbum(album);
    window.location.hash = album.slug;
  };

  const openLightbox = (photo: Photo, index: number) => {
    setLightboxPhoto(photo);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxPhoto(null);
    setLightboxIndex(-1);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    if (!activeAlbum || !activeAlbum.images) return;
    const imagesCount = activeAlbum.images.length;
    let nextIdx = direction === "prev" ? lightboxIndex - 1 : lightboxIndex + 1;

    if (nextIdx < 0) nextIdx = imagesCount - 1;
    if (nextIdx >= imagesCount) nextIdx = 0;

    setLightboxIndex(nextIdx);
    setLightboxPhoto(activeAlbum.images[nextIdx]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center relative z-10">
        <div className="w-8 h-8 rounded-full border-2 border-amber-accent border-t-transparent animate-spin" />
        <p className="text-text-secondary mt-4 font-mono text-sm">Loading photography gallery...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-base text-text-primary px-4 md:px-8 py-24 relative z-10 max-w-7xl mx-auto flex flex-col w-full">
      {/* Back to Home */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-text-secondary hover:text-white text-xs font-semibold uppercase tracking-wider transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
      </div>

      {/* Header */}
      <header className="border-b border-white/5 pb-8 mb-12 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <span className="text-[11px] font-sans font-bold tracking-[3px] uppercase text-amber-accent mb-2 block">
            VISUAL TRAVEL DIARY
          </span>
          <h1 className="font-display font-black text-3xl md:text-5xl text-white tracking-tight leading-none flex items-center gap-3">
            <Camera className="w-7 h-7 text-amber-accent" /> SnappySaumya
          </h1>
          <p className="text-text-secondary font-medium font-sans mt-3 text-sm md:text-base max-w-xl leading-relaxed">
            Visual storytelling, street narratives, and high mountain expeditions recorded along the road.
          </p>
        </div>

        {/* Album Selector Pills */}
        <div className="flex flex-wrap gap-2">
          {albums.map((album) => (
            <button
              key={album.id}
              onClick={() => selectAlbum(album)}
              className={`px-4.5 py-2.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeAlbum?.id === album.id
                  ? "bg-amber-accent text-bg-base border-amber-accent font-bold"
                  : "border-white/10 hover:border-white/20 text-text-secondary hover:text-white bg-white/2"
              }`}
            >
              {album.title}
            </button>
          ))}
        </div>
      </header>

      {/* Selected Album Details & Grid */}
      {activeAlbum && (
        <div className="flex flex-col gap-8 w-full animate-in fade-in duration-550">
          
          {/* Album Title card */}
          <div className="glass-panel border-white/5 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-amber-accent mb-2 text-xs font-bold font-sans uppercase tracking-widest">
                <MapPin className="w-4 h-4" /> Location album
              </div>
              <h2 className="font-display font-black text-2xl md:text-3xl text-white tracking-tight leading-none mb-3">
                {activeAlbum.title}
              </h2>
              <p className="text-text-secondary text-xs md:text-sm font-sans font-medium leading-relaxed">
                {activeAlbum.description}
              </p>
            </div>
            
            <div className="px-4 py-2 bg-white/3 border border-white/5 rounded-xl text-xs font-mono font-medium text-text-secondary flex-shrink-0">
              {activeAlbum.images?.length || 0} Captures
            </div>
          </div>

          {/* Photo Grid */}
          {activeAlbum.images?.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center text-text-secondary text-center">
              <Camera className="w-12 h-12 text-white/10 mb-4" />
              <p className="font-semibold text-white/60">No photos in this collection.</p>
              <p className="text-xs mt-1">Upload images via the administration window to view them here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full">
              {activeAlbum.images.map((photo, idx) => (
                <div
                  key={photo.id}
                  onClick={() => openLightbox(photo, idx)}
                  className="group relative rounded-2xl overflow-hidden aspect-square border border-white/5 bg-black/60 shadow-2xl cursor-pointer hover:border-amber-accent/35 transition-all duration-300"
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 opacity-80 group-hover:opacity-95"
                  />
                  {/* Photo Title Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
                    <span className="text-white font-sans text-xs font-semibold tracking-wide uppercase">
                      {photo.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxPhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-200">
          
          {/* Close trigger */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all cursor-pointer z-50"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left Arrow */}
          <button
            onClick={() => navigateLightbox("prev")}
            className="absolute left-4 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all cursor-pointer z-40 hidden md:block"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Main Image Aspect Ratio */}
          <div className="relative max-w-4xl max-h-[80vh] w-full h-full flex flex-col items-center justify-center">
            <img
              src={lightboxPhoto.url}
              alt={lightboxPhoto.title}
              className="max-w-full max-h-[72vh] object-contain rounded-lg shadow-2xl select-none"
            />
            {/* Title details at bottom */}
            <div className="mt-4 text-center">
              <span className="text-white font-sans text-xs font-bold tracking-wider uppercase">
                {lightboxPhoto.title}
              </span>
              <p className="text-text-muted text-[10px] font-mono mt-1">
                IMAGE {lightboxIndex + 1} OF {activeAlbum?.images?.length || 0}
              </p>
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => navigateLightbox("next")}
            className="absolute right-4 p-3 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all cursor-pointer z-40 hidden md:block"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

    </div>
  );
}
