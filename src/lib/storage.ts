import fs from "fs";
import path from "path";
import crypto from "crypto";

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
 * If Cloudinary environment variables are available, it pipes the file to the cloud.
 * Otherwise, it saves it directly to local disk for seamless development.
 */
export async function uploadImage(fileBuffer: Buffer, fileName: string, mimeType: string): Promise<string> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  // 1. Cloudinary Upload Mode (If API credentials are provided)
  if (cloudName && apiKey && apiSecret) {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000).toString();
      const base64File = `data:${mimeType};base64,${fileBuffer.toString("base64")}`;

      // Generate SHA-1 Signature for Cloudinary API security
      const signatureStr = `timestamp=${timestamp}${apiSecret}`;
      const shasum = crypto.createHash("sha1");
      shasum.update(signatureStr);
      const signature = shasum.digest("hex");

      const formData = new URLSearchParams();
      formData.append("file", base64File);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp);
      formData.append("signature", signature);

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

  // 2. Local File Upload Mode (Default out-of-the-box local development)
  try {
    ensureUploadsDirectory();

    // Sanitize and generate unique file name
    const hash = crypto.randomBytes(8).toString("hex");
    const parsedName = path.parse(fileName);
    const sanitizedFileName = `${parsedName.name.replace(/[^a-zA-Z0-9]/g, "_")}_${hash}${parsedName.ext}`;
    const destinationPath = path.join(UPLOADS_DIR, sanitizedFileName);

    // Save buffer to disk
    fs.writeFileSync(destinationPath, fileBuffer);

    // Return the relative web-accessible URL path
    return `/uploads/${sanitizedFileName}`;
  } catch (e) {
    console.error("Local disk upload failed:", e);
    throw new Error("Failed to save image file.");
  }
}
