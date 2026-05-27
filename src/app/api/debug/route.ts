import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";

export async function GET() {
  try {
    const hasUri = !!process.env.MONGODB_URI;
    const uriLength = process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0;
    const uriPrefix = process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) : "none";

    let connectionStatus = "disconnected";
    let errorMessage = null;
    let errorStack = null;

    try {
      await connectDB();
      connectionStatus = "connected successfully";
    } catch (err: any) {
      connectionStatus = "failed";
      errorMessage = err.message || String(err);
      errorStack = err.stack || null;
    }

    return NextResponse.json({
      hasUri,
      uriLength,
      uriPrefix,
      connectionStatus,
      errorMessage,
      errorStack,
      nodeVersion: process.version,
      env: process.env.NODE_ENV,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || String(e) }, { status: 500 });
  }
}
