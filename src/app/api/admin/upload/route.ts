import { NextResponse } from "next/server";
import { uploadImage } from "@/lib/storage";
import { isAuthorized } from "@/lib/auth";


export async function POST(req: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "Unauthorized access." }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided in request." }, { status: 400 });
    }

    // Convert file to array buffer and then into a node Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Call dynamic storage uploader
    const fileUrl = await uploadImage(buffer, file.name, file.type);

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: file.name,
      mimeType: file.type,
    });
  } catch (e) {
    console.error("Image Upload API Error:", e);
    return NextResponse.json({ error: "Image upload failed." }, { status: 500 });
  }
}
