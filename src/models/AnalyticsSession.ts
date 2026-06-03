import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnalyticsSession extends Document {
  sessionId: string;
  visitorId: string;
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;
  country: string;
  region: string;
  city: string;
  referrer: string;
  isBounce: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AnalyticsSessionSchema = new Schema<IAnalyticsSession>(
  {
    sessionId:  { type: String, required: true, unique: true, index: true },
    visitorId:  { type: String, required: true, index: true },
    deviceType: { type: String, required: true, enum: ["desktop", "mobile", "tablet"] },
    browser:    { type: String, required: true },
    os:         { type: String, required: true },
    country:    { type: String, default: "Unknown" },
    region:     { type: String, default: "Unknown" },
    city:       { type: String, default: "Unknown" },
    referrer:   { type: String, default: "" },
    isBounce:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Optimize queries over session creation dates and heartbeat updates
AnalyticsSessionSchema.index({ createdAt: -1 });
AnalyticsSessionSchema.index({ updatedAt: -1 });

const AnalyticsSession: Model<IAnalyticsSession> =
  mongoose.models.AnalyticsSession ||
  mongoose.model<IAnalyticsSession>("AnalyticsSession", AnalyticsSessionSchema);

export default AnalyticsSession;
