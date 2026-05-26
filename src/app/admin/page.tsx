"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  LogIn, Plus, Trash2, ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
  Upload, Image as ImageIcon, Settings, LogOut, Loader2, Sparkles, LayoutGrid,
  Edit2, KeyRound, Mail, User, ShieldAlert, CheckCircle2, AlertCircle, X,
  FileText, Bold, Heading, Link2, List, Quote, Eye, EyeOff, Globe, Sparkle
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

interface UploadQueueItem {
  id: string;
  name: string;
  status: "pending" | "converting" | "uploading" | "success" | "failed";
  progress: number;
  url?: string;
}

interface ModalConfig {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  isConfirm: boolean;
}

// Custom Markdown to Safe HTML parser for preview mode inside the editor
function markdownToHtml(markdown: string): string {
  if (!markdown) return "";
  let html = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headers
  html = html.replace(/^# (.*?)$/gm, '<h1 class="text-3xl font-display font-black text-white mt-8 mb-4 tracking-tight">$1</h1>');
  html = html.replace(/^## (.*?)$/gm, '<h2 class="text-2xl font-display font-bold text-white mt-6 mb-3 border-b border-white/5 pb-2">$1</h2>');
  html = html.replace(/^### (.*?)$/gm, '<h3 class="text-xl font-display font-semibold text-white mt-4 mb-2">$1</h3>');

  // Images: ![alt](url)
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<div class="my-6 rounded-2xl overflow-hidden border border-white/5 bg-black shadow-lg"><img src="$2" alt="$1" class="w-full h-auto object-cover max-h-[400px]" /><p class="text-[11px] text-center text-text-muted mt-2 font-sans font-medium">$1</p></div>');

  // Links: [label](url)
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-cyan-accent hover:underline font-semibold">$1</a>');

  // Bold: **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');

  // Code: `code`
  html = html.replace(/`(.*?)`/g, '<code class="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded font-mono text-xs text-cyan-accent">$1</code>');

  // Blockquotes: > quote
  html = html.replace(/^> (.*?)$/gm, '<blockquote class="border-l-4 border-cyan-accent bg-cyan-accent/5 px-4 py-3 my-4 rounded-r-xl text-text-secondary italic font-sans">$1</blockquote>');

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
        listLine += '<ul class="list-disc list-inside text-text-secondary text-sm md:text-base leading-relaxed my-4 flex flex-col gap-2 font-sans font-medium pl-4">';
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
    return `<p class="text-text-secondary text-sm md:text-base leading-relaxed my-4 font-sans font-medium">${trimmed}</p>`;
  }).join("\n");

  return html;
}

export default function AdminPage() {
  // 1. View & Session State
  const [currentView, setCurrentView] = useState<"login" | "forgot-password" | "forgot-username" | "reset-password">("login");
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [checkingSession, setCheckingSession] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"albums" | "blogs">("albums");
  
  // Login fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Recovery & Reset fields
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoverySuccessMsg, setRecoverySuccessMsg] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenChecking, setTokenChecking] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 2. Custom Modals & Dialogs State
  const [modal, setModal] = useState<ModalConfig>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    isConfirm: false
  });

  // 3. Data State
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);

  // Form states (Add Album)
  const [newAlbumTitle, setNewAlbumTitle] = useState("");
  const [newAlbumDesc, setNewAlbumDesc] = useState("");
  const [newAlbumSlug, setNewAlbumSlug] = useState("");
  const [showAddAlbum, setShowAddAlbum] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Album inline editing config
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editSlug, setEditSlug] = useState("");

  // Photo inline renaming states
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [editingPhotoTitle, setEditingPhotoTitle] = useState<string>("");

  // 4. Blog Data & Form States
  const [blogs, setBlogs] = useState<any[]>([]);
  const [showAddBlog, setShowAddBlog] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [blogEditorTab, setBlogEditorTab] = useState<"edit" | "preview">("edit");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Blog fields
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSlug, setBlogSlug] = useState("");
  const [blogSummary, setBlogSummary] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogCoverImage, setBlogCoverImage] = useState("");
  const [blogTagsString, setBlogTagsString] = useState(""); // Comma separated
  const [blogStatus, setBlogStatus] = useState<"draft" | "published">("draft");

  // 5. Drag & Drop States (Albums & Photos)
  const [draggedAlbumIndex, setDraggedAlbumIndex] = useState<number | null>(null);
  const [dragOverAlbumIndex, setDragOverAlbumIndex] = useState<number | null>(null);
  const [draggedPhotoIndex, setDraggedPhotoIndex] = useState<number | null>(null);
  const [dragOverPhotoIndex, setDragOverPhotoIndex] = useState<number | null>(null);

  // 6. Upload Queue state
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [uploading, setUploading] = useState(false);

  // Modal helpers
  const showAlert = (title: string, message: string) => {
    setModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => setModal(prev => ({ ...prev, isOpen: false })),
      isConfirm: false
    });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void | Promise<void>) => {
    setModal({
      isOpen: true,
      title,
      message,
      onConfirm: async () => {
        await onConfirm();
        setModal(prev => ({ ...prev, isOpen: false }));
      },
      isConfirm: true
    });
  };

  // 7. Authenticate & URL parameters on initial load
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/admin/login");
        if (res.ok) {
          const json = await res.json();
          if (json.authenticated) {
            setAuthenticated(true);
            fetchAlbums();
            fetchBlogs();
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setCheckingSession(false);
      }
    }

    const params = new URLSearchParams(window.location.search);
    const token = params.get("reset");
    if (token) {
      setResetToken(token);
      setCurrentView("reset-password");
      validateResetToken(token);
      setCheckingSession(false);
    } else {
      checkSession();
    }
  }, []);

  const validateResetToken = async (token: string) => {
    setTokenChecking(true);
    try {
      const res = await fetch(`/api/admin/reset-password?token=${token}`);
      const json = await res.json();
      setTokenValid(json.valid);
    } catch (e) {
      setTokenValid(false);
    } finally {
      setTokenChecking(false);
    }
  };

  // Fetch data helpers
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

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/admin/blogs");
      if (res.ok) {
        const data = await res.json();
        setBlogs(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Synchronize album config states when selected album changes
  useEffect(() => {
    if (selectedAlbum) {
      setEditTitle(selectedAlbum.title);
      setEditDesc(selectedAlbum.description);
      setEditSlug(selectedAlbum.slug);
    }
  }, [selectedAlbum]);

  // 8. Authentication triggers
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
        fetchBlogs();
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

  const handleLogout = () => {
    showConfirm(
      "Confirm Log Out",
      "Are you sure you want to end your administration session?",
      async () => {
        try {
          await fetch("/api/admin/login", { method: "DELETE" });
          setAuthenticated(false);
          setSelectedAlbum(null);
          setEditingBlogId(null);
          setShowAddBlog(false);
        } catch (e) {
          console.error(e);
        }
      }
    );
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setRecoverySuccessMsg("");
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recoveryEmail }),
      });
      const json = await res.json();
      if (res.ok) {
        setRecoverySuccessMsg(json.message || "Email dispatched successfully.");
        showAlert("Check Your Inbox", json.message || "A secure recovery link has been sent to your recovery email.");
      } else {
        setErrorMsg(json.error || "Failed to trigger recovery process.");
      }
    } catch (e) {
      setErrorMsg("Failed to connect to recovery server.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setRecoverySuccessMsg("");
    try {
      const res = await fetch("/api/admin/forgot-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: recoveryEmail }),
      });
      const json = await res.json();
      if (res.ok) {
        setRecoverySuccessMsg(json.message || "Username retrieved successfully.");
        showAlert("Check Your Inbox", json.message || "Your username has been emailed to you.");
      } else {
        setErrorMsg(json.error || "Failed to trigger username recovery.");
      }
    } catch (e) {
      setErrorMsg("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showAlert("Error", "Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      showAlert("Error", "Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, password: newPassword }),
      });
      const json = await res.json();
      if (res.ok) {
        showAlert("Success", "Password updated successfully. You can now sign in with your new credentials.");
        setCurrentView("login");
        setResetToken("");
        window.history.replaceState({}, document.title, window.location.pathname);
      } else {
        showAlert("Error", json.error || "Failed to update password.");
      }
    } catch (e) {
      showAlert("Error", "Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  // 9. Album Operations
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

  const handleDeleteAlbum = (id: string, name: string) => {
    showConfirm(
      "Delete Album",
      `Are you sure you want to permanently delete the entire album "${name}"? This action deletes all of its photos from the database and cannot be undone.`,
      async () => {
        try {
          const res = await fetch(`/api/admin/albums?id=${id}`, { method: "DELETE" });
          if (res.ok) {
            fetchAlbums();
            if (selectedAlbum?.id === id) {
              setSelectedAlbum(null);
            }
          } else {
            showAlert("Error", "Failed to delete album.");
          }
        } catch (e) {
          console.error(e);
        }
      }
    );
  };

  const handleSaveAlbumConfig = async () => {
    if (!selectedAlbum) return;
    if (!editTitle.trim() || !editSlug.trim()) {
      showAlert("Error", "Album Title and Slug are required.");
      return;
    }
    const updatedAlbum = {
      ...selectedAlbum,
      title: editTitle,
      description: editDesc,
      slug: editSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    };
    setSelectedAlbum(updatedAlbum);
    await updateSingleAlbum(updatedAlbum);
    showAlert("Success", "Album configurations updated and saved successfully!");
  };

  const shiftAlbumOrder = async (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= albums.length) return;

    const reordered = [...albums];
    const temp = reordered[index];
    reordered[index] = reordered[newIndex];
    reordered[newIndex] = temp;

    const payload = reordered.map((alb, idx) => ({
      id: alb.id,
      order: idx + 1,
    }));

    const optimistic = reordered.map((alb, idx) => ({ ...alb, order: idx + 1 }));
    setAlbums(optimistic);

    try {
      const res = await fetch("/api/admin/albums", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ albums: payload }),
      });
      if (!res.ok) {
        fetchAlbums();
      }
    } catch (e) {
      fetchAlbums();
    }
  };

  const handleAlbumDragStart = (e: React.DragEvent, index: number) => {
    setDraggedAlbumIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleAlbumDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedAlbumIndex === null || draggedAlbumIndex === targetIndex) {
      setDraggedAlbumIndex(null);
      setDragOverAlbumIndex(null);
      return;
    }

    const reordered = [...albums];
    const [removed] = reordered.splice(draggedAlbumIndex, 1);
    reordered.splice(targetIndex, 0, removed);

    const payload = reordered.map((alb, idx) => ({
      id: alb.id,
      order: idx + 1,
    }));

    const optimistic = reordered.map((alb, idx) => ({ ...alb, order: idx + 1 }));
    setAlbums(optimistic);

    setDraggedAlbumIndex(null);
    setDragOverAlbumIndex(null);

    try {
      const res = await fetch("/api/admin/albums", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ albums: payload }),
      });
      if (!res.ok) fetchAlbums();
    } catch (e) {
      fetchAlbums();
    }
  };

  // 10. Photo Operations
  const uploadFileWithXmlHttp = (file: File, queueId: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append("file", file);

      setUploadQueue(prev => prev.map(item => 
        item.id === queueId ? { ...item, status: "uploading" } : item
      ));

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadQueue(prev => prev.map(item => 
            item.id === queueId ? { ...item, progress: percent } : item
          ));
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const res = JSON.parse(xhr.responseText);
            if (res.success) {
              setUploadQueue(prev => prev.map(item => 
                item.id === queueId ? { ...item, status: "success", progress: 100, url: res.url } : item
              ));
              resolve(res.url);
            } else {
              reject(new Error(res.error || "Upload failed."));
            }
          } catch (e) {
            reject(e);
          }
        } else {
          reject(new Error(`Server returned status: ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => reject(new Error("Network connection error.")));
      xhr.open("POST", "/api/admin/upload");
      xhr.send(formData);
    });
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !selectedAlbum) return;

    setUploading(true);
    
    const filesList = Array.from(files);
    const newQueueItems: UploadQueueItem[] = filesList.map((file, idx) => ({
      id: `upload-${Date.now()}-${idx}`,
      name: file.name,
      status: "pending",
      progress: 0,
    }));
    
    setUploadQueue(newQueueItems);

    let successfullyUploaded = 0;
    let albumImages = [...(selectedAlbum.images || [])];

    for (let i = 0; i < filesList.length; i++) {
      const file = filesList[i];
      const item = newQueueItems[i];

      setUploadQueue(prev => prev.map(q => 
        q.id === item.id ? { ...q, status: "converting" } : q
      ));
      await new Promise(r => setTimeout(r, 450));

      try {
        const cloudUrl = await uploadFileWithXmlHttp(file, item.id);
        
        const newPhoto: Photo = {
          id: `photo-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          url: cloudUrl,
          title: file.name.split(".")[0] || "Photo",
          order: albumImages.length + 1,
        };

        albumImages = [...albumImages, newPhoto];
        successfullyUploaded++;
      } catch (err) {
        console.error("Upload error for file:", file.name, err);
        setUploadQueue(prev => prev.map(q => 
          q.id === item.id ? { ...q, status: "failed" } : q
        ));
      }
    }

    if (successfullyUploaded > 0) {
      const updated = { ...selectedAlbum, images: albumImages };
      setSelectedAlbum(updated);
      await updateSingleAlbum(updated);
      confetti({ particleCount: 40, colors: ["#00F0FF", "#ffffff"] });
    }

    setUploading(false);
  };

  const handleSetCover = async (photoUrl: string) => {
    if (!selectedAlbum) return;
    selectedAlbum.coverImage = photoUrl;
    await updateSingleAlbum(selectedAlbum);
    showAlert("Cover Set", "Album cover image updated successfully.");
  };

  const handleDeletePhoto = (photoId: string) => {
    if (!selectedAlbum) return;
    showConfirm(
      "Remove Photo",
      "Are you sure you want to remove this photo from the album?",
      async () => {
        const filtered = selectedAlbum.images.filter((img) => img.id !== photoId);
        selectedAlbum.images = filtered.map((img, idx) => ({ ...img, order: idx + 1 }));
        
        setSelectedAlbum({ ...selectedAlbum });
        await updateSingleAlbum(selectedAlbum);
      }
    );
  };

  const handleRenamePhotoSubmit = async (photoId: string) => {
    if (!selectedAlbum || !editingPhotoTitle.trim()) {
      setEditingPhotoId(null);
      return;
    }

    try {
      const res = await fetch("/api/admin/albums", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          albumId: selectedAlbum.id,
          photoId,
          newTitle: editingPhotoTitle.trim()
        }),
      });

      if (res.ok) {
        const updatedImages = selectedAlbum.images.map(img => 
          img.id === photoId ? { ...img, title: editingPhotoTitle.trim() } : img
        );
        const updatedAlbum = { ...selectedAlbum, images: updatedImages };
        setSelectedAlbum(updatedAlbum);
        fetchAlbums();
        setEditingPhotoId(null);
      } else {
        showAlert("Error", "Failed to update photo title.");
      }
    } catch (e) {
      console.error(e);
      showAlert("Error", "Network error renaming photo.");
    }
  };

  const shiftPhotoOrder = async (index: number, direction: "left" | "right") => {
    if (!selectedAlbum) return;
    const newIndex = direction === "left" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= selectedAlbum.images.length) return;

    const reordered = [...selectedAlbum.images];
    const temp = reordered[index];
    reordered[index] = reordered[newIndex];
    reordered[newIndex] = temp;

    selectedAlbum.images = reordered.map((img, idx) => ({ ...img, order: idx + 1 }));
    setSelectedAlbum({ ...selectedAlbum });
    await updateSingleAlbum(selectedAlbum);
  };

  const handlePhotoDragStart = (e: React.DragEvent, index: number) => {
    setDraggedPhotoIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handlePhotoDrop = async (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!selectedAlbum || draggedPhotoIndex === null || draggedPhotoIndex === targetIndex) {
      setDraggedPhotoIndex(null);
      setDragOverPhotoIndex(null);
      return;
    }

    const reordered = [...selectedAlbum.images];
    const [removed] = reordered.splice(draggedPhotoIndex, 1);
    reordered.splice(targetIndex, 0, removed);

    const updatedImages = reordered.map((img, idx) => ({ ...img, order: idx + 1 }));
    const updatedAlbum = { ...selectedAlbum, images: updatedImages };
    
    setSelectedAlbum(updatedAlbum);
    setDraggedPhotoIndex(null);
    setDragOverPhotoIndex(null);

    await updateSingleAlbum(updatedAlbum);
  };

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
        showAlert("Error", "Failed to sync album details with server.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleTitleChange = (val: string) => {
    setNewAlbumTitle(val);
    setNewAlbumSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  // 11. Blog Post Operations
  const resetBlogForm = () => {
    setBlogTitle("");
    setBlogSlug("");
    setBlogSummary("");
    setBlogContent("");
    setBlogCoverImage("");
    setBlogTagsString("");
    setBlogStatus("draft");
    setEditingBlogId(null);
    setBlogEditorTab("edit");
    setErrorMsg("");
  };

  const handleBlogTitleChange = (val: string) => {
    setBlogTitle(val);
    setBlogSlug(val.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const handleStartCreateBlog = () => {
    resetBlogForm();
    setShowAddBlog(true);
  };

  const handleStartEditBlog = (blog: any) => {
    setEditingBlogId(blog._id);
    setBlogTitle(blog.title);
    setBlogSlug(blog.slug);
    setBlogSummary(blog.summary);
    setBlogContent(blog.content);
    setBlogCoverImage(blog.coverImage || "");
    setBlogTagsString((blog.tags || []).join(", "));
    setBlogStatus(blog.status);
    setBlogEditorTab("edit");
    setShowAddBlog(true);
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    
    if (!blogTitle || !blogSlug || !blogSummary || !blogContent) {
      setErrorMsg("Title, Slug, Summary, and Content are required.");
      return;
    }

    try {
      const res = await fetch("/api/admin/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: blogTitle,
          slug: blogSlug,
          summary: blogSummary,
          content: blogContent,
          coverImage: blogCoverImage || undefined,
          tags: blogTagsString.split(",").map(t => t.trim()).filter(Boolean),
          status: blogStatus
        }),
      });

      const json = await res.json();
      if (res.ok) {
        showAlert("Success", "Blog post created and saved successfully!");
        resetBlogForm();
        setShowAddBlog(false);
        fetchBlogs();
        confetti({ particleCount: 50, spread: 45 });
      } else {
        setErrorMsg(json.error || "Failed to create blog post.");
      }
    } catch (e) {
      setErrorMsg("Connection error.");
    }
  };

  const handleSaveBlogEdit = async () => {
    if (!editingBlogId) return;

    if (!blogTitle.trim() || !blogSlug.trim() || !blogSummary.trim() || !blogContent.trim()) {
      showAlert("Error", "Title, Slug, Summary, and Content are required.");
      return;
    }

    try {
      const res = await fetch("/api/admin/blogs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingBlogId,
          title: blogTitle,
          slug: blogSlug,
          summary: blogSummary,
          content: blogContent,
          coverImage: blogCoverImage,
          tags: blogTagsString.split(",").map(t => t.trim()).filter(Boolean),
          status: blogStatus
        }),
      });

      const json = await res.json();
      if (res.ok) {
        showAlert("Success", "Blog post updated and saved successfully!");
        resetBlogForm();
        setShowAddBlog(false);
        fetchBlogs();
      } else {
        showAlert("Error", json.error || "Failed to save blog post details.");
      }
    } catch (e) {
      console.error(e);
      showAlert("Error", "Connection error saving blog post.");
    }
  };

  const handleDeleteBlog = (id: string, title: string) => {
    showConfirm(
      "Delete Blog Post",
      `Are you sure you want to permanently delete the blog post "${title}"? This action cannot be undone.`,
      async () => {
        try {
          const res = await fetch(`/api/admin/blogs?id=${id}`, { method: "DELETE" });
          if (res.ok) {
            fetchBlogs();
            if (editingBlogId === id) {
              resetBlogForm();
              setShowAddBlog(false);
            }
          } else {
            showAlert("Error", "Failed to delete blog post.");
          }
        } catch (e) {
          console.error(e);
        }
      }
    );
  };

  // Image attachment engine for Markdown content editor
  const handleAttachPhotoToBlog = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        const imageMarkdown = `\n![${file.name.split(".")[0] || "Image"}](${data.url})\n`;
        const textarea = textareaRef.current;
        
        if (textarea) {
          const start = textarea.selectionStart;
          const end = textarea.selectionEnd;
          const text = blogContent;
          const updated = text.substring(0, start) + imageMarkdown + text.substring(end);
          setBlogContent(updated);
          
          setTimeout(() => {
            textarea.focus();
            textarea.selectionStart = textarea.selectionEnd = start + imageMarkdown.length;
          }, 100);
        } else {
          setBlogContent(prev => prev + imageMarkdown);
        }
        showAlert("Image Attached", "Optimized WebP photo uploaded and inserted into editor successfully.");
      } else {
        showAlert("Error", data.error || "Failed to upload photo.");
      }
    } catch (err) {
      console.error(err);
      showAlert("Error", "Network error uploading photo.");
    } finally {
      setUploading(false);
    }
  };

  // Inline formatting triggers for Custom Markdown Editor
  const insertMarkdownHelper = (prefix: string, suffix: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = blogContent.substring(start, end);
    const replacement = prefix + selectedText + suffix;
    
    setBlogContent(prev => prev.substring(0, start) + replacement + prev.substring(end));
    
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + prefix.length;
      textarea.selectionEnd = start + prefix.length + selectedText.length;
    }, 100);
  };

  // 12. Render Views
  if (checkingSession) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center relative z-10">
        <Loader2 className="w-10 h-10 text-cyan-accent animate-spin" />
        <p className="text-text-secondary mt-4 font-mono text-sm">Authenticating portfolio security...</p>
      </div>
    );
  }

  // 12A. Login & Recovery Panels View
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center px-4 relative z-10 py-12">
        {/* VIEW: LOGIN */}
        {currentView === "login" && (
          <div className="w-full max-w-md glass-panel p-8 rounded-3xl relative border-white/5 shadow-black/90 animate-in fade-in zoom-in-95 duration-300">
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
                  placeholder="Username"
                  className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/2 text-white outline-none focus:border-cyan-accent/40 font-sans transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-text-secondary mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="abc@#$!123"
                    className="w-full pl-4 pr-11 py-3 rounded-xl border border-white/10 bg-white/2 text-white outline-none focus:border-cyan-accent/40 font-sans transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors focus:outline-none p-1 rounded-md cursor-pointer"
                    title={showPassword ? "Hide Password" : "Show Password"}
                  >
                    {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <p className="text-red-500 font-sans text-xs text-center font-medium bg-red-500/10 py-2.5 rounded-lg border border-red-500/20 flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> {loginError}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-accent to-cyan-500 text-bg-base font-bold tracking-wider uppercase hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>Sign In <Sparkles className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <div className="flex flex-col gap-2 mt-6 pt-6 border-t border-white/5 text-center">
              <button
                onClick={() => { setCurrentView("forgot-password"); setErrorMsg(""); setRecoverySuccessMsg(""); }}
                className="text-cyan-accent/70 hover:text-cyan-accent text-xs font-sans font-medium transition-all"
              >
                Forgot your password?
              </button>
              <button
                onClick={() => { setCurrentView("forgot-username"); setErrorMsg(""); setRecoverySuccessMsg(""); }}
                className="text-text-secondary hover:text-white text-xs font-sans font-medium transition-all"
              >
                Forgot username?
              </button>
            </div>
          </div>
        )}

        {/* VIEW: FORGOT PASSWORD */}
        {currentView === "forgot-password" && (
          <div className="w-full max-w-md glass-panel p-8 rounded-3xl relative border-white/5 shadow-black/90 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-cyan-accent/10 border border-cyan-accent/25 flex items-center justify-center text-cyan-accent mb-4">
                <KeyRound className="w-6 h-6" />
              </div>
              <h1 className="font-display font-black text-2xl tracking-tight text-white">Reset Password</h1>
              <p className="text-text-secondary text-sm mt-1 font-sans font-medium text-center">
                We will send you a secure token link to restore password access.
              </p>
            </div>

            <form onSubmit={handleForgotPassword} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-text-secondary mb-2">Recovery Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-text-secondary" />
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/2 text-white outline-none focus:border-cyan-accent/40 font-sans transition-all text-sm"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-red-500 font-sans text-xs text-center font-medium bg-red-500/10 py-2.5 rounded-lg border border-red-500/20 flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> {errorMsg}
                </p>
              )}

              {recoverySuccessMsg && (
                <p className="text-cyan-accent font-sans text-xs text-center font-medium bg-cyan-accent/10 py-2.5 rounded-lg border border-cyan-accent/20 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {recoverySuccessMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-accent to-cyan-500 text-bg-base font-bold tracking-wider uppercase hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Reset Link"}
              </button>
            </form>

            <button
              onClick={() => { setCurrentView("login"); setErrorMsg(""); setRecoverySuccessMsg(""); }}
              className="w-full text-center mt-6 text-text-secondary hover:text-white text-xs font-sans font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </button>
          </div>
        )}

        {/* VIEW: FORGOT USERNAME */}
        {currentView === "forgot-username" && (
          <div className="w-full max-w-md glass-panel p-8 rounded-3xl relative border-white/5 shadow-black/90 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-cyan-accent/10 border border-cyan-accent/25 flex items-center justify-center text-cyan-accent mb-4">
                <User className="w-6 h-6" />
              </div>
              <h1 className="font-display font-black text-2xl tracking-tight text-white">Find Username</h1>
              <p className="text-text-secondary text-sm mt-1 font-sans font-medium text-center">
                We will look up and mail your registered admin username.
              </p>
            </div>

            <form onSubmit={handleForgotUsername} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-semibold tracking-wider uppercase text-text-secondary mb-2">Recovery Email</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-text-secondary" />
                  <input
                    type="email"
                    required
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/2 text-white outline-none focus:border-cyan-accent/40 font-sans transition-all text-sm"
                  />
                </div>
              </div>

              {errorMsg && (
                <p className="text-red-500 font-sans text-xs text-center font-medium bg-red-500/10 py-2.5 rounded-lg border border-red-500/20 flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> {errorMsg}
                </p>
              )}

              {recoverySuccessMsg && (
                <p className="text-cyan-accent font-sans text-xs text-center font-medium bg-cyan-accent/10 py-2.5 rounded-lg border border-cyan-accent/20 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {recoverySuccessMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-accent to-cyan-500 text-bg-base font-bold tracking-wider uppercase hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Recover Username"}
              </button>
            </form>

            <button
              onClick={() => { setCurrentView("login"); setErrorMsg(""); setRecoverySuccessMsg(""); }}
              className="w-full text-center mt-6 text-text-secondary hover:text-white text-xs font-sans font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </button>
          </div>
        )}

        {/* VIEW: RESET PASSWORD FORM */}
        {currentView === "reset-password" && (
          <div className="w-full max-w-md glass-panel p-8 rounded-3xl relative border-white/5 shadow-black/90 animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-cyan-accent/10 border border-cyan-accent/25 flex items-center justify-center text-cyan-accent mb-4">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h1 className="font-display font-black text-2xl tracking-tight text-white">Create New Password</h1>
              <p className="text-text-secondary text-sm mt-1 font-sans font-medium text-center">
                Define a strong, secure new password for your admin account.
              </p>
            </div>

            {tokenChecking ? (
              <div className="flex flex-col items-center py-6">
                <Loader2 className="w-8 h-8 text-cyan-accent animate-spin" />
                <p className="text-text-secondary text-xs mt-3">Validating recovery link...</p>
              </div>
            ) : !tokenValid ? (
              <div className="flex flex-col items-center py-4 text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
                <p className="text-white font-sans font-bold text-sm">Expired or Invalid Link</p>
                <p className="text-text-secondary text-xs mt-1.5">This reset token is invalid, expired, or has already been used.</p>
                <button
                  onClick={() => { setCurrentView("login"); window.history.replaceState({}, document.title, window.location.pathname); }}
                  className="mt-6 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-sans font-semibold uppercase tracking-wider text-white"
                >
                  Return to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-text-secondary mb-2">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/2 text-white outline-none focus:border-cyan-accent/40 font-sans transition-all text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold tracking-wider uppercase text-text-secondary mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/2 text-white outline-none focus:border-cyan-accent/40 font-sans transition-all text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-accent to-cyan-500 text-bg-base font-bold tracking-wider uppercase hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save New Password"}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    );
  }

  // 12B. Admin Dashboard View
  return (
    <div className="min-h-screen bg-bg-base text-text-primary px-4 md:px-8 py-24 relative z-10 max-w-7xl mx-auto flex flex-col w-full">
      
      {/* Universal custom glassmorphic modal overlay */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border-white/10 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <h3 className="font-display font-bold text-lg text-white mb-2">{modal.title}</h3>
            <p className="text-text-secondary text-sm font-sans font-medium mb-6 leading-relaxed">
              {modal.message}
            </p>
            <div className="flex items-center justify-end gap-3">
              {modal.isConfirm && (
                <button
                  onClick={() => setModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 rounded-xl border border-white/10 text-text-secondary hover:text-white text-xs font-semibold uppercase tracking-wider font-sans cursor-pointer transition-all"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={modal.onConfirm}
                className="px-5 py-2.5 rounded-xl bg-cyan-accent text-bg-base font-bold text-xs uppercase tracking-wider font-sans hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] cursor-pointer transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-white/5 pb-6 mb-6 w-full">
        <div>
          <h1 className="font-display font-black text-3xl md:text-4xl text-white tracking-tight flex items-center gap-3">
            <LayoutGrid className="w-8 h-8 text-cyan-accent" /> Control Center
          </h1>
          <p className="text-text-secondary font-medium font-sans text-sm md:text-base mt-1">
            Manage photo collections, drag-and-drop orders, and update blog logs.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 hover:border-red-500/30 hover:bg-red-500/5 hover:text-red-400 font-sans text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* Tab Selectors */}
      <div className="flex gap-4 border-b border-white/5 pb-4 mb-8 w-full overflow-x-auto">
        <button
          onClick={() => { setActiveTab("albums"); setSelectedAlbum(null); resetBlogForm(); setShowAddBlog(false); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "albums"
              ? "bg-cyan-accent text-bg-base font-bold shadow-[0_0_12px_rgba(0,240,255,0.25)]"
              : "border border-white/5 text-text-secondary hover:text-white"
          }`}
        >
          <ImageIcon className="w-4 h-4" /> Photo Albums ({albums.length})
        </button>
        <button
          onClick={() => { setActiveTab("blogs"); setSelectedAlbum(null); resetBlogForm(); setShowAddBlog(false); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-sans text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === "blogs"
              ? "bg-cyan-accent text-bg-base font-bold shadow-[0_0_12px_rgba(0,240,255,0.25)]"
              : "border border-white/5 text-text-secondary hover:text-white"
          }`}
        >
          <FileText className="w-4 h-4" /> Blog Posts ({blogs.length})
        </button>
      </div>

      {/* TAB: PHOTO ALBUMS */}
      {activeTab === "albums" && (
        <>
          {!selectedAlbum ? (
            // ================= ALBUM DIRECTORY =================
            <div className="flex flex-col gap-8 w-full animate-in fade-in duration-300">
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

              {/* Albums grid (supporting Drag-and-Drop reordering) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {albums.map((album, idx) => (
                  <div
                    key={album.id || album.slug || idx}
                    draggable
                    onDragStart={(e) => handleAlbumDragStart(e, idx)}

                    onDragOver={(e) => { e.preventDefault(); setDragOverAlbumIndex(idx); }}
                    onDragLeave={() => setDragOverAlbumIndex(null)}
                    onDrop={(e) => handleAlbumDrop(e, idx)}
                    className={`glass-panel border overflow-hidden shadow-2xl flex flex-col group relative transition-all duration-300 cursor-grab active:cursor-grabbing ${
                      dragOverAlbumIndex === idx 
                        ? "border-cyan-accent scale-[1.03] bg-cyan-accent/10 shadow-[0_0_20px_rgba(0,240,255,0.2)] z-10" 
                        : "border-white/5"
                    }`}
                  >
                    <div className="w-full h-44 overflow-hidden relative bg-black select-none pointer-events-none">
                      <img
                        src={album.coverImage}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                      />
                      <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-xs font-sans font-semibold tracking-wide text-cyan-accent">
                        {album.images?.length || 0} Photos
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="font-display font-extrabold text-lg text-white mb-1.5 flex items-center justify-between">
                        <span>{album.title}</span>
                        <span className="text-[10px] font-mono text-cyan-accent/40">Order {album.order}</span>
                      </h3>
                      <p className="text-text-secondary text-xs line-clamp-2 leading-relaxed mb-5 font-sans font-medium flex-grow">
                        {album.description || "No description provided."}
                      </p>

                      <div className="flex items-center justify-between gap-4 mt-auto">
                        <button
                          onClick={() => setSelectedAlbum(album)}
                          className="px-4 py-2 rounded-lg bg-white/5 hover:bg-cyan-accent/15 border border-white/10 hover:border-cyan-accent/30 text-white hover:text-cyan-accent font-sans text-xs font-semibold uppercase tracking-wider transition-all flex-grow justify-center flex items-center gap-1.5 cursor-pointer"
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

                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        disabled={idx === 0}
                        onClick={(e) => { e.stopPropagation(); shiftAlbumOrder(idx, "up"); }}
                        className="p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-white disabled:opacity-40 disabled:hover:scale-100 hover:scale-105 active:scale-95 transition-all hover:text-cyan-accent cursor-pointer"
                        title="Move Album Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        disabled={idx === albums.length - 1}
                        onClick={(e) => { e.stopPropagation(); shiftAlbumOrder(idx, "down"); }}
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
              <div className="flex items-center gap-4 border-b border-white/5 pb-5">
                <button
                  onClick={() => { setSelectedAlbum(null); fetchAlbums(); }}
                  className="p-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-text-secondary hover:text-white transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <span className="text-[11px] font-bold tracking-wider uppercase text-cyan-accent font-mono">Collection Editor</span>
                  <h2 className="font-display font-black text-2xl md:text-3xl text-white mt-0.5">{selectedAlbum.title}</h2>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
                {/* LEFT COLUMN: IMAGES */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-lg text-white">Album Photos ({selectedAlbum.images?.length || 0})</h3>
                    <p className="text-text-secondary text-xs font-sans font-medium hidden md:block">
                      Drag and drop cards or click titles to rename them.
                    </p>
                  </div>

                  {selectedAlbum.images?.length === 0 ? (
                    <div className="w-full py-16 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center text-text-secondary">
                      <ImageIcon className="w-12 h-12 text-white/15 mb-3" />
                      <p className="font-sans font-semibold text-white/60">No photos in this album yet.</p>
                      <p className="text-xs mt-1 font-sans font-medium">Select and upload files using the panel on the right.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                      {selectedAlbum.images.map((photo, idx) => (
                        <div
                          key={photo.id || idx}
                          draggable
                          onDragStart={(e) => handlePhotoDragStart(e, idx)}

                          onDragOver={(e) => { e.preventDefault(); setDragOverPhotoIndex(idx); }}
                          onDragLeave={() => setDragOverPhotoIndex(null)}
                          onDrop={(e) => handlePhotoDrop(e, idx)}
                          className={`glass-panel border rounded-xl overflow-hidden relative group aspect-square flex flex-col bg-black shadow-lg transition-all duration-300 cursor-grab active:cursor-grabbing ${
                            dragOverPhotoIndex === idx
                              ? "border-cyan-accent scale-[1.03] bg-cyan-accent/10 shadow-[0_0_20px_rgba(0,240,255,0.2)] z-10"
                              : "border-white/5"
                          }`}
                        >
                          <img
                            src={photo.url}
                            alt={photo.title}
                            className="w-full h-full object-cover opacity-80 select-none pointer-events-none"
                          />

                          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                            <button
                              onClick={() => handleSetCover(photo.url)}
                              className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-[10px] font-bold font-mono hover:text-cyan-accent text-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
                            >
                              Cover
                            </button>
                            <button
                              onClick={() => handleDeletePhoto(photo.id)}
                              className="p-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-red-400 hover:text-red-300 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Order shift controls */}
                          <div className="absolute bottom-11 inset-x-2.5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                            <button
                              disabled={idx === 0}
                              onClick={() => shiftPhotoOrder(idx, "left")}
                              className="p-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-white disabled:opacity-40 disabled:hover:scale-100 hover:scale-105 active:scale-95 transition-all hover:text-cyan-accent cursor-pointer"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                            <button
                              disabled={idx === selectedAlbum.images.length - 1}
                              onClick={() => shiftPhotoOrder(idx, "right")}
                              className="p-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10 text-white disabled:opacity-40 disabled:hover:scale-100 hover:scale-105 active:scale-95 transition-all hover:text-cyan-accent cursor-pointer"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Image title & click-to-edit */}
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 to-black/0 p-2.5 pt-6 z-10">
                            {editingPhotoId === photo.id ? (
                              <input
                                type="text"
                                value={editingPhotoTitle}
                                onChange={(e) => setEditingPhotoTitle(e.target.value)}
                                className="w-full bg-black/90 border border-cyan-accent/30 text-white rounded px-2 py-1 text-[11px] font-sans outline-none"
                                autoFocus
                                onBlur={() => handleRenamePhotoSubmit(photo.id)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleRenamePhotoSubmit(photo.id);
                                  if (e.key === "Escape") setEditingPhotoId(null);
                                }}
                              />
                            ) : (
                              <div 
                                onClick={() => { setEditingPhotoId(photo.id); setEditingPhotoTitle(photo.title); }}
                                className="flex items-center justify-between text-white hover:text-cyan-accent cursor-pointer group/title transition-all"
                              >
                                <span className="text-[11px] font-sans font-semibold tracking-wide truncate max-w-[85%]">
                                  {photo.title}
                                </span>
                                <Edit2 className="w-3.5 h-3.5 opacity-0 group-hover/title:opacity-100 text-cyan-accent transition-opacity duration-200" />
                              </div>
                            )}
                          </div>

                          <div className="absolute top-2.5 left-2.5 px-2 py-0.5 bg-black/60 backdrop-blur-md rounded border border-white/10 text-[9px] font-mono text-cyan-accent z-10 font-bold">
                            #{photo.order}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN: ACTIONS */}
                <div className="flex flex-col gap-6">
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
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      
                      {uploading ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="w-10 h-10 text-cyan-accent animate-spin mb-3" />
                          <p className="font-sans font-semibold text-sm text-white">Uploading photos...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-10 h-10 text-text-secondary group-hover:text-cyan-accent group-hover:scale-105 transition-all mb-3" />
                          <p className="font-sans font-semibold text-sm text-white">Drag &amp; drop photos here</p>
                          <p className="text-text-secondary text-xs mt-1">Or click to browse</p>
                        </div>
                      )}
                    </div>

                    {uploadQueue.length > 0 && (
                      <div className="flex flex-col gap-2.5 mt-2 border-t border-white/5 pt-4">
                        <p className="text-xs font-mono font-bold text-cyan-accent flex items-center justify-between">
                          <span>Upload Queue</span>
                          <button onClick={() => setUploadQueue([])} className="text-[10px] text-text-secondary hover:text-white uppercase font-sans tracking-wider">
                            Clear
                          </button>
                        </p>
                        
                        <div className="flex flex-col gap-2 max-h-[180px] overflow-y-auto pr-1">
                          {uploadQueue.map((item) => (
                            <div key={item.id} className="bg-white/2 border border-white/5 rounded-xl p-2.5 flex flex-col gap-1.5 relative overflow-hidden">
                              <div className="flex items-center justify-between text-[11px] font-sans">
                                <span className="text-white truncate max-w-[55%] font-medium" title={item.name}>
                                  {item.name}
                                </span>
                                
                                {item.status === "pending" && (
                                  <span className="text-[10px] bg-white/5 text-text-secondary border border-white/10 px-2 py-0.5 rounded-full font-semibold">
                                    Pending
                                  </span>
                                )}
                                {item.status === "converting" && (
                                  <span className="text-[10px] bg-cyan-accent/10 text-cyan-accent border border-cyan-accent/20 px-2 py-0.5 rounded-full font-semibold animate-pulse">
                                    WebP Optimizing...
                                  </span>
                                )}
                                {item.status === "uploading" && (
                                  <span className="text-[10px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full font-semibold">
                                    uploading {item.progress}%
                                  </span>
                                )}
                                {item.status === "success" && (
                                  <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                                    WebP Auto-Converted
                                  </span>
                                )}
                                {item.status === "failed" && (
                                  <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full font-semibold">
                                    Failed
                                  </span>
                                )}
                              </div>

                              <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-300 ${
                                    item.status === "success" ? "bg-emerald-500" : 
                                    item.status === "failed" ? "bg-red-500" : 
                                    "bg-cyan-accent"
                                  }`}
                                  style={{ width: `${item.progress}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Album Config */}
                  <div className="glass-panel border-white/5 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 relative">
                    <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
                      <Settings className="w-5 h-5 text-cyan-accent" /> Album Config
                    </h3>

                    <div className="w-full h-28 rounded-xl overflow-hidden border border-white/5 bg-black relative mb-2">
                      <img
                        src={selectedAlbum.coverImage}
                        alt={selectedAlbum.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center font-display font-extrabold text-[11px] text-white/80">
                        Current Cover Image
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 font-sans font-medium text-xs">
                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-text-secondary mb-1">Album Title</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/2 text-white outline-none focus:border-cyan-accent/30 text-sm font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-text-secondary mb-1">Description</label>
                        <textarea
                          value={editDesc}
                          onChange={(e) => setEditDesc(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/2 text-white outline-none focus:border-cyan-accent/30 text-sm font-sans resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold uppercase tracking-wider text-text-secondary mb-1">URL Slug</label>
                        <input
                          type="text"
                          value={editSlug}
                          onChange={(e) => setEditSlug(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/2 text-text-secondary outline-none focus:border-cyan-accent/30 text-sm font-sans"
                        />
                      </div>

                      <div className="flex items-center justify-between gap-3 mt-1 pt-2 border-t border-white/5">
                        <div className="text-[10px] font-mono text-text-secondary">
                          <div>Index: {selectedAlbum.order}</div>
                          <div>ID: {selectedAlbum.id}</div>
                        </div>
                        <button
                          onClick={handleSaveAlbumConfig}
                          className="px-4 py-2 bg-cyan-accent text-bg-base hover:scale-[1.01] hover:shadow-[0_0_10px_rgba(0,240,255,0.25)] rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                        >
                          Save Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB: BLOG POSTS */}
      {activeTab === "blogs" && (
        <div className="w-full flex flex-col gap-8 animate-in fade-in duration-300">
          {!showAddBlog ? (
            // ================= BLOG DIRECTORY =================
            <div className="flex flex-col gap-6 w-full">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-xl md:text-2xl text-white">Blog Posts ({blogs.length})</h2>
                <button
                  onClick={handleStartCreateBlog}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-accent text-bg-base font-bold font-sans text-xs uppercase tracking-wider hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Write Blog
                </button>
              </div>

              {blogs.length === 0 ? (
                <div className="w-full py-20 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center text-text-secondary">
                  <FileText className="w-12 h-12 text-white/15 mb-3" />
                  <p className="font-sans font-semibold text-white/60">No blog posts found in MongoDB.</p>
                  <p className="text-xs mt-1 font-sans font-medium">Click "Write Blog" at the top to publish your first article.</p>
                </div>
              ) : (
                <div className="glass-panel border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                  <table className="w-full border-collapse text-left font-sans text-xs md:text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/2 text-[10px] font-bold uppercase tracking-wider text-text-secondary">
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Slug</th>
                        <th className="px-6 py-4">Tags</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Reading Time</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-text-secondary">
                      {blogs.map((blog) => (
                        <tr key={blog._id} className="hover:bg-white/2 transition-colors">
                          <td className="px-6 py-4 font-bold text-white max-w-[220px] truncate" title={blog.title}>
                            {blog.title}
                          </td>
                          <td className="px-6 py-4 font-mono text-cyan-accent/80">/{blog.slug}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {(blog.tags || []).map((tag: string) => (
                                <span key={tag} className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-mono">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {blog.status === "published" ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1 w-fit">
                                <Globe className="w-3 h-3" /> Published
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase bg-white/5 text-text-secondary border border-white/10 flex items-center gap-1 w-fit">
                                <EyeOff className="w-3 h-3" /> Draft
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 font-medium">{blog.readingTime} min read</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleStartEditBlog(blog)}
                                className="p-2 rounded-lg border border-white/10 hover:border-cyan-accent/30 hover:bg-cyan-accent/5 text-text-secondary hover:text-cyan-accent transition-all cursor-pointer"
                                title="Edit Post"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteBlog(blog._id, blog.title)}
                                className="p-2 rounded-lg border border-white/10 hover:border-red-500/30 hover:bg-red-500/5 text-text-secondary hover:text-red-400 transition-all cursor-pointer"
                                title="Delete Post"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            // ================= BLOG EDITOR WORKSPACE =================
            <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-left-4 duration-300">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowAddBlog(false)}
                    className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-text-secondary hover:text-white transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-accent font-mono">
                      {editingBlogId ? "Blog Post Editor" : "Markdown Creator"}
                    </span>
                    <h2 className="font-display font-black text-xl md:text-2xl text-white mt-0.5">
                      {editingBlogId ? "Edit Blog Details" : "Compose New Article"}
                    </h2>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowAddBlog(false)}
                    className="px-4 py-2 rounded-xl border border-white/10 text-text-secondary hover:text-white text-xs font-semibold uppercase tracking-wider font-sans cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editingBlogId ? handleSaveBlogEdit : handleCreateBlog}
                    className="px-5 py-2.5 rounded-xl bg-cyan-accent text-bg-base font-bold text-xs uppercase tracking-wider font-sans hover:shadow-[0_0_12px_rgba(0,240,255,0.3)] cursor-pointer"
                  >
                    {editingBlogId ? "Save Post" : "Create Post"}
                  </button>
                </div>
              </div>

              {/* Editor Split Columns */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full items-start">
                
                {/* LEFT 2/3 COLUMN: CONTENT EDITOR */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                  {/* Title & Slug inputs */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary pl-1">Article Title</label>
                      <input
                        type="text"
                        required
                        value={blogTitle}
                        onChange={(e) => handleBlogTitleChange(e.target.value)}
                        placeholder="e.g. Mastering Next.js Turbopack"
                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/2 text-white outline-none focus:border-cyan-accent/30 text-sm font-sans"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary pl-1">URL Slug</label>
                      <input
                        type="text"
                        required
                        value={blogSlug}
                        onChange={(e) => setBlogSlug(e.target.value)}
                        placeholder="e.g. mastering-next-turbopack"
                        className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/2 text-text-secondary outline-none focus:border-cyan-accent/30 text-sm font-sans font-medium"
                      />
                    </div>
                  </div>

                  {/* Summary input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary pl-1">Summary (Lead Paragraph)</label>
                    <textarea
                      required
                      value={blogSummary}
                      onChange={(e) => setBlogSummary(e.target.value)}
                      placeholder="Enter a brief description that captures reader attention on directory lists..."
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-white/2 text-white outline-none focus:border-cyan-accent/30 text-sm font-sans resize-none"
                    />
                  </div>

                  {/* Content workspace block */}
                  <div className="border border-white/10 rounded-2xl overflow-hidden bg-black shadow-xl flex flex-col min-h-[500px]">
                    {/* Toolbar / Tab selector */}
                    <div className="flex items-center justify-between border-b border-white/5 px-4 py-2 bg-white/2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setBlogEditorTab("edit")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                            blogEditorTab === "edit" ? "bg-white/10 text-white" : "text-text-secondary hover:text-white"
                          }`}
                        >
                          Write (Markdown)
                        </button>
                        <button
                          onClick={() => setBlogEditorTab("preview")}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                            blogEditorTab === "preview" ? "bg-white/10 text-white" : "text-text-secondary hover:text-white"
                          }`}
                        >
                          Live Preview
                        </button>
                      </div>

                      {/* Formatting tools inside editor */}
                      {blogEditorTab === "edit" && (
                        <div className="flex items-center gap-1 border-l border-white/5 pl-3">
                          <button
                            onClick={() => insertMarkdownHelper("**", "**")}
                            className="p-2 rounded hover:bg-white/5 text-text-secondary hover:text-white transition-all"
                            title="Bold Text (**)"
                          >
                            <Bold className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => insertMarkdownHelper("## ")}
                            className="p-2 rounded hover:bg-white/5 text-text-secondary hover:text-white transition-all"
                            title="Header 2 (##)"
                          >
                            <Heading className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => insertMarkdownHelper("[", "](url)")}
                            className="p-2 rounded hover:bg-white/5 text-text-secondary hover:text-white transition-all"
                            title="Link ([text](url))"
                          >
                            <Link2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => insertMarkdownHelper("- ")}
                            className="p-2 rounded hover:bg-white/5 text-text-secondary hover:text-white transition-all"
                            title="List (-)"
                          >
                            <List className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => insertMarkdownHelper("> ")}
                            className="p-2 rounded hover:bg-white/5 text-text-secondary hover:text-white transition-all"
                            title="Blockquote (>)"
                          >
                            <Quote className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Editor / Preview Area */}
                    <div className="flex-grow flex flex-col p-4 relative min-h-[420px]">
                      {blogEditorTab === "edit" ? (
                        <textarea
                          ref={textareaRef}
                          value={blogContent}
                          onChange={(e) => setBlogContent(e.target.value)}
                          placeholder="# Start writing your article here...&#10;&#10;Use headings, bullet points, code tags, and links. Attach photos using the configuration panel on the right."
                          className="w-full flex-grow border-0 bg-transparent text-white outline-none font-mono text-sm resize-none focus:ring-0 leading-relaxed min-h-[420px]"
                        />
                      ) : (
                        <div 
                          className="w-full flex-grow prose prose-invert max-w-none text-text-secondary overflow-y-auto leading-relaxed select-none"
                          dangerouslySetInnerHTML={{ __html: markdownToHtml(blogContent) }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: CONFIGS */}
                <div className="flex flex-col gap-6">
                  
                  {/* Photo Attacher Helper widget */}
                  <div className="glass-panel border-white/5 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 relative">
                    <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-cyan-accent" /> Attach Photo
                    </h3>
                    <p className="text-text-secondary text-xs leading-relaxed font-sans font-medium">
                      Select a photo to auto-convert to WebP, upload to Cloudinary, and automatically append to your editor text.
                    </p>

                    <div className="border border-dashed border-white/10 hover:border-cyan-accent/30 bg-white/2 hover:bg-cyan-accent/2 transition-colors rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer relative group/upload">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAttachPhotoToBlog}
                        disabled={uploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
                      />
                      {uploading ? (
                        <div className="flex flex-col items-center">
                          <Loader2 className="w-8 h-8 text-cyan-accent animate-spin mb-2" />
                          <p className="text-[11px] font-sans font-semibold text-white">Uploading &amp; converting...</p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="w-8 h-8 text-text-secondary group-hover/upload:text-cyan-accent group-hover/upload:scale-105 transition-all mb-2" />
                          <p className="text-[11px] font-sans font-semibold text-white">Select Photo</p>
                          <p className="text-[9px] text-text-secondary mt-0.5">Appends Markdown code</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Blog Config Details */}
                  <div className="glass-panel border-white/5 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 relative">
                    <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                      <Settings className="w-4 h-4 text-cyan-accent" /> Post Settings
                    </h3>

                    {/* Cover image input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary pl-1">Cover Image URL</label>
                      <input
                        type="text"
                        value={blogCoverImage}
                        onChange={(e) => setBlogCoverImage(e.target.value)}
                        placeholder="https://images.unsplash.com/... or upload"
                        className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/2 text-white outline-none focus:border-cyan-accent/30 text-xs font-sans"
                      />
                    </div>

                    {/* Tags input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary pl-1">Tags (Comma-Separated)</label>
                      <input
                        type="text"
                        value={blogTagsString}
                        onChange={(e) => setBlogTagsString(e.target.value)}
                        placeholder="e.g. tutorial, nextjs, routing"
                        className="w-full px-3 py-2 rounded-xl border border-white/10 bg-white/2 text-white outline-none focus:border-cyan-accent/30 text-xs font-sans"
                      />
                    </div>

                    {/* Status dropdown */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary pl-1">Publication Status</label>
                      <select
                        value={blogStatus}
                        onChange={(e: any) => setBlogStatus(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-white/10 bg-[#0c0c0e] text-white outline-none focus:border-cyan-accent/30 text-xs font-sans"
                      >
                        <option value="draft">Draft (Private)</option>
                        <option value="published">Published (Public)</option>
                      </select>
                    </div>

                    {errorMsg && (
                      <p className="text-red-500 font-sans text-[11px] text-center font-medium bg-red-500/10 py-2 rounded-lg border border-red-500/20">
                        {errorMsg}
                      </p>
                    )}

                    <div className="flex items-center gap-3 justify-between mt-2 pt-4 border-t border-white/5">
                      <button
                        type="button"
                        onClick={() => setShowAddBlog(false)}
                        className="px-4 py-2 rounded-xl border border-white/10 text-text-secondary hover:text-white text-xs font-semibold uppercase tracking-wider font-sans cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={editingBlogId ? handleSaveBlogEdit : handleCreateBlog}
                        className="px-5 py-2.5 rounded-xl bg-cyan-accent text-bg-base font-bold text-xs uppercase tracking-wider font-sans hover:shadow-[0_0_12px_rgba(0,240,255,0.3)] cursor-pointer"
                      >
                        {editingBlogId ? "Save Post" : "Create Post"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
