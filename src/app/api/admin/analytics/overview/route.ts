import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import AnalyticsSession from "@/models/AnalyticsSession";
import AnalyticsEvent from "@/models/AnalyticsEvent";

export async function GET(req: Request) {
  try {
    // 1. Session verification check
    if (!(await isAuthorized())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "7d"; // 24h, 7d, 30d, 90d
    const startDate = new Date();

    if (range === "24h") {
      startDate.setHours(startDate.getHours() - 24);
    } else if (range === "30d") {
      startDate.setDate(startDate.getDate() - 30);
    } else if (range === "90d") {
      startDate.setDate(startDate.getDate() - 90);
    } else {
      startDate.setDate(startDate.getDate() - 7);
    }

    // A. Query Sessions
    const sessions = await AnalyticsSession.find({ createdAt: { $gte: startDate } }).lean();

    const totalSessions = sessions.length;
    const uniqueVisitorIds = new Set(sessions.map((s) => s.visitorId));
    const uniqueVisitorsCount = uniqueVisitorIds.size;

    // Returning sessions calculation (visitor had another session in the dataset)
    const visitorSessionCounts = new Map<string, number>();
    sessions.forEach((s) => {
      visitorSessionCounts.set(s.visitorId, (visitorSessionCounts.get(s.visitorId) || 0) + 1);
    });
    
    let returningSessionsCount = 0;
    visitorSessionCounts.forEach((count) => {
      if (count > 1) {
        returningSessionsCount += (count - 1);
      }
    });

    // Bounce Rate calculation
    const bounceSessions = sessions.filter((s) => s.isBounce).length;
    const bounceRate = totalSessions > 0 ? parseFloat(((bounceSessions / totalSessions) * 100).toFixed(1)) : 0;

    // Average session duration
    let totalDurationMs = 0;
    let validSessionCount = 0;
    sessions.forEach((s) => {
      const duration = s.updatedAt.getTime() - s.createdAt.getTime();
      if (duration >= 0) {
        totalDurationMs += duration;
        validSessionCount++;
      }
    });
    const avgSessionDuration = validSessionCount > 0 ? Math.round(totalDurationMs / validSessionCount / 1000) : 0;

    // B. Group distributions: Device, Browser, OS, Geography
    const devices: Record<string, number> = {};
    const browsers: Record<string, number> = {};
    const operatingSystems: Record<string, number> = {};
    const geography: Record<string, number> = {};

    sessions.forEach((s) => {
      devices[s.deviceType] = (devices[s.deviceType] || 0) + 1;
      browsers[s.browser] = (browsers[s.browser] || 0) + 1;
      operatingSystems[s.os] = (operatingSystems[s.os] || 0) + 1;
      const geoKey = `${s.city}, ${s.region}, ${s.country}`;
      geography[geoKey] = (geography[geoKey] || 0) + 1;
    });

    const formatDonut = (obj: Record<string, number>) => 
      Object.entries(obj).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);

    // C. Query pageviews and clicks from AnalyticsEvent
    const sessionIds = sessions.map((s) => s.sessionId);
    const events = await AnalyticsEvent.find({
      sessionId: { $in: sessionIds },
      timestamp: { $gte: startDate }
    }).lean();

    const pagesMap: Record<string, number> = {};
    const clicksMap: Record<string, number> = {};
    const sectionsMap: Record<string, { count: number; totalDuration: number }> = {};
    const scrollsMap: Record<string, number> = {};

    events.forEach((e) => {
      if (e.type === "pageview") {
        pagesMap[e.url] = (pagesMap[e.url] || 0) + 1;
      } else if (e.type === "click") {
        const label = String(e.metadata?.label || "Unnamed Clickable");
        clicksMap[label] = (clicksMap[label] || 0) + 1;
      } else if (e.type === "section") {
        const name = String(e.metadata?.sectionName || "Unknown Section");
        const dur = Number(e.metadata?.duration) || 0;
        if (!sectionsMap[name]) {
          sectionsMap[name] = { count: 0, totalDuration: 0 };
        }
        sectionsMap[name].count++;
        sectionsMap[name].totalDuration += dur;
      } else if (e.type === "scroll") {
        const depth = Number(e.metadata?.depth) || 0;
        scrollsMap[depth] = (scrollsMap[depth] || 0) + 1;
      }
    });

    const topPages = Object.entries(pagesMap)
      .map(([url, count]) => ({ url, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topClicks = Object.entries(clicksMap)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const topSections = Object.entries(sectionsMap)
      .map(([name, data]) => ({
        name,
        views: data.count,
        avgDuration: Math.round(data.totalDuration / data.count)
      }))
      .sort((a, b) => b.views - a.views);

    // D. Assemble Date-aligned Time-Series (prevent chart holes)
    const timeSeriesMap: Record<string, { date: string; views: number; sessions: number }> = {};
    const daysToGenerate = range === "24h" ? 24 : range === "30d" ? 30 : range === "90d" ? 90 : 7;
    
    for (let i = 0; i < daysToGenerate; i++) {
      const d = new Date();
      if (range === "24h") {
        d.setHours(d.getHours() - i);
        const hourStr = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }) + ` ${d.getHours()}:00`;
        timeSeriesMap[hourStr] = { date: hourStr, views: 0, sessions: 0 };
      } else {
        d.setDate(d.getDate() - i);
        const dateStr = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
        timeSeriesMap[dateStr] = { date: dateStr, views: 0, sessions: 0 };
      }
    }

    sessions.forEach((s) => {
      const d = new Date(s.createdAt);
      let dateKey = "";
      if (range === "24h") {
        dateKey = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }) + ` ${d.getHours()}:00`;
      } else {
        dateKey = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      }
      if (timeSeriesMap[dateKey]) {
        timeSeriesMap[dateKey].sessions++;
      }
    });

    events.forEach((e) => {
      if (e.type !== "pageview") return;
      const d = new Date(e.timestamp);
      let dateKey = "";
      if (range === "24h") {
        dateKey = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }) + ` ${d.getHours()}:00`;
      } else {
        dateKey = d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      }
      if (timeSeriesMap[dateKey]) {
        timeSeriesMap[dateKey].views++;
      }
    });

    const timeSeries = Object.values(timeSeriesMap).reverse();

    return NextResponse.json({
      summary: {
        totalSessions,
        uniqueVisitors: uniqueVisitorsCount,
        returningSessions: returningSessionsCount,
        bounceRate,
        avgSessionDuration,
      },
      distributions: {
        devices: formatDonut(devices),
        browsers: formatDonut(browsers),
        operatingSystems: formatDonut(operatingSystems),
        geography: Object.entries(geography)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 10),
      },
      topPages,
      topClicks,
      topSections,
      scrolls: Object.entries(scrollsMap).map(([depth, count]) => ({ depth: Number(depth), count })).sort((a, b) => a.depth - b.depth),
      timeSeries,
    });

  } catch (error) {
    console.error("Analytics Overview API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
