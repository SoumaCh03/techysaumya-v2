import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import AnalyticsEvent from "@/models/AnalyticsEvent";

export async function GET(req: Request) {
  try {
    // 1. Session verification check
    if (!(await isAuthorized())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url") || "/";
    const range = searchParams.get("range") || "30d";

    const startDate = new Date();
    if (range === "24h") {
      startDate.setHours(startDate.getHours() - 24);
    } else if (range === "7d") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (range === "90d") {
      startDate.setDate(startDate.getDate() - 90);
    } else {
      startDate.setDate(startDate.getDate() - 30);
    }

    // Query coordinate events using the compound index over url and type
    const heatmapEvents = await AnalyticsEvent.find({
      url,
      type: "heatmap",
      timestamp: { $gte: startDate }
    }).lean();

    const points = heatmapEvents
      .map((e) => ({
        x: e.metadata?.x,
        y: e.metadata?.y,
      }))
      .filter((p) => p.x !== undefined && p.y !== undefined);

    return NextResponse.json({
      url,
      pointsCount: points.length,
      points,
    });

  } catch (error) {
    console.error("Heatmap Analytics API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
