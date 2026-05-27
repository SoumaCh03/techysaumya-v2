import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPhotoLike extends Document {
  photoId: string;
  fingerprintHash: string; // Hashed client IP + user-agent
  createdAt: Date;
  updatedAt: Date;
}

const PhotoLikeSchema = new Schema<IPhotoLike>(
  {
    photoId:         { type: String, required: true, index: true },
    fingerprintHash: { type: String, required: true, index: true },
  },
  { timestamps: true }
);

// Compound index enforces that a single device fingerprint can like a specific photo only once
PhotoLikeSchema.index({ photoId: 1, fingerprintHash: 1 }, { unique: true });

const PhotoLike: Model<IPhotoLike> =
  mongoose.models.PhotoLike || mongoose.model<IPhotoLike>("PhotoLike", PhotoLikeSchema);

export default PhotoLike;
