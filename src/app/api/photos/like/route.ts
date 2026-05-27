import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import PhotoLike from "@/models/PhotoLike";
import AlbumModel from "@/models/Album";
import crypto from "crypto";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    // 1. IP-based rate limiting (30 likes/unlikes per minute)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || 
               req.headers.get("x-real-ip") || 
               "127.0.0.1";
    
    const limitResult = rateLimit(ip, 30, 60 * 1000);
    if (!limitResult.success) {
      return NextResponse.json(
        { error: `Too many requests. Please try again in ${limitResult.reset} seconds.` },
        { 
          status: 429,
          headers: {
            "Retry-After": limitResult.reset.toString()
          }
        }
      );
    }

    const body = await req.json();
    const { photoId } = body;

    if (!photoId) {
      return NextResponse.json({ error: "Photo ID is required." }, { status: 400 });
    }

    // Connect to database
    await connectDB();

    // Extract headers to compute device fingerprint hash
    const userAgent = req.headers.get("user-agent") || "";
    const acceptLanguage = req.headers.get("accept-language") || "";
    
    const rawString = `${ip}-${userAgent}-${acceptLanguage}`;
    const fingerprintHash = crypto.createHash("sha256").update(rawString).digest("hex");

    // Check if like already exists for this fingerprint and photo
    const existingLike = await PhotoLike.findOne({ photoId, fingerprintHash });
    let liked = false;

    if (existingLike) {
      // Toggle off: Unlike photo
      await PhotoLike.deleteOne({ _id: existingLike._id });
      
      // Atomically decrement likesCount on the nested photo document inside Album
      await AlbumModel.updateOne(
        { "images.id": photoId },
        { $inc: { "images.$.likesCount": -1 } }
      );
      liked = false;
    } else {
      // Toggle on: Like photo
      try {
        await PhotoLike.create({ photoId, fingerprintHash });
        
        // Atomically increment likesCount on the nested photo document inside Album
        await AlbumModel.updateOne(
          { "images.id": photoId },
          { $inc: { "images.$.likesCount": 1 } }
        );
        liked = true;
      } catch (err: unknown) {
        if (err && typeof err === "object" && "code" in err && err.code === 11000) {
          // Double submission / race condition: already liked
          liked = true;
        } else {
          throw err;
        }
      }
    }

    // Retrieve the updated likesCount from the database
    const updatedAlbum = await AlbumModel.findOne({ "images.id": photoId }).lean();
    const photo = updatedAlbum?.images.find((img: { id: string; likesCount?: number }) => img.id === photoId);
    const likesCount = photo?.likesCount || 0;

    return NextResponse.json({ success: true, liked, likesCount });
  } catch (e) {
    console.error("Photos Like API Error:", e);
    return NextResponse.json({ error: "Failed to toggle like." }, { status: 500 });
  }
}
