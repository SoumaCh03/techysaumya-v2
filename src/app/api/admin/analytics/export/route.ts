import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import AnalyticsSession from "@/models/AnalyticsSession";

export async function GET(req: Request) {
  try {
    // 1. Session verification check
    if (!(await isAuthorized())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30d";
    const format = searchParams.get("format") || "json";

    const startDate = new Date();
    if (range === "7d") {
      startDate.setDate(startDate.getDate() - 7);
    } else if (range === "90d") {
      startDate.setDate(startDate.getDate() - 90);
    } else {
      startDate.setDate(startDate.getDate() - 30);
    }

    const sessions = await AnalyticsSession.find({ createdAt: { $gte: startDate } })
      .sort({ createdAt: -1 })
      .lean();

    if (format === "csv") {
      const headers = [
        "Session ID",
        "Visitor ID",
        "Device Type",
        "Browser",
        "OS",
        "Country",
        "Region",
        "City",
        "Referrer",
        "Is Bounce",
        "Created At",
        "Updated At"
      ];
      
      const rows = sessions.map((s) => [
        s.sessionId,
        s.visitorId,
        s.deviceType,
        s.browser,
        s.os,
        s.country,
        s.region,
        s.city,
        `"${(s.referrer || "").replace(/"/g, '""')}"`,
        s.isBounce,
        s.createdAt.toISOString(),
        s.updatedAt.toISOString()
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

      return new Response(csvContent, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename=techysaumya_analytics_${range}.csv`,
        },
      });
    }

    // Default: JSON response
    return NextResponse.json(sessions);

  } catch (error) {
    console.error("Export Analytics error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
