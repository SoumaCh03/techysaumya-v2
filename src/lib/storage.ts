import fs from "fs";
import path from "path";
import crypto from "crypto";
import sharp from "sharp";

const UPLOADS_DIR = path.join(process.cwd(), "public/uploads");

/**
 * Ensures the uploads directory exists on disk.
 */
function ensureUploadsDirectory() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

/**
 * Handles saving an uploaded file to our unified storage system.
 * Auto-converts to WebP format for optimal space savings and quality.
 * If Cloudinary credentials are provided, uploads to Cloudinary folder "techysaumya".
 * Otherwise, saves locally to public/uploads directory.
 */
export async function uploadImage(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  // 1. Auto-convert image to WebP with Sharp for extreme space savings
  let webpBuffer = fileBuffer;
  let targetMimeType = mimeType;
  let targetFileName = fileName;

  try {
    // Only attempt conversion if the file is indeed an image
    if (mimeType.startsWith("image/")) {
      // 1. Initialize sharp pipeline with auto-rotation (applies orientation before stripping EXIF metadata)
      let pipeline = sharp(fileBuffer).rotate();

      // Read dimensions for adaptive resizing
      const metadata = await pipeline.metadata();
      const width = metadata.width || 0;
      const height = metadata.height || 0;

      if (width > 0 && height > 0) {
        if (width > height) {
          // Landscape: max width 1920px
          if (width > 1920) {
            pipeline = pipeline.resize({ width: 1920, fit: "inside", withoutEnlargement: true });
          }
        } else {
          // Portrait or Square: max height 1600px
          if (height > 1600) {
            pipeline = pipeline.resize({ height: 1600, fit: "inside", withoutEnlargement: true });
          }
        }
      }

      // 2. Adaptive Quality Tuning Loop (Target <= 450KB, Hard Floor quality = 68)
      const qualities = [85, 80, 75, 70, 68];
      let bestBuffer: Buffer | null = null;

      for (const q of qualities) {
        // Clone pipeline to prevent stream consumption issues across iterations
        const tempBuffer = await pipeline.clone().webp({ quality: q }).toBuffer();
        
        // Stop if the file size satisfies our 450KB limit
        if (tempBuffer.length <= 450 * 1024) {
          bestBuffer = tempBuffer;
          break;
        }

        // Fallback to quality 68 if we reach the hard floor and still exceed the limit
        if (q === 68) {
          bestBuffer = tempBuffer;
        }
      }

      if (bestBuffer) {
        webpBuffer = bestBuffer;
      }

      targetMimeType = "image/webp";
      const parsedName = path.parse(fileName);
      targetFileName = `${parsedName.name}.webp`;
    }
  } catch (sharpError) {
    console.error("Sharp WebP conversion failed, using original buffer:", sharpError);
  }

  // 2. Cloudinary Upload Mode (If API credentials are provided)
  if (cloudName && apiKey && apiSecret) {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000).toString();
      const folder = "techysaumya";
      const base64File = `data:${targetMimeType};base64,${webpBuffer.toString("base64")}`;

      // Generate SHA-1 Signature for Cloudinary API security
      // Parameters must be sorted alphabetically: folder, then timestamp
      const signatureStr = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
      const shasum = crypto.createHash("sha1");
      shasum.update(signatureStr);
      const signature = shasum.digest("hex");

      const formData = new FormData();
      formData.append("file", base64File);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);
      formData.append("folder", folder);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const json = await res.json();
        return json.secure_url; // Return high-performance cloud URL
      } else {
        const errText = await res.text();
        console.error("Cloudinary upload API returned error status:", errText);
      }
    } catch (e) {
      console.error("Failed to upload to Cloudinary, falling back to local storage:", e);
    }
  }

  // 3. Local File Upload Mode (Default out-of-the-box local development)
  try {
    ensureUploadsDirectory();

    // Sanitize and generate unique file name
    const hash = crypto.randomBytes(8).toString("hex");
    const parsedName = path.parse(targetFileName);
    const sanitizedFileName = `${parsedName.name.replace(/[^a-zA-Z0-9]/g, "_")}_${hash}${parsedName.ext}`;
    const destinationPath = path.join(UPLOADS_DIR, sanitizedFileName);

    // Save buffer to disk
    fs.writeFileSync(destinationPath, webpBuffer);

    // Return the relative web-accessible URL path
    return `/uploads/${sanitizedFileName}`;
  } catch (e) {
    console.error("Local disk upload failed:", e);
    throw new Error("Failed to save image file.");
  }
}

