import { NextResponse } from "next/server";
import { isAuthorized } from "@/lib/auth";
import { connectDB } from "@/lib/mongoose";
import mongoose from "mongoose";
import AnalyticsSession from "@/models/AnalyticsSession";
import AnalyticsEvent from "@/models/AnalyticsEvent";

export async function GET() {
  try {
    // 1. Session verification check
    if (!(await isAuthorized())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection unavailable");
    }
    
    const settingsCollection = db.collection("system_settings");
    const doc = await settingsCollection.findOne({ key: "data_retention" });
    const retentionDays = doc ? doc.value : 90; // Default to 90 days retention

    return NextResponse.json({ retentionDays });
  } catch (error) {
    console.error("GET Analytics Settings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // 1. Session verification check
    if (!(await isAuthorized())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection unavailable");
    }

    const body = await req.json();
    const { retentionDays, action } = body;

    const settingsCollection = db.collection("system_settings");

    if (action === "prune") {
      // Run database pruning logic
      const doc = await settingsCollection.findOne({ key: "data_retention" });
      const days = doc ? doc.value : 90;

      if (days > 0) {
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() - days);

        const deletedSessions = await AnalyticsSession.deleteMany({ createdAt: { $lt: thresholdDate } });
        const deletedEvents = await AnalyticsEvent.deleteMany({ timestamp: { $lt: thresholdDate } });

        return NextResponse.json({
          success: true,
          message: `Pruning completed successfully. Deleted ${deletedSessions.deletedCount} sessions and ${deletedEvents.deletedCount} events older than ${days} days.`,
        });
      } else {
        return NextResponse.json({
          success: true,
          message: "Pruning skipped. Retention policy is set to keep data indefinitely (0 days).",
        });
      }
    }

    // Save settings
    if (retentionDays === undefined || typeof retentionDays !== "number" || retentionDays < 0) {
      return NextResponse.json({ error: "Invalid retention days value" }, { status: 400 });
    }

    await settingsCollection.updateOne(
      { key: "data_retention" },
      { $set: { value: retentionDays, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: `Retention policy updated to ${retentionDays} days.` });

  } catch (error) {
    console.error("POST Analytics Settings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
