import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import AnalyticsSession from "@/models/AnalyticsSession";
import AnalyticsEvent from "@/models/AnalyticsEvent";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { sessionId, events, sessionData } = body;

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Session ID required" }, { status: 400 });
    }

    // Resolve location parameters via Vercel headers, falling back to local defaults for localhost/dev
    const country = req.headers.get("x-vercel-ip-country") || "India";
    const region = req.headers.get("x-vercel-ip-country-region") || "West Bengal";
    const city = req.headers.get("x-vercel-ip-city") || "Cooch Behar";

    // Ensure the session is registered in the database
    let session = await AnalyticsSession.findOne({ sessionId });
    if (!session && sessionData) {
      session = await AnalyticsSession.create({
        sessionId,
        visitorId: sessionData.visitorId || "unknown",
        deviceType: sessionData.deviceType || "desktop",
        browser: sessionData.browser || "Others",
        os: sessionData.os || "Others",
        referrer: sessionData.referrer || "",
        country,
        region,
        city,
        isBounce: true,
      });
    }

    interface IncomingEvent {
      type: "pageview" | "click" | "scroll" | "section" | "heatmap";
      url: string;
      metadata?: Record<string, unknown>;
      timestamp?: string | Date;
    }

    // Insert telemetry events in batches if present
    if (events && Array.isArray(events) && events.length > 0) {
      const parsedEvents = events.map((event: IncomingEvent) => ({
        sessionId,
        type: event.type,
        url: event.url,
        metadata: event.metadata || {},
        timestamp: event.timestamp ? new Date(event.timestamp) : new Date(),
      }));

      await AnalyticsEvent.insertMany(parsedEvents);

      // If we observe scroll, click, section or multiple navigation events, it is not a bounce
      const hasInteraction = events.some(
        (e: IncomingEvent) => e.type === "click" || e.type === "scroll" || e.type === "section"
      );
      if (hasInteraction && session && session.isBounce) {
        session.isBounce = false;
        await session.save();
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics collection endpoint error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
