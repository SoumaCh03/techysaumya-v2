import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPhoto {
  id: string;
  url: string;
  title: string;
  order: number;
}

export interface IAlbum extends Document {
  albumId: string;       // Our custom string ID (e.g. "album-touring")
  title: string;
  description: string;
  slug: string;
  coverImage: string;
  order: number;
  images: IPhoto[];
}

const PhotoSchema = new Schema<IPhoto>(
  {
    id:    { type: String, required: true },
    url:   { type: String, required: true },
    title: { type: String, required: true, default: "Photo" },
    order: { type: Number, required: true },
  },
  { _id: false }
);

const AlbumSchema = new Schema<IAlbum>(
  {
    albumId:     { type: String, required: true, unique: true },
    title:       { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    slug:        { type: String, required: true, unique: true, trim: true, lowercase: true },
    coverImage:  { type: String, default: "" },
    order:       { type: Number, required: true, default: 0 },
    images:      { type: [PhotoSchema], default: [] },
  },
  { timestamps: true }
);

// Index for fast ordered queries
AlbumSchema.index({ order: 1 });
AlbumSchema.index({ slug: 1 });

const Album: Model<IAlbum> =
  mongoose.models.Album || mongoose.model<IAlbum>("Album", AlbumSchema);

export default Album;
