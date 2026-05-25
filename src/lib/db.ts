import fs from "fs";
import path from "path";

export interface Photo {
  id: string;
  url: string;
  title: string;
  order: number;
}

export interface Album {
  id: string;
  title: string;
  description: string;
  slug: string;
  coverImage: string;
  order: number;
  images: Photo[];
}

const LOCAL_DB_PATH = path.join(process.cwd(), "src/data/albums.json");

// Pre-seeded authentic albums to make the portfolio look premium on first load
const DEFAULT_ALBUMS: Album[] = [
  {
    id: "album-nongjrong",
    title: "Nongjrong Clouds",
    description: "Witnessing the breathtaking sea of clouds floating through the Nongjrong valley of Meghalaya at sunrise.",
    slug: "nongjrong",
    coverImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
    order: 1,
    images: [
      {
        id: "nj-1",
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&auto=format&fit=crop&q=80",
        title: "Golden Hour Valley",
        order: 1
      },
      {
        id: "nj-2",
        url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1200&auto=format&fit=crop&q=80",
        title: "Sea of Clouds",
        order: 2
      },
      {
        id: "nj-3",
        url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&auto=format&fit=crop&q=80",
        title: "Meghalaya Ridges",
        order: 3
      }
    ]
  },
  {
    id: "album-banaras",
    title: "Banaras Ghats",
    description: "The timeless essence of Varanasi ghats, glowing clay lamps, evening prayers, and reflections over the sacred Ganges.",
    slug: "banaras",
    coverImage: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=800&auto=format&fit=crop&q=80",
    order: 2,
    images: [
      {
        id: "bn-1",
        url: "https://images.unsplash.com/photo-1561361058-c24cecae35ca?w=1200&auto=format&fit=crop&q=80",
        title: "Ganga Aarti Light",
        order: 1
      },
      {
        id: "bn-2",
        url: "https://images.unsplash.com/photo-1590073844006-33379778ae09?w=1200&auto=format&fit=crop&q=80",
        title: "Rowing into Sunrise",
        order: 2
      }
    ]
  },
  {
    id: "album-touring",
    title: "Highway Touring",
    description: "Moments captured from two wheels, cruising along lonely highways and chasing sunsets on touring expeditions.",
    slug: "touring",
    coverImage: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80",
    order: 3,
    images: [
      {
        id: "tr-1",
        url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=1200&auto=format&fit=crop&q=80",
        title: "Highway Sunset Cruising",
        order: 1
      },
      {
        id: "tr-2",
        url: "https://images.unsplash.com/photo-1471466054146-e71bcc0d2bb2?w=1200&auto=format&fit=crop&q=80",
        title: "Mountains and Motorcycles",
        order: 2
      }
    ]
  }
];

// Helper to guarantee directories exist
function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// In-memory cache for production fallback if no cloud DB is configured
let inMemoryAlbumsCache: Album[] | null = null;

export async function getAlbums(): Promise<Album[]> {
  // If Vercel Blob Token is set, fetch database dynamically
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      // In production we can fetch it from Vercel Blob
      // If not initialized yet, we will fallback to default
      const res = await fetch("https://techysaumyadeep.vercel.app/api/admin/albums", {
        cache: "no-store"
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn("Vercel Blob database read error, falling back to cache.", e);
    }
  }

  // Local Disk Mode
  try {
    if (fs.existsSync(LOCAL_DB_PATH)) {
      const data = fs.readFileSync(LOCAL_DB_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Local database read error:", e);
  }

  // Fallback
  if (!inMemoryAlbumsCache) {
    inMemoryAlbumsCache = [...DEFAULT_ALBUMS];
    saveAlbums(inMemoryAlbumsCache); // Seed local file
  }
  return inMemoryAlbumsCache;
}

export async function saveAlbums(albums: Album[]): Promise<boolean> {
  // Update cache
  inMemoryAlbumsCache = albums;

  // Local Disk Mode
  try {
    ensureDirectoryExistence(LOCAL_DB_PATH);
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(albums, null, 2), "utf-8");
    return true;
  } catch (e) {
    console.error("Local database save error:", e);
    return false;
  }
}
