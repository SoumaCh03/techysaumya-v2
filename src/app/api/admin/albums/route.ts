import { NextResponse } from "next/server";
import { getAlbums, saveAlbums, Album } from "@/lib/db";
import { isAuthorized } from "@/lib/auth";

// 1. GET (Public): Returns all albums ordered
export async function GET() {
  try {
    const albums = await getAlbums();
    // Sort albums by order index
    const sortedAlbums = [...albums].sort((a, b) => a.order - b.order);
    
    // Sort images within each album by order index
    sortedAlbums.forEach((album) => {
      if (album.images) {
        album.images.sort((a, b) => a.order - b.order);
      }
    });

    return NextResponse.json(sortedAlbums);
  } catch (e) {
    console.error("Albums GET Error:", e);
    return NextResponse.json({ error: "Failed to fetch albums." }, { status: 500 });
  }
}

// 2. POST (Admin Only): Create a new album
export async function POST(req: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, slug, coverImage } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: "Title and slug are required fields." }, { status: 400 });
    }

    const albums = await getAlbums();
    
    // Check if slug is unique
    const slugExists = albums.some((a) => a.slug === slug);
    if (slugExists) {
      return NextResponse.json({ error: "Album slug must be unique." }, { status: 400 });
    }

    const newAlbum: Album = {
      id: `album-${Date.now()}`,
      title,
      description: description || "",
      slug,
      coverImage: coverImage || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
      order: albums.length + 1,
      images: [],
    };

    albums.push(newAlbum);
    await saveAlbums(albums);

    return NextResponse.json({ success: true, album: newAlbum });
  } catch (e) {
    console.error("Albums POST Error:", e);
    return NextResponse.json({ error: "Failed to create album." }, { status: 500 });
  }
}

// 3. PUT (Admin Only): Update album details, list reshuffles, or image placements
export async function PUT(req: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await req.json();
    
    // Can be used for reshuffling albums order, or editing a single album
    const { albums, singleAlbum } = body;

    if (albums && Array.isArray(albums)) {
      // Album Order Reshuffle mode
      // Expects full array of albums with updated orders
      const currentAlbums = await getAlbums();
      
      const updatedAlbums = currentAlbums.map((cur) => {
        const found = (albums as Album[]).find((a) => a.id === cur.id);
        if (found) {
          return { ...cur, order: found.order };
        }
        return cur;
      });

      await saveAlbums(updatedAlbums);
      return NextResponse.json({ success: true, message: "Albums reshuffled successfully." });
    }

    if (singleAlbum && singleAlbum.id) {
      // Single Album editing mode
      const currentAlbums = await getAlbums();
      const idx = currentAlbums.findIndex((a) => a.id === singleAlbum.id);

      if (idx === -1) {
        return NextResponse.json({ error: "Album not found." }, { status: 404 });
      }

      currentAlbums[idx] = {
        ...currentAlbums[idx],
        title: singleAlbum.title ?? currentAlbums[idx].title,
        description: singleAlbum.description ?? currentAlbums[idx].description,
        slug: singleAlbum.slug ?? currentAlbums[idx].slug,
        coverImage: singleAlbum.coverImage ?? currentAlbums[idx].coverImage,
        images: singleAlbum.images ?? currentAlbums[idx].images,
      };

      await saveAlbums(currentAlbums);
      return NextResponse.json({ success: true, album: currentAlbums[idx] });
    }

    return NextResponse.json({ error: "Invalid parameters supplied." }, { status: 400 });
  } catch (e) {
    console.error("Albums PUT Error:", e);
    return NextResponse.json({ error: "Failed to update database." }, { status: 500 });
  }
}

// 4. DELETE (Admin Only): Remove a photo album
export async function DELETE(req: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Album ID is required." }, { status: 400 });
    }

    const currentAlbums = await getAlbums();
    const filteredAlbums = currentAlbums.filter((a) => a.id !== id);

    if (currentAlbums.length === filteredAlbums.length) {
      return NextResponse.json({ error: "Album not found." }, { status: 404 });
    }

    // Re-index remaining albums order
    const updatedAlbums = filteredAlbums.map((a, index) => ({
      ...a,
      order: index + 1,
    }));

    await saveAlbums(updatedAlbums);
    return NextResponse.json({ success: true, message: "Album deleted successfully." });
  } catch (e) {
    console.error("Albums DELETE Error:", e);
    return NextResponse.json({ error: "Failed to delete album." }, { status: 500 });
  }
}

// 5. PATCH (Admin Only): Rename a photo within an album
export async function PATCH(req: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { albumId, photoId, newTitle } = body;

    if (!albumId || !photoId || !newTitle) {
      return NextResponse.json({ error: "albumId, photoId, and newTitle are required." }, { status: 400 });
    }

    const albums = await getAlbums();
    const albumIdx = albums.findIndex((a) => a.id === albumId);
    if (albumIdx === -1) {
      return NextResponse.json({ error: "Album not found." }, { status: 404 });
    }

    const photoIdx = albums[albumIdx].images.findIndex((img) => img.id === photoId);
    if (photoIdx === -1) {
      return NextResponse.json({ error: "Photo not found." }, { status: 404 });
    }

    albums[albumIdx].images[photoIdx].title = newTitle;
    await saveAlbums(albums);

    return NextResponse.json({ success: true, message: "Photo title updated successfully." });
  } catch (e) {
    console.error("Albums PATCH Error:", e);
    return NextResponse.json({ error: "Failed to update photo title." }, { status: 500 });
  }
}

