import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import AnalyticsSession from "@/models/AnalyticsSession";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Session ID required" }, { status: 400 });
    }

    const session = await AnalyticsSession.findOne({ sessionId });
    if (session) {
      session.updatedAt = new Date();
      session.isBounce = false; // Staying engaged beyond 20 seconds is not a bounce
      await session.save();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics ping heartbeat error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
