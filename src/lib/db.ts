import { connectDB } from "@/lib/mongoose";
import AlbumModel from "@/models/Album";

export interface Photo {
  id: string;
  url: string;
  title: string;
  order: number;
  likesCount?: number;
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

export async function getAlbums(): Promise<Album[]> {
  await connectDB();
  let dbAlbums = await AlbumModel.find().sort({ order: 1 }).lean();

  if (dbAlbums.length === 0) {
    console.log("No albums found in MongoDB. Seeding DEFAULT_ALBUMS...");
    const seedData = DEFAULT_ALBUMS.map((a) => ({
      albumId: a.id,
      title: a.title,
      description: a.description,
      slug: a.slug,
      coverImage: a.coverImage,
      order: a.order,
      images: a.images.map((img) => ({
        id: img.id,
        url: img.url,
        title: img.title,
        order: img.order,
      })),
    }));
    await AlbumModel.insertMany(seedData);
    dbAlbums = await AlbumModel.find().sort({ order: 1 }).lean();
  }

  return dbAlbums.map((a) => ({
    id: a.albumId,
    title: a.title,
    description: a.description,
    slug: a.slug,
    coverImage: a.coverImage,
    order: a.order,
    images: (a.images || []).map((img: Photo) => ({
      id: img.id,
      url: img.url,
      title: img.title,
      order: img.order,
      likesCount: img.likesCount || 0,
    })),
  }));
}

export async function saveAlbums(albums: Album[]): Promise<boolean> {
  try {
    await connectDB();

    const inputIds = albums.map((a) => a.id);

    // Delete any album not in inputIds
    await AlbumModel.deleteMany({ albumId: { $nin: inputIds } });

    // Upsert each album
    for (const a of albums) {
      await AlbumModel.findOneAndUpdate(
        { albumId: a.id },
        {
          title: a.title,
          description: a.description,
          slug: a.slug,
          coverImage: a.coverImage,
          order: a.order,
          images: (a.images || []).map((img: Photo) => ({
            id: img.id,
            url: img.url,
            title: img.title,
            order: img.order,
            likesCount: img.likesCount || 0,
          })),
        },
        { upsert: true, new: true }
      );
    }

    return true;
  } catch (e) {
    console.error("MongoDB saveAlbums error:", e);
    return false;
  }
}

