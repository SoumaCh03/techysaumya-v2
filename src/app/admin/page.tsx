"use client";

import React, { useState, useEffect } from "react";
import { 
  LogIn, Plus, Trash2, ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
  Upload, Image as ImageIcon, Settings, LogOut, Loader2, Sparkles, LayoutGrid
} from "lucide-react";
import confetti from "canvas-confetti";

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

export default function AdminPage() {
  // 1. Session State
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [checkingSession, setCheckingSession] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Login fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // 2. Data State
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  // Form states
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [newAlbumDesc, setNewAlbumDesc] = useState("");
  const [newAlbumSlug, setNewAlbumSlug] = useState("");
  const [showAddAlbum, setShowAddAlbum] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Upload state
  const [uploading, setUploading] = useState(false);

  // 3. Authenticate on initial load
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/admin/login");
        if (res.ok) {
          const json = await res.json();
          if (json.authenticated) {
            setAuthenticated(true);
            fetchAlbums();
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setCheckingSession(false);
      }
    }
    checkSession();
  }, []);

  // Fetch albums helper
  const fetchAlbums = async () => {
    try {
      const res = await fetch("/api/admin/albums");
      if (res.ok) {
        const data = await res.json();
        setAlbums(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // 4. Authentication triggers
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) {
        setAuthenticated(true);
        fetchAlbums();
        confetti({ particleCount: 80, spread: 60 });
      } else {
        const json = await res.json();
        setLoginError(json.message || "Invalid credentials.");
      }
    } catch (e) {
      setLoginError("Failed to contact login API.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (!confirm("Are you sure you want to log out?")) return;
    try {
      await fetch("/api/admin/login", { method: "DELETE" });
      setAuthenticated(false);
      setSelectedAlbum(null);
    } catch (e) {
      console.error(e);
    }
  };

  // 5. Album Operations
  const handleCreateAlbum = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!newAlbumTitle || !newAlbumSlug) {
      setErrorMsg("Title and Slug are required.");
      return;
    }

    try {
      const res = await fetch("/api/admin/albums", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newAlbumTitle,
          description: newAlbumDesc,
          slug: newAlbumSlug,
        }),
      });

      if (res.ok) {
        setSuccessMsg("Album created successfully!");
        setNewAlbumTitle("");
        setNewAlbumDesc("");
        setNewAlbumSlug("");
        setShowAddAlbum(false);
        fetchAlbums();
        confetti({ particleCount: 50, spread: 45 });
      } else {
        const json = await res.json();
        setErrorMsg(json.error || "Failed to create album.");
      }
    } catch (e) {
      setErrorMsg("Connection error.");
    }
  };

  const handleDeleteAlbum = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the entire album "${name}" and all of its images?`)) return;
    
    try {
      const res = await fetch(`/api/admin/albums?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchAlbums();
        if (selectedAlbum?.id === id) {
          setSelectedAlbum(null);
        }
      } else {
        alert("Failed to delete album.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Reshuffle Album Order (Move Up/Down)
  const shiftAlbumOrder = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= albums.length) return;

    const reordered = [...albums];
    // Swap positions
    const temp = reordered[index];
    reordered[index] = reordered[newIndex];
    reordered[newIndex] = temp;

    // Recalculate orders
    const payload = reordered.map((alb, idx) => ({
      id: alb.id,
      order: idx + 1,
    }));

    // Update locally immediately for instant feedback
    const optimistic = reordered.map((alb, idx) => ({ ...alb, order: idx + 1 }));
    setAlbums(optimistic);

    try {
      const res = await fetch("/api/admin/albums", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ albums: payload }),
      });
      if (!res.ok) {
        fetchAlbums(); // Rollback if error
      }
    } catch (e) {
      fetchAlbums();
    }
  };

  // 6. Photo Operations
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedAlbum) return;

    setUploading(true);
    let successfullyUploaded = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          
          // Append new photo structure
          const newPhoto: Photo = {
            id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            url: data.url,
            title: file.name.split(".")[0] || "Photo",
            order: (selectedAlbum.images?.length || 0) + successfullyUploaded + 1,
          };

          selectedAlbum.images = [...(selectedAlbum.images || []), newPhoto];
          successfullyUploaded++;
        }
      } catch (err) {
        console.error("Upload error for file:", file.name, err);
      }
    }

    if (successfullyUploaded > 0) {
      // Save changes to database
      await updateSingleAlbum(selectedAlbum);
      confetti({ particleCount: 40, colors: ["#00F0FF", "#ffffff"] });
    }

    setUploading(false);
  };

  const handleSetCover = async (photoUrl: string) => {
    if (!selectedAlbum) return;
    selectedAlbum.coverImage = photoUrl;
    await updateSingleAlbum(selectedAlbum);
    alert("Cover image set successfully!");
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!selectedAlbum) return;
    if (!confirm("Are you sure you want to remove this photo?")) return;

    const filtered = selectedAlbum.images.filter((img) => img.id !== photoId);
    
    // Re-index remaining images
    selectedAlbum.images = filtered.map((img, idx) => ({ ...img, order: idx + 1 }));
    await updateSingleAlbum(selectedAlbum);
  };

  // Shift Photo Order (Move Left/Right)
  const shiftPhotoOrder = async (index: number, direction: "left" | "right") => {
    if (!selectedAlbum) return;
    const newIndex = direction === "left" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= selectedAlbum.images.length) return;

    const reordered = [...selectedAlbum.images];
    const temp = reordered[index];
    reordered[index] = reordered[newIndex];
    reordered[newIndex] = temp;

    // Recalculate order indices
    selectedAlbum.images = reordered.map((img, idx) => ({ ...img, order: idx + 1 }));
    
    // Set local state optimistically
    setSelectedAlbum({ ...selectedAlbum });
    
    await updateSingleAlbum(selectedAlbum);
  };

  // Update helper
  const updateSingleAlbum = async (album: Album) => {
    try {
      const res = await fetch("/api/admin/albums", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ singleAlbum: album }),
      });
      if (res.ok) {
        fetchAlbums();
      } else {
        alert("Failed to update database.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Auto-slugify helper
  const handleTitleChange = (val: string) => {
    setNewAlbumTitle(val);
    setNewAlbumSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  // 7. Render Views
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center relative z-10">
        <Loader2 className="w-10 h-10 text-cyan-accent animate-spin" />
        <p className="text-text-secondary mt-4 font-mono text-sm">Authenticating portfolio security...</p>
      </div>
    );
  }

  // 7A. Login Form View
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center px-4 relative z-10 py-12">
        <div className="w-full max-w-md glass-panel p-8 rounded-3xl relative border-white/5 shadow-black/90">
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-cyan-accent/5 rounded-full filter blur-[40px] pointer-events-none" />
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-cyan-accent/10 border border-cyan-accent/25 flex items-center justify-center text-cyan-accent mb-4">
              <LogIn className="w-6 h-6" />
            </div>
            <h1 className="font-display font-black text-2xl tracking-tight text-white">Admin Access</h1>
            <p className="text-text-secondary text-sm mt-1 font-sans font-medium text-center">
              TechySaumya Portfolio Management Panel
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase text-text-secondary mb-2">Username</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/2 text-white outline-none focus:border-cyan-accent/40 font-sans transition-all text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase text-text-secondary mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/2 text-white outline-none focus:border-cyan-accent/40 font-sans transition-all text-sm"
              />
            </div>

            {loginError && (
              <p className="text-red-500 font-sans text-xs text-center font-medium bg-red-500/10 py-2.5 rounded-lg border border-red-500/20">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-accent to-cyan-500 text-bg-base font-bold tracking-wider uppercase hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>Sign In <Sparkles className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 7B. Admin Dashboard View
  return (
    <div className="min-h-screen bg-bg-base text-text-primary px-4 md:px-8 py-24 relative z-10 max-w-7xl mx-auto flex flex-col w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/5 pb-6 mb-8 w-full">
        <div>
          <h1 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight flex items-center gap-3">
            <LayoutGrid className="w-8 h-8 text-cyan-accent" /> Control Center
          </h1>
          <p className="text-text-secondary font-medium font-sans text-sm md:text-base mt-1">
            Manage photo collections, shuffle orders, and update content in real-time.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400 font-sans text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Main Grid split */}
      {!selectedAlbum ? (
        // ================= ALBUM DIRECTORY =================
        <div className="flex flex-col gap-8 w-full">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-xl md:text-2xl text-white">Photo Albums ({albums.length})</h2>
            <button
              onClick={() => setShowAddAlbum(!showAddAlbum)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-accent text-bg-base font-bold font-sans text-xs uppercase tracking-wider hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:scale-[1.02] transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> New Album
            </button>
          </div>

          {/* Add Album Drawer */}
          {showAddAlbum && (
            <form onSubmit={handleCreateAlbum} className="glass-panel p-6 rounded-2xl border-white/5 max-w-xl flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
              <h3 className="font-display font-bold text-lg text-white">Create New Collection</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold tracking-wider text-text-secondary mb-1.5 uppercase">Title</label>
                  <input
                    type="text"
                    required
                    value={newAlbumTitle}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Darjeeling Fog"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/2 text-white outline-none focus:border-cyan-accent/30 text-sm font-sans"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-wider text-text-secondary mb-1.5 uppercase">Slug</label>
                  <input
                    type="text"
                    required
                    value={newAlbumSlug}
                    onChange={(e) => setNewAlbumSlug(e.target.value)}
                    placeholder="e.g. darjeeling-fog"
                    className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/2 text-text-secondary outline-none focus:border-cyan-accent/30 text-sm font-sans font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider text-text-secondary mb-1.5 uppercase">Description</label>
                <textarea
                  value={newAlbumDesc}
                  onChange={(e) => setNewAlbumDesc(e.target.value)}
                  placeholder="Tell the story of this photography trip..."
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/2 text-white outline-none focus:border-cyan-accent/30 text-sm font-sans resize-none"
                />
              </div>

              {errorMsg && <p className="text-red-500 font-sans text-xs font-medium">{errorMsg}</p>}
              {successMsg && <p className="text-cyan-accent font-sans text-xs font-medium">{successMsg}</p>}

              <div className="flex items-center gap-3 mt-2 justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddAlbum(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/5 text-text-secondary hover:text-white text-xs font-semibold uppercase tracking-wider font-sans cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-cyan-accent text-bg-base font-bold text-xs uppercase tracking-wider font-sans hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] cursor-pointer"
                >
                  Create
                </button>
              </div>
            </form>
          )}

          {/* Albums grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {albums.map((album, idx) => (
              <div
                key={album.id}
                className="glass-panel border-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col group relative"
              >
                {/* Image aspect ratio container */}
                <div className="w-full h-44 overflow-hidden relative bg-black">
                  <img
                    src={album.coverImage}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-xs font-sans font-semibold tracking-wide text-cyan-accent">
                    {album.images?.length || 0} Photos
                  </div>
                </div>

                {/* Body details */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-display font-extrabold text-lg text-white mb-1.5">{album.title}</h3>
                  <p className="text-text-secondary text-xs line-clamp-2 leading-relaxed mb-5 font-sans font-medium flex-grow">
                    {album.description || "No description provided."}
                  </p>

                  <div className="flex items-center justify-between gap-4 mt-auto">
                    <button
                      onClick={() => setSelectedAlbum(album)}
                      className="px-4 py-2 rounded-lg bg-white/5 hover:bg-cyan-accent/15 border border-white/10 hover:border-cyan-accent/30 text-white hover:text-cyan-accent font-sans text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-1.5 flex-grow justify-center cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> Edit Photos
                    </button>
                    
                    <button
                      onClick={() => handleDeleteAlbum(album.id, album.title)}
                      className="p-2.5 rounded-lg border border-white/10 hover:border-red-500/35 hover:bg-red-500/5 text-text-secondary hover:text-red-400 transition-all cursor-pointer"
                      title="Delete Album"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Reshuffle Album Order arrows (floating overlay) */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    disabled={idx === 0}
                    onClick={() => shiftAlbumOrder(idx, "up")}
                    className="p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white disabled:opacity-40 disabled:hover:scale-100 hover:scale-105 active:scale-95 transition-all hover:text-cyan-accent cursor-pointer"
                    title="Move Album Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    disabled={idx === albums.length - 1}
                    onClick={() => shiftAlbumOrder(idx, "down")}
                    className="p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white disabled:opacity-40 disabled:hover:scale-100 hover:scale-105 active:scale-95 transition-all hover:text-cyan-accent cursor-pointer"
                    title="Move Album Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // ================= SINGLE ALBUM PHOTO VIEWER / EDITOR =================
        <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-left-4 duration-300">
          {/* Nav header */}
          <div className="flex items-center gap-4 border-b border-white/5 pb-5">
            <button
              onClick={() => { setSelectedAlbum(null); fetchAlbums(); }}
              className="p-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-text-secondary hover:text-white transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-cyan-accent">Collection Editor</span>
              <h2 className="font-display font-black text-2xl md:text-3xl text-white mt-0.5">{selectedAlbum.title}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
            {/* LEFT 2/3 COLUMN: IMAGE GRID */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-lg text-white">Album Photos ({selectedAlbum.images?.length || 0})</h3>
                <p className="text-text-secondary text-xs font-sans font-medium">Use the arrows on cards to reshuffle photo positions.</p>
              </div>

              {selectedAlbum.images?.length === 0 ? (
                <div className="w-full py-16 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center text-text-secondary">
                  <ImageIcon className="w-12 h-12 text-white/15 mb-3" />
                  <p className="font-sans font-semibold text-white/60">No photos in this album yet.</p>
                  <p className="text-xs mt-1 font-sans font-medium">Drag-and-drop or select file uploads on the right panel.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {selectedAlbum.images.map((photo, idx) => (
                    <div
                      key={photo.id}
                      className="glass-panel border-white/5 rounded-xl overflow-hidden relative group aspect-square flex flex-col bg-black shadow-lg"
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                        className="w-full h-full object-cover opacity-80"
                      />

                      {/* Photo card top hover tools */}
                      <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <button
                          onClick={() => handleSetCover(photo.url)}
                          className="p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold font-sans hover:text-cyan-accent text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
                          title="Set as Album Cover"
                        >
                          Cover
                        </button>
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-red-400 hover:text-red-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                          title="Delete Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Shift Photo Order arrows overlay */}
                      <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                        <button
                          disabled={idx === 0}
                          onClick={() => shiftPhotoOrder(idx, "left")}
                          className="p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white disabled:opacity-40 disabled:hover:scale-100 hover:scale-105 active:scale-95 transition-all hover:text-cyan-accent cursor-pointer"
                          title="Shift Left"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          disabled={idx === selectedAlbum.images.length - 1}
                          onClick={() => shiftPhotoOrder(idx, "right")}
                          className="p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white disabled:opacity-40 disabled:hover:scale-100 hover:scale-105 active:scale-95 transition-all hover:text-cyan-accent cursor-pointer"
                          title="Shift Right"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Display image order badge */}
                      <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[10px] font-mono text-text-secondary z-10 font-bold">
                        #{photo.order}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: ACTIONS PANEL */}
            <div className="flex flex-col gap-6">
              {/* Image Uploader widget */}
              <div className="glass-panel border-white/5 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 relative">
                <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-cyan-accent" /> Upload Photos
                </h3>

                <div className="border border-dashed border-white/10 hover:border-cyan-accent/30 bg-white/2 hover:bg-cyan-accent/2 transition-colors rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer relative group">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                  />
                  
                  {uploading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="w-10 h-10 text-cyan-accent animate-spin mb-3" />
                      <p className="font-sans font-semibold text-sm text-white">Uploading media...</p>
                      <p className="text-text-secondary text-xs mt-1">Please wait for cloud synchronization.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-10 h-10 text-text-secondary group-hover:text-cyan-accent group-hover:scale-105 transition-all mb-3" />
                      <p className="font-sans font-semibold text-sm text-white">Drag &amp; drop photos here</p>
                      <p className="text-text-secondary text-xs mt-1">Or click to browse files</p>
                    </div>
                  )}
                </div>

                <p className="text-text-muted text-[10px] font-sans font-medium leading-relaxed leading-normal">
                  Upload multiple JPG, PNG, or WebP files. High-resolution images will be automatically optimized and scaled.
                </p>
              </div>

              {/* Album metadata card */}
              <div className="glass-panel border-white/5 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 relative">
                <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                  <Settings className="w-5 h-5 text-cyan-accent" /> Album Config
                </h3>

                <div className="w-full h-28 rounded-xl overflow-hidden border border-white/5 bg-black relative">
                  <img
                    src={selectedAlbum.coverImage}
                    alt={selectedAlbum.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center font-display font-extrabold text-xs text-white/80">
                    Current Cover Image
                  </div>
                </div>

                <div className="flex flex-col gap-3 font-sans font-medium text-xs text-text-secondary">
                  <p><strong>Slug:</strong> /{selectedAlbum.slug}</p>
                  <p><strong>Database ID:</strong> {selectedAlbum.id}</p>
                  <p><strong>Order Index:</strong> {selectedAlbum.order}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
