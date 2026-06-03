import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import AnalyticsSession from "@/models/AnalyticsSession";
import AnalyticsEvent from "@/models/AnalyticsEvent";

export async function GET() {
  try {
    // 1. Session verification check
    if (!(await isAuthorized())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Session is active if a heartbeat ping or event was written in the last 30 seconds
    const activeThreshold = new Date(Date.now() - 30 * 1000);
    const activeSessions = await AnalyticsSession.find({ updatedAt: { $gte: activeThreshold } }).lean();

    const activeCount = activeSessions.length;

    const devices: Record<string, number> = {};
    const countries: Record<string, number> = {};
    activeSessions.forEach((s) => {
      devices[s.deviceType] = (devices[s.deviceType] || 0) + 1;
      countries[s.country] = (countries[s.country] || 0) + 1;
    });

    const activeSessionIds = activeSessions.map((s) => s.sessionId);
    
    // Find latest pageview event for each active session in the last 5 minutes
    const recentPagesThreshold = new Date(Date.now() - 5 * 60 * 1000);
    const recentPageviews = await AnalyticsEvent.find({
      sessionId: { $in: activeSessionIds },
      type: "pageview",
      timestamp: { $gte: recentPagesThreshold }
    }).sort({ timestamp: -1 }).lean();

    // Map each sessionId to its latest URL
    const userCurrentPage = new Map<string, string>();
    recentPageviews.forEach((e) => {
      if (!userCurrentPage.has(e.sessionId)) {
        userCurrentPage.set(e.sessionId, e.url);
      }
    });

    const activePagesMap: Record<string, number> = {};
    userCurrentPage.forEach((url) => {
      activePagesMap[url] = (activePagesMap[url] || 0) + 1;
    });

    const activePages = Object.entries(activePagesMap)
      .map(([url, count]) => ({ url, count }))
      .sort((a, b) => b.count - a.count);

    // Live Interaction Stream (last 10 click or pageview events across all sessions in last 1 hour)
    const feedThreshold = new Date(Date.now() - 60 * 60 * 1000);
    const recentEvents = await AnalyticsEvent.find({
      type: { $in: ["pageview", "click"] },
      timestamp: { $gte: feedThreshold }
    })
      .sort({ timestamp: -1 })
      .limit(10)
      .lean();

    const liveFeed = recentEvents.map((e) => ({
      id: e._id,
      sessionId: e.sessionId,
      type: e.type,
      url: e.url,
      timestamp: e.timestamp,
      label: e.metadata?.label || e.metadata?.title || "Page View",
    }));

    return NextResponse.json({
      activeCount,
      distributions: {
        devices: Object.entries(devices).map(([name, value]) => ({ name, value })),
        countries: Object.entries(countries).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
      },
      activePages,
      liveFeed,
    });
  } catch (error) {
    console.error("Realtime Analytics API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
