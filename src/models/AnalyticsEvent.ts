import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnalyticsEvent extends Document {
  sessionId: string;
  type: "pageview" | "click" | "scroll" | "section" | "heatmap";
  url: string;
  metadata: Record<string, unknown>;
  timestamp: Date;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>({
  sessionId: { type: String, required: true, index: true },
  type: {
    type: String,
    required: true,
    enum: ["pageview", "click", "scroll", "section", "heatmap"],
    index: true,
  },
  url: { type: String, required: true, index: true },
  metadata: { type: Schema.Types.Mixed, default: {} },
  timestamp: { type: Date, default: Date.now, index: true },
});

// Compound index for querying events by session
AnalyticsEventSchema.index({ sessionId: 1, type: 1 });
// Compound index for querying events by URL and type (e.g., click coordinates per URL for heatmaps)
AnalyticsEventSchema.index({ url: 1, type: 1 });
// Date index for query speed and data retention cleaning
AnalyticsEventSchema.index({ timestamp: -1 });

const AnalyticsEvent: Model<IAnalyticsEvent> =
  mongoose.models.AnalyticsEvent ||
  mongoose.model<IAnalyticsEvent>("AnalyticsEvent", AnalyticsEventSchema);

export default AnalyticsEvent;
